"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { RegisterInput } from "../api/auth/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserSchema } from "@/schemas/user.schema";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@/stores/authStore";
import { useRegister } from "../api-client/register/useRegister";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";
import Input from "../components/input";

const RegisterForm = () => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    mode: "onSubmit",
    shouldFocusError: true,
    resolver: zodResolver(RegisterUserSchema),
  });

  const router = useRouter();
  const { setUser, setAuthToken } = useAuthActions();

  const { mutateAsync: signup } = useRegister({
    invalidateQueryKey: [],
  });

  return (
    <form
      className="flex w-full flex-col space-y-2"
      onSubmit={handleSubmit(async (values) => {
        const {
          data: { user, token },
        } = await signup({
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
      {/*organizationName*/}
      <label
        htmlFor="organizationName"
        className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
      >
        Organization Name
      </label>
      <Input
        type="text"
        className={
          "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
        }
        placeholder="enter your organization name"
        {...register("organizationName")}
        Icon={() => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19 3v18h-6v-3.5h-2V21H5V3zm-4 4h2V5h-2zm-4 0h2V5h-2zM7 7h2V5H7zm8 4h2V9h-2zm-4 0h2V9h-2zm-4 0h2V9H7zm8 4h2v-2h-2zm-4 0h2v-2h-2zm-4 0h2v-2H7zm8 4h2v-2h-2zm-8 0h2v-2H7zM21 1H3v22h18z"
            />
          </svg>
        )}
      />
      {errors && (
        <p className="mt-1 text-start text-xs text-red-500">
          {errors.organizationName?.message}
        </p>
      )}

      <div className="mb-3 flex w-full items-center justify-around space-x-3">
        <div>
          {/*firstName*/}
          <label
            htmlFor="firstName"
            className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
          >
            First Name
          </label>
          <Input
            type="text"
            className={
              "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
            }
            placeholder="enter your first name"
            {...register("firstName")}
            Icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 dark:text-gray-200"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 20H4v-3c0-2.7 5.3-4 8-4 1.5 0 3.9.4 5.7 1.3-.8.3-1.4.7-2 1.2-1.1-.4-2.4-.6-3.7-.6-3 0-6.1 1.5-6.1 2.1v1.1h8.3c-.1.4-.2.9-.2 1.4zm9-.5c0 1.9-1.6 3.5-3.5 3.5S16 21.4 16 19.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-2C9.8 4 8 5.8 8 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4"
                />
              </svg>
            )}
          />
          {errors && (
            <p className="mt-1 text-start text-xs text-red-500">
              {errors.firstName?.message}
            </p>
          )}
        </div>
        <div>
          {/*lastName*/}
          <label
            htmlFor="lastName"
            className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
          >
            Last Name
          </label>
          <Input
            type="text"
            className={
              "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
            }
            placeholder="enter your last name"
            {...register("lastName")}
            Icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 dark:text-gray-200"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14 20H4v-3c0-2.7 5.3-4 8-4 1.5 0 3.9.4 5.7 1.3-.8.3-1.4.7-2 1.2-1.1-.4-2.4-.6-3.7-.6-3 0-6.1 1.5-6.1 2.1v1.1h8.3c-.1.4-.2.9-.2 1.4zm9-.5c0 1.9-1.6 3.5-3.5 3.5S16 21.4 16 19.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0-2C9.8 4 8 5.8 8 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4"
                />
              </svg>
            )}
          />
          {errors && (
            <p className="mt-1 text-start text-xs text-red-500">
              {errors.lastName?.message}
            </p>
          )}
        </div>
      </div>

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
        placeholder="enter your email"
        {...register("email")}
        Icon={() => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5 8-5z"
            />
          </svg>
        )}
      />
      {errors && (
        <p className="mt-1 text-start text-xs text-red-500">
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
        className={
          "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
        }
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
              d="M12 17a2 2 0 01-2-2c0-1.11.89-2 2-2a2 2 0 012 2 2 2 0 01-2 2m6 3V10H6v10zm0-12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V10c0-1.11.89-2 2-2h1V6a5 5 0 015-5 5 5 0 015 5v2zm-6-5a3 3 0 00-3 3v2h6V6a3 3 0 00-3-3"
            />
          </svg>
        )}
      />
      {errors && (
        <p className="mt-1 text-start text-xs text-red-500">
          {errors.password?.message}
        </p>
      )}
      {/*confirm password*/}
      <label
        htmlFor="password"
        className="text-md mb-1 flex justify-start text-gray-900 dark:text-white/80"
      >
        Confirm Password
      </label>
      <Input
        type="password"
        className={
          "w-full bg-gray-100/50 dark:border-gray-300/20 dark:bg-white/10 dark:text-gray-200"
        }
        placeholder="enter the password again"
        {...register("confirmPassword")}
        Icon={() => (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-5 dark:text-gray-200"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M9 8h6V6q0-1.25-.875-2.125T12 3t-2.125.875T9 6zM6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1t3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10q0 .5-.312.75T19 11t-.687-.25T18 10H6v10h5q.425 0 .713.288T12 21t-.288.713T11 22zm0-12v10zm12 8q.625 0 1.063-.437T19.5 16.5t-.437-1.062T18 15t-1.062.438T16.5 16.5t.438 1.063T18 18m0 3q.75 0 1.4-.35t1.075-.975q-.575-.35-1.2-.513T18 19t-1.275.162-1.2.513q.425.625 1.075.975T18 21m0 2q-2.075 0-3.537-1.463T13 18t1.463-3.537T18 13t3.538 1.463T23 18t-1.463 3.538T18 23"
            />
          </svg>
        )}
      />
      {errors && (
        <p className="mt-1 text-start text-xs text-red-500">
          {errors.password?.message}
        </p>
      )}

      {/*register button*/}
      <button
        type="submit"
        className="mt-3.5 w-full cursor-pointer rounded-lg bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 px-3 py-[0.45rem] text-lg font-normal text-white hover:-translate-y-0.5 dark:bg-yellow-600/100 dark:bg-none dark:text-white"
      >
        {isSubmitting ? "registering..." : "register"}
      </button>
    </form>
  );
};

export default RegisterForm;
