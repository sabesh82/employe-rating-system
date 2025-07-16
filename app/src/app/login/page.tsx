import React from "react";
import LoginForm from "./LoginForm";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { DiCssdeck } from "react-icons/di";
import { IoFingerPrint } from "react-icons/io5";

const page = () => {
  return (
    <section className="flex h-dvh w-full items-center justify-center bg-gray-200">
      <div className="relative grid h-dvh w-full grid-cols-1 bg-white p-3.5 md:grid-cols-[40%_60%] md:p-1.5">
        {/*left side*/}
        <div className="hide-scrollbar flex h-full flex-col overflow-y-auto px-4">
          {/*logo section*/}
          <div className="mt-2 flex justify-start">
            <div className="flex items-center space-x-1">
              <DiCssdeck className="size-8" />
              <p className="font-mono text-xl font-semibold">EMRate</p>
            </div>
          </div>

          {/*form section*/}
          <div className="mt-10 flex flex-1 items-center justify-center md:mt-3">
            <div className="flex w-full max-w-[22rem] flex-col">
              <header className="mb-6">
                {/*rotated logo*/}
                <div className="flex justify-center">
                  <div className="relative z-20 mb-10">
                    <div className="rounded-2xl bg-white/20 p-3 shadow-xl ring shadow-gray-700/50 ring-white backdrop-blur-sm">
                      <IoFingerPrint className="size-7 text-white" />
                    </div>

                    <div className="absolute inset-0 -z-10">
                      <div className="-mt-2.5 ml-2.5 size-full rotate-12 rounded-2xl bg-gray-500"></div>
                    </div>
                  </div>
                </div>
                <h1 className="bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-center text-3xl leading-[1.2] font-bold text-transparent md:text-[37px] md:leading-[1.1]">
                  Welcome Back
                </h1>
                <p className="md-mt-0 mt-1 text-center text-xs text-gray-400">
                  Enter your Email and Password to access your account
                </p>
              </header>

              <LoginForm />

              <div className="mt-4 flex items-center text-xs">
                <hr className="flex-grow border-t border-gray-400" />
                <span className="px-2 text-gray-400">Or Login With</span>
                <hr className="flex-grow border-t border-gray-400" />
              </div>

              <div className="mt-4 flex w-full items-center justify-evenly gap-2">
                <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/100 bg-white/10 px-3 py-2 hover:bg-gray-100/50">
                  <FcGoogle />
                  <p className="text-sm">Google</p>
                </button>
                <button className="flex w-1/2 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300/100 bg-white/10 px-3 py-2 hover:bg-gray-100/50">
                  <FaApple />
                  <p className="text-sm">Apple</p>
                </button>
              </div>
              <div className="text-center">
                <p className="mt-3.5 text-xs text-gray-400">
                  Don't Have An Account?
                  <span className="ml-1 cursor-pointer text-xs text-gray-900">
                    Register Now.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/*footer section*/}
          <div className="mt-15 mb-1.5 flex justify-center px-4 text-center md:mt-8">
            <p className="text-xs text-gray-400">
              By clicking Continue you confirm that you agree to{" "}
              <span className="cursor-pointer text-gray-700 underline underline-offset-2">
                EMRate's privacy policy
              </span>
            </p>
          </div>
        </div>

        {/*right side*/}
        <div className="">
          <img
            src="https://res.cloudinary.com/dlseuftkj/image/upload/v1752494452/pexels-fauxels-3184357_xsofwx.jpg"
            alt="Workspace"
            className="hidden h-full w-full rounded-2xl object-cover object-left md:flex"
          />
        </div>
      </div>
    </section>
  );
};

export default page;
