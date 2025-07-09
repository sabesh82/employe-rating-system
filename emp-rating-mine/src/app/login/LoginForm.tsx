"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { LoginUserSchema } from "@/schemas/user.schema";
import { UserLoginInput } from "../api-client/login/types";
import useLogin from "../api-client/login/useLogin";
import cookieKeys from "@/configs/cookieKeys";

const LoginForm = () => {
  const router = useRouter();
  const { mutateAsync: login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginInput>({
    resolver: zodResolver(LoginUserSchema),
    mode: "onSubmit",
  });

  return (
    <form
      onSubmit={handleSubmit(async (userData) => {
        const result = await login(userData);

        const token = result.data.token;
        Cookie.set(cookieKeys.USER_TOKEN, token);

        router.push("/");
      })}
      className="flex w-full max-w-sm flex-col space-y-5"
    >
      {/* Email Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          placeholder="Enter your email"
          className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 py-2 text-sm text-white transition-all hover:bg-blue-700"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
