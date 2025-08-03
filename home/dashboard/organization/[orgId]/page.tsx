"use client";
import React from "react";
import Input from "../../../../components/input";
import { FaUserPlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/stores/authStore";
import DateTime from "../../../../components/DateTime";
import { SlOptionsVertical } from "react-icons/sl";
import { TbSpeakerphone } from "react-icons/tb";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orgName = searchParams.get("orgName");

  return (
    <section className="h-screen w-full">
      <div className="flex flex-col">
        {/* Nav Section */}
        <div className="mb-4 flex w-full items-center justify-between border-b border-gray-300 px-4 py-4">
          <div className="text-xl font-semibold">Dashboard</div>
          <div className="flex items-center gap-3">
            <div className="glowing-border">
              <Input
                type="text"
                className={"w-full bg-gray-100 py-1.5"}
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
            <button className="flex transform cursor-pointer items-center gap-1 rounded-md border border-gray-400 px-2 py-1 duration-100 hover:bg-gray-100">
              <FaUserPlus />
              Invite
            </button>

            <button className="cursor-pointer">
              <FaUserCircle className="ml-3 size-7" />
            </button>
          </div>
        </div>

        {/*hero section*/}
        <div className="mb-3.5 flex items-center justify-between px-10.5">
          <p className="text-2xl text-gray-800">
            Welcome, {user?.firstName}👋 {orgName && <>to {orgName}</>}
          </p>
          <div className="rounded-lg border border-gray-300 bg-gray-200 px-2 py-1 text-sm text-black shadow-lg">
            <DateTime />
          </div>
        </div>

        <div className="flex justify-between px-3">
          {/*left side*/}
          <div className="flex flex-col px-8">
            {/*create organization card*/}
            <div
              className="w-160 rounded-xl px-3 py-4"
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
                className="mt-4 flex cursor-pointer items-center gap-1 rounded-2xl bg-gray-300 px-1 py-0.5 text-white transition duration-200 hover:bg-gray-400/100"
                onClick={() => router.push("/home/organization")}
              >
                <p className="text-md text-black">Create New Organization</p>
                <div className="rounded-full bg-black p-1">
                  <MdKeyboardArrowRight className="text-white" />
                </div>
              </button>
            </div>

            {/*employee and supervior cards*/}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 p-1.5">
                <p className="font-semibold">Total Employees</p>
                <div className="mt-1.5 w-full rounded-sm border border-green-400/30 bg-green-100 px-2 py-1 pl-2">
                  25
                </div>
              </div>

              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 p-1.5">
                <p className="font-semibold">Total Supervisors</p>
                <div className="mt-1.5 w-full rounded-sm border border-purple-400/30 bg-purple-100 px-2 py-1 pl-2">
                  3
                </div>
              </div>

              <div className="flex h-20 w-65 flex-col rounded-md border border-gray-400/50 p-1.5">
                <p className="font-semibold">Total Ratings</p>
                <div className="mt-1.5 w-full rounded-sm border border-blue-400/30 bg-blue-100 px-2 py-1 pl-2">
                  45
                </div>
              </div>
            </div>
          </div>

          {/*right side*/}
          {/*anouncenebt section*/}
          <div className="flex h-140 w-90 flex-col overflow-y-auto rounded-md border border-gray-400/50 bg-gray-100/10 shadow-xl">
            <div className="flex items-center justify-between p-3">
              <p className="text-xl font-semibold">Anouncement</p>
              <SlOptionsVertical className="cursor-pointer font-semibold" />
            </div>

            <div className="mt-3 flex justify-center">
              <div className="rounded-2xl bg-indigo-400 p-1 shadow-lg shadow-indigo-700">
                <div className="rounded-xl bg-indigo-700 p-1.5 text-white">
                  <TbSpeakerphone className="text-7xl" />
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-col justify-center">
              <p className="text-center text-gray-500">
                Stay updated with the team
              </p>
              <button className="cursor-pointer text-blue-600 underline">
                Create Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
