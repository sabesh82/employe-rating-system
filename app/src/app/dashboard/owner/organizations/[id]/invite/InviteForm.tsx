"use client";

import { useApi } from "@/providers/ApiProvider";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type InviteFormInputs = {
  email: string;
  role: "SUPERVISOR" | "EMPLOYEE";
};

interface InviteFormProps {
  organizationId: string;
}

const InviteForm: React.FC<InviteFormProps> = ({ organizationId }) => {
  const { jsonApiClient } = useApi();
  console.log("Organization ID:", organizationId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<InviteFormInputs>({
    defaultValues: {
      email: "",
      role: "EMPLOYEE",
    },
  });

  const onSubmit: SubmitHandler<InviteFormInputs> = async (data) => {
    console.log("Submitting invite with data:", data);
    console.log("Organization ID:", organizationId);

    try {
      const response = await jsonApiClient.post(
        `/organization/${organizationId}/invite`,
        data,
      );
      console.log("Response:", response.data);

      if (response.data.success) {
        alert(`Invite sent successfully to ${data.email}`);
        reset();
      } else {
        console.warn("Backend responded with success: false", response.data);
        alert(
          `Failed to send invite: ${response.data.error?.message || "Unknown error"}`,
        );
      }
    } catch (error: any) {
      console.error("Invite error (full):", error);

      if (error.response) {
        console.error("Invite error (response):", error.response.data);
        alert(
          `Error: ${error.response.data?.message || "Invite failed with response error"}`,
        );
      } else if (error.request) {
        console.error("Invite error (request):", error.request);
        alert(
          "No response received from server. Check if your backend is running.",
        );
      } else {
        alert(`Unexpected error: ${error.message}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md p-4">
      <div className="mb-4">
        <label htmlFor="email" className="mb-1 block font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="user@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className={`w-full rounded border px-3 py-2 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="role" className="mb-1 block font-semibold">
          Role
        </label>
        <select
          id="role"
          {...register("role", { required: true })}
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="SUPERVISOR">Supervisor</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Sending..." : "Send Invite"}
      </button>
    </form>
  );
};

export default InviteForm;
