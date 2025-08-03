"use client";
import React, { useState } from "react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { IoIosHome } from "react-icons/io";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { GrScorecard, GrCatalogOption, GrOrganization } from "react-icons/gr";
import { FaUserGroup, FaUserTag, FaBuildingUser } from "react-icons/fa6";
import { DiCssdeck } from "react-icons/di";
import { FiMenu } from "react-icons/fi";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";

const SideBar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selected, setSelected] = useState("dashboard");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const orgId = params?.id as string | undefined;

  const goToOrgPage = (path: string, menu: string) => {
    if (orgId) {
      setSelected(menu);
      router.push(`/dashboard/owner/organizations/${orgId}/${path}`);
    } else {
      alert("Please select an organization first.");
    }
  };

  return (
    <div
      className={`relative flex h-screen flex-col border-r border-gray-300/100 bg-gray-200/50 ${
        menuOpen ? "min-w-[240px]" : "min-w-[70px]"
      }`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-3.5 px-5">
        <div className="rounded-full border border-blue-400 bg-blue-100 p-0.5 shadow-lg shadow-indigo-600">
          <DiCssdeck
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-7 cursor-pointer text-indigo-600"
          />
        </div>
        {menuOpen && (
          <FiMenu
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-5 cursor-pointer"
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          {/* Dashboard */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "dashboard"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("dashboard");
              if (
                pathname.includes("/dashboard/owner/organizations") &&
                orgId
              ) {
                router.push(`/dashboard/owner/organizations/${orgId}`);
              } else {
                router.push("/dashboard/owner");
              }
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <IoIosHome className="size-5" />
                <p>Dashboard</p>
              </div>
            ) : (
              <IoIosHome className="size-5" />
            )}
          </button>

          {/* My Organizations */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "organization"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("organization");
              router.push("/dashboard/owner/organizations");
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <GrOrganization className="size-5" />
                <p>My Organizations</p>
              </div>
            ) : (
              <FaHistory className="size-5" />
            )}
          </button>

          {/* Membership */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "membership"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("membership");
              router.push("/dashboard/owner/membership");
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <FaBuildingUser className="size-5" />
                <p>Membership</p>
              </div>
            ) : (
              <FaBuildingUser className="size-5" />
            )}
          </button>

          {/* Settings */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "settings"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("settings");
              router.push("/dashboard/owner/settings");
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <IoSettings className="size-5" />
                <p>Settings</p>
              </div>
            ) : (
              <IoSettings className="size-5" />
            )}
          </button>

          {/* Help */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "help"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("help");
              router.push("/dashboard/owner/help");
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <IoMdHelpCircle className="size-5" />
                <p>Help</p>
              </div>
            ) : (
              <IoMdHelpCircle className="size-5" />
            )}
          </button>

          {/* Calendar */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "calendar"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => {
              setSelected("calendar");
              router.push("/dashboard/owner/calander");
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <FaRegCalendarAlt className="size-5" />
                <p>Calendar</p>
              </div>
            ) : (
              <FaRegCalendarAlt className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mt-2 p-3.5">
        {menuOpen && (
          <h2 className="mb-3 text-gray-500">Team Rating Management</h2>
        )}

        <div className="flex flex-col space-y-2">
          {/* Ratings */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "rating"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => goToOrgPage("ratings", "rating")}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <GrScorecard className="size-5" />
                <p>Ratings</p>
              </div>
            ) : (
              <GrScorecard className="size-5" />
            )}
          </button>

          {/* Criterias */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "criteria"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => goToOrgPage("criteria", "criteria")}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <GrCatalogOption className="size-5" />
                <p>Criterias</p>
              </div>
            ) : (
              <GrCatalogOption className="size-5" />
            )}
          </button>

          {/* Employees */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "employee"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => goToOrgPage("employees", "employee")}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <FaUserGroup className="size-5" />
                <p>Employees</p>
              </div>
            ) : (
              <FaUserGroup className="size-5" />
            )}
          </button>

          {/* Supervisors */}
          <button
            className={`flex w-full items-center px-2 py-0.5 ${
              selected === "supervisor"
                ? "rounded-md border border-gray-300/100 bg-white"
                : "rounded-md hover:bg-white"
            }`}
            onClick={() => goToOrgPage("supervisors", "supervisor")}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <FaUserTag className="size-5" />
                <p>Supervisors</p>
              </div>
            ) : (
              <FaUserTag className="size-5" />
            )}
          </button>
        </div>
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
            <div className="flex cursor-pointer items-center gap-2 text-red-500">
              <IoLogOut className="size-7" />
              <p>Logout</p>
            </div>
          ) : (
            <IoLogOut className="size-7 text-red-500" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SideBar;
