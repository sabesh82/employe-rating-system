"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "../api/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginUserSchema } from "@/schemas/user.schema";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";
import { useRouter } from "next/navigation";
import { useLogin } from "../api-client/login/useLogin";
import { useAuthActions } from "@/stores/authStore";
import Input from "../components/input";

const LoginForm = () => {
  const router = useRouter();
  const { setUser, setAuthToken } = useAuthActions();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    mode: "onSubmit",
    resolver: zodResolver(LoginUserSchema),
  });

  const { mutateAsync: login } = useLogin({
    invalidateQueryKey: [],
  });

  return (
    <form
      className="flex w-full flex-col space-y-1"
      onSubmit={handleSubmit(async (values) => {
        const {
          data: { user, token },
        } = await login({
          body: values,
        });

        setUser(user);
        setAuthToken(token);

        Cookie.set(cookieKeys.USER_TOKEN, token);
        Cookie.set(cookieKeys.USER, JSON.stringify(user));
        reset();
        router.push("/");
      })}
    >
      {/*email*/}
      <label
        htmlFor="email"
        className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
      >
        Email
      </label>
      <Input
        type="email"
        className={
          "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
        }
        placeholder="enter your username"
        {...register("email")}
        Icon={() => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <circle cx={12} cy={6} r={4} fill="currentColor" />
            <path
              fill="currentColor"
              d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
              opacity={0.5}
            />
          </svg>
        )}
      />
      {errors && (
        <p className="mt-1 text-start text-sm text-red-500">
          {errors.email?.message}
        </p>
      )}

      {/*password*/}
      <label
        htmlFor="password"
        className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
      >
        Password
      </label>
      <Input
        type="password"
        className="w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
        placeholder="enter your password"
        {...register("password")}
        Icon={() => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm0-2h12V10H6zm6-3q.825 0 1.413-.587T14 15t-.587-1.412T12 13t-1.412.588T10 15t.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6zM6 20V10z"
            />
          </svg>
        )}
      />

      {errors && (
        <p className="mt-1 text-start text-sm text-red-500">
          {errors.password?.message}
        </p>
      )}

      {/*button*/}
      <button
        type="submit"
        className="mt-3 w-full cursor-pointer rounded-lg bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 px-3 py-[0.45rem] text-lg font-normal text-white hover:-translate-y-0.5 dark:bg-yellow-600/100 dark:bg-none dark:text-white"
      >
        {isSubmitting ? "loggin in..." : "login"}
      </button>
    </form>
  );
};

export default LoginForm;
