"use client";
import { useCreateOrganization } from "@/app/api-client/organization/useCreateOrganization";
import { CreateOrganizationSchema } from "@/schemas/organization.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";
import { OrganizationNameInput } from "@/app/api/auth/types";
import { useApi } from "@/providers/ApiProvider";

const CreateOrganizationForm = () => {
  const router = useRouter();
  const { jsonApiClient } = useApi();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationNameInput>({
    mode: "onSubmit",
    shouldFocusError: true,
    resolver: zodResolver(CreateOrganizationSchema),
  });

  return (
    <form
      className="flex w-full flex-col space-y-1"
      onSubmit={handleSubmit(async (values) => {
        try {
          const { data } = await jsonApiClient.post("/organization", values);

          const orgId = data.data.organization;
          const token = data.token;

          Cookie.set(cookieKeys.USER_TOKEN, token);
          reset();

          router.push(`/dashboard/owner/organizations/${orgId}`);
        } catch (error: any) {
          const message =
            error?.response?.data?.error?.message ||
            "Failed to create organization";
          console.error(message);
        }
      })}
    >
      <label className="text-sm font-medium">Organization Name</label>
      <input
        {...register("name")}
        className="rounded border p-2"
        placeholder="Enter your organization name"
      />
      {errors.name && (
        <span className="text-xs text-red-500">{errors.name.message}</span>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 rounded bg-blue-600 px-4 py-2 text-white"
      >
        {isSubmitting ? "Creating..." : "Create Organization"}
      </button>
    </form>
  );
};

export default CreateOrganizationForm;
