"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AcceptInviteUserSchema } from "@/schemas/user.schema";
import { useAuthActions } from "@/stores/authStore";
import { useApi } from "@/providers/ApiProvider";
import toast from "react-hot-toast";

type AcceptInviteForm = z.infer<typeof AcceptInviteUserSchema>;

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const { jsonApiClient } = useApi();
  const { setAuthToken, setUser } = useAuthActions();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AcceptInviteForm>({
    resolver: zodResolver(AcceptInviteUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      token: token,
    },
  });

  // Ensure token is set in the form if URL changes
  useEffect(() => {
    setValue("token", token);
    if (!token) {
      toast.error("Invitation token is missing in the URL.");
    }
  }, [token, setValue]);

  const onSubmit = async (data: AcceptInviteForm) => {
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      return;
    }

    setLoading(true);

    try {
      const res = await jsonApiClient.post("/auth/accept-invite", data);

      // Access response data correctly
      if (res.data.success && res.data.data.token && res.data.data.user) {
        setAuthToken(res.data.data.token);
        setUser(res.data.data.user);
        toast.success("Invitation accepted successfully!");
        const role = res.data.data.user.role;
        console.log("User role is:", role);

        if (role === "EMPLOYEE") {
          router.push("/dashboard/employee");
        } else if (role === "SUPERVISOR") {
          router.push("/dashboard/supervisor");
        } else {
          router.push("/dashboard");
        }
      } else {
        toast.error(res.data.error?.message || "Failed to accept invitation");
      }
    } catch (error: any) {
      console.error("Invite acceptance error:", error);
      toast.error(
        error.response?.data?.error?.message || "Failed to accept invitation",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="p-8 text-center font-semibold text-red-600">
        Invalid or missing invitation token.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 max-w-md rounded border p-6 shadow-md">
      <h1 className="mb-4 text-xl font-bold">Complete Your Registration</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("token")} />

        <div>
          <label className="mb-1 block font-medium">First Name</label>
          <input
            className="w-full rounded border p-2"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">Last Name</label>
          <input
            className="w-full rounded border p-2"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded border p-2"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Accept Invitation"}
        </button>
      </form>
    </div>
  );
}
