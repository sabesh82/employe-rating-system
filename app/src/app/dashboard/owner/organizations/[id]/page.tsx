"use client";
import React from "react";

import { FaUserPlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/stores/authStore";

import { SlOptionsVertical } from "react-icons/sl";
import { TbSpeakerphone } from "react-icons/tb";
import Input from "@/app/components/input";
import DateTime from "@/app/components/DateTime";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgName = searchParams.get("orgName");
  const params = useParams();
  const orgId = params?.id as string | undefined;

  return (
    <section className="h-screen w-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col">
        {/* Nav Section */}
        <div className="mb-4 flex w-full items-center justify-between border-b border-gray-300 px-4 py-4 dark:border-gray-600">
          <div className="text-xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </div>
          <div className="flex items-center gap-3">
            <div className="glowing-border">
              <Input
                type="text"
                className="w-full bg-gray-100 py-1.5 text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                placeholder="Quick Search.."
                Icon={() => (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503 5.47 5.436t4.064-1.667 4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361-1.37-3.36-3.36-1.37-3.361 1.37-1.37 3.36 1.37 3.36 3.36 1.37"
                    />
                  </svg>
                )}
              />
            </div>
            <button
              className="flex transform cursor-pointer items-center gap-1 rounded-md border border-gray-400 px-2 py-1 duration-100 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
              onClick={() =>
                router.push(`/dashboard/owner/organizations/${orgId}/invite`)
              }
            >
              <FaUserPlus />
              Invite
            </button>

            <button className="cursor-pointer">
              <FaUserCircle className="ml-3 size-7 text-gray-900 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Hero section */}
        <div className="mb-3.5 flex items-center justify-between px-10.5">
          <p className="text-2xl text-gray-800 dark:text-gray-200">
            Welcome, {user?.firstName}👋 {orgName && <>to {orgName}</>}
          </p>
          <div className="rounded-lg border border-gray-300 bg-gray-200 px-2 py-1 text-sm text-black shadow-lg dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
            <DateTime />
          </div>
        </div>

        <div className="flex justify-between px-3">
          {/* Left side */}
          <div className="flex flex-col px-8">
            {/* Create organization card */}
            <div
              className="w-160 rounded-xl border-1 border-white px-3 py-4"
              style={{
                backgroundColor: "#0f052b",
                backgroundImage:
                  "url('https://www.transparenttextures.com/patterns/gplay.png')",
              }}
            >
              <p className="text-xl text-white/60">Team Excellence</p>
              <p className="text-4xl leading-none font-medium text-white">
                Fuel success through clear, constructive feedback.
              </p>
              <button
                className="mt-4 flex cursor-pointer items-center gap-1 rounded-2xl bg-gray-300 px-1 py-0.5 text-white transition duration-200 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600/100"
                onClick={() => router.push("/dashboard/organizations/neworg")}
              >
                <p className="text-md text-black dark:text-white">
                  Create New Organization
                </p>
                <div className="rounded-full bg-black p-1 dark:bg-gray-200">
                  <MdKeyboardArrowRight className="text-white dark:text-black" />
                </div>
              </button>
            </div>

            {/* Employee and supervisor cards */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 bg-gray-50 p-1.5 dark:border-gray-600 dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Total Employees
                </p>
                <div className="mt-1.5 w-full rounded-sm border border-green-400/30 bg-green-100 px-2 py-1 pl-2 text-gray-900 dark:bg-green-900/40 dark:text-white">
                  25
                </div>
              </div>

              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 bg-gray-50 p-1.5 dark:border-gray-600 dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Total Supervisors
                </p>
                <div className="mt-1.5 w-full rounded-sm border border-purple-400/30 bg-purple-100 px-2 py-1 pl-2 text-gray-900 dark:bg-purple-900/40 dark:text-white">
                  3
                </div>
              </div>

              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 bg-gray-50 p-1.5 dark:border-gray-600 dark:bg-gray-800">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Total Ratings
                </p>
                <div className="mt-1.5 w-full rounded-sm border border-blue-400/30 bg-blue-100 px-2 py-1 pl-2 text-gray-900 dark:bg-blue-900/40 dark:text-white">
                  45
                </div>
              </div>
            </div>
          </div>

          {/* Right side / Announcement */}
          <div className="flex h-140 w-90 flex-col overflow-y-auto rounded-md border border-gray-400/50 bg-gray-100/10 shadow-xl dark:border-gray-600 dark:bg-gray-800/20">
            <div className="flex items-center justify-between p-3">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                Announcement
              </p>
              <SlOptionsVertical className="cursor-pointer font-semibold text-gray-900 dark:text-gray-200" />
            </div>

            <div className="mt-3 flex justify-center">
              <div className="rounded-2xl bg-indigo-400 p-1 shadow-lg shadow-indigo-700/50 dark:bg-indigo-600">
                <div className="rounded-xl bg-indigo-700 p-1.5 text-white dark:bg-indigo-900">
                  <TbSpeakerphone className="text-7xl" />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col justify-center">
              <p className="text-center text-gray-500 dark:text-gray-300">
                Stay updated with the team
              </p>
              <button
                className="cursor-pointer text-blue-600 underline dark:text-blue-400"
                onClick={() =>
                  router.push(`/dashboard/owner/organizations/${orgId}/assign`)
                }
              >
                assign
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
