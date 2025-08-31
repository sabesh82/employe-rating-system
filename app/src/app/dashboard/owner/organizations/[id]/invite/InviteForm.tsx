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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-md space-y-6 rounded-lg border bg-white p-6 shadow-lg dark:border-white/50 dark:bg-gray-700 dark:text-gray-100"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-medium text-gray-700 dark:text-gray-200"
        >
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
          className={`w-full rounded-md border px-4 py-3 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
            errors.email
              ? "border-red-500 dark:border-red-400"
              : "border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          }`}
        />
        {errors.email && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-2 block font-medium text-gray-700 dark:text-gray-200"
        >
          Role
        </label>
        <select
          id="role"
          {...register("role", { required: true })}
          className="w-full rounded-md border border-gray-300 px-4 py-3 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="SUPERVISOR">Supervisor</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-indigo-600 dark:hover:bg-indigo-700"
      >
        {isSubmitting ? "Sending..." : "Send Invite"}
      </button>
    </form>
  );
};

export default InviteForm;
