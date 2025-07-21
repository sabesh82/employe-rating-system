"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { DiCssdeck } from "react-icons/di";
import RegisterForm from "./RegisterForm";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  return (
    <section className="flex h-dvh w-full items-center justify-center bg-gray-200">
      <div className="relative grid h-dvh w-full grid-cols-1 bg-white p-1 md:grid-cols-[60%_40%] md:p-1 dark:bg-black">
        {/*left side*/}
        <div className="overflow-hidden">
          <img
            src="https://res.cloudinary.com/dlseuftkj/image/upload/v1753040697/pexels-lucaspezeta-2034892_p9traz.jpg"
            alt="Workspace"
            className="hidden h-full w-full rounded-2xl object-cover object-left md:flex"
          />
        </div>

        {/*right side*/}
        <div className="hide-scrollbar flex h-full min-h-0 flex-col overflow-y-auto px-4">
          {/*logo section*/}
          <div className="mt-2 flex justify-start">
            <div className="flex items-center space-x-1 dark:text-white">
              <DiCssdeck className="size-8" />
              <p className="font-mono text-xl font-semibold">EMRate</p>
            </div>
          </div>

          {/*form section*/}
          <div className="mt-12 flex flex-1 items-center justify-center md:mt-5">
            <div className="flex w-full max-w-[27rem] flex-col">
              <header className="mb-6">
                <h1 className="bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-center text-3xl leading-[1.2] font-bold text-transparent md:text-[37px] md:leading-[1.1] dark:text-white">
                  Create an account
                </h1>
                <p className="md-mt-0 mt-1 text-center text-xs text-gray-400 dark:text-white/50">
                  Create your account to get started
                </p>
              </header>

              <RegisterForm />

              <div className="mt-4 flex items-center text-xs">
                <hr className="flex-grow border-t border-gray-400" />
                <span className="px-2 text-gray-400">Or Register With</span>
                <hr className="flex-grow border-t border-gray-400" />
              </div>

              <div className="mt-4 flex w-full items-center justify-evenly gap-2">
                <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/100 bg-white/10 px-3 py-2 hover:bg-gray-100/50 dark:border-gray-300/20 dark:hover:bg-gray-100/20">
                  <FcGoogle />
                  <p className="text-sm dark:text-white">Google</p>
                </button>
                <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/100 bg-white/10 px-3 py-2 hover:bg-gray-100/50 dark:border-gray-300/20 dark:hover:bg-gray-100/20">
                  <FaApple className="dark:text-gray-500" />
                  <p className="text-sm dark:text-white">Apple</p>
                </button>
              </div>
              <div className="text-center">
                <p className="mt-3.5 text-xs text-gray-400">
                  Already have an account?
                  <span
                    className="ml-1 cursor-pointer text-xs text-gray-900 underline dark:text-white"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/*footer section*/}
          <div className="mt-15 mb-1.5 flex justify-center px-4 text-center md:mt-8">
            <p className="text-xs text-gray-400 dark:text-white/50">
              By clicking Continue you confirm that you agree to{" "}
              <span className="cursor-pointer text-gray-700 underline underline-offset-2 dark:text-white">
                EMRate's privacy policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
