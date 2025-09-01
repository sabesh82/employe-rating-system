"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLogOut, IoSettings } from "react-icons/io5";
import { GrOrganization } from "react-icons/gr";
import { FaUserTag } from "react-icons/fa6";
import { DiCssdeck } from "react-icons/di";
import { FiMenu } from "react-icons/fi";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";

const EmployeeSidebar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selected, setSelected] = useState("dashboard");
  const router = useRouter();

  return (
    <div
      className={`relative flex h-screen flex-col border-r border-gray-300/100 bg-gray-200/50 dark:border-gray-700 dark:bg-gray-900 ${
        menuOpen ? "min-w-[240px]" : "min-w-[70px]"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-3.5 px-5">
        <div className="rounded-full border border-blue-400 bg-blue-100 p-0.5 shadow-lg shadow-indigo-600 dark:border-blue-600 dark:bg-blue-900">
          <DiCssdeck
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-7 cursor-pointer text-indigo-600 dark:text-indigo-400"
          />
        </div>
        {menuOpen && (
          <FiMenu
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-5 cursor-pointer text-gray-700 dark:text-gray-300"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col space-y-2 p-4">
        {/* Dashboard */}
        <button
          className={`flex w-full items-center px-2 py-0.5 ${
            selected === "dashboard"
              ? "rounded-md border border-gray-300/100 bg-white dark:border-gray-600 dark:bg-gray-800"
              : "rounded-md hover:bg-white dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            setSelected("dashboard");
            router.push("/dashboard/employee");
          }}
        >
          {menuOpen ? (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <IoIosHome className="size-5" />
              <p>Dashboard</p>
            </div>
          ) : (
            <IoIosHome className="size-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>

        {/* My Organizations */}
        <button
          className={`flex w-full items-center px-2 py-0.5 ${
            selected === "organization"
              ? "rounded-md border border-gray-300/100 bg-white dark:border-gray-600 dark:bg-gray-800"
              : "rounded-md hover:bg-white dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            setSelected("organization");
            router.push("/dashboard/employee/organizations");
          }}
        >
          {menuOpen ? (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <GrOrganization className="size-5" />
              <p>My Organizations</p>
            </div>
          ) : (
            <GrOrganization className="size-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>

        {/* My Supervisor */}
        <button
          className={`flex w-full items-center px-2 py-0.5 ${
            selected === "supervisor"
              ? "rounded-md border border-gray-300/100 bg-white dark:border-gray-600 dark:bg-gray-800"
              : "rounded-md hover:bg-white dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            setSelected("supervisor");
            router.push("/dashboard/employee/supervisors");
          }}
        >
          {menuOpen ? (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <FaUserTag className="size-5" />
              <p>My Supervisor</p>
            </div>
          ) : (
            <FaUserTag className="size-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>

        {/* Calendar */}
        <button
          className={`flex w-full items-center px-2 py-0.5 ${
            selected === "calendar"
              ? "rounded-md border border-gray-300/100 bg-white dark:border-gray-600 dark:bg-gray-800"
              : "rounded-md hover:bg-white dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            setSelected("calendar");
            router.push("/dashboard/employee/calander");
          }}
        >
          {menuOpen ? (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <FaRegCalendarAlt className="size-5" />
              <p>Calendar</p>
            </div>
          ) : (
            <FaRegCalendarAlt className="size-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>

        {/* Settings */}
        <button
          className={`flex w-full items-center px-2 py-0.5 ${
            selected === "settings"
              ? "rounded-md border border-gray-300/100 bg-white dark:border-gray-600 dark:bg-gray-800"
              : "rounded-md hover:bg-white dark:hover:bg-gray-800"
          }`}
          onClick={() => {
            setSelected("settings");
            router.push("/dashboard/employee/settings");
          }}
        >
          {menuOpen ? (
            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <IoSettings className="size-5" />
              <p>Settings</p>
            </div>
          ) : (
            <IoSettings className="size-5 text-gray-800 dark:text-gray-200" />
          )}
        </button>
      </div>

      {/* Logout */}
      <div className="absolute bottom-2 left-3 w-full p-3">
        <button
          onClick={() => {
            Cookie.remove(cookieKeys.USER_TOKEN);
            Cookie.remove(cookieKeys.USER);
            router.push("/login");
          }}
        >
          {menuOpen ? (
            <div className="flex cursor-pointer items-center gap-2 text-red-500 dark:text-red-400">
              <IoLogOut className="size-7" />
              <p>Logout</p>
            </div>
          ) : (
            <IoLogOut className="size-7 text-red-500 dark:text-red-400" />
          )}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
