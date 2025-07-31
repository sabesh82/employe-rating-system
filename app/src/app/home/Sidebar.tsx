"use client";
import React, { useState } from "react";
import { IoIosHome } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { IoMdHelpCircle } from "react-icons/io";
import { FaHistory } from "react-icons/fa";
import { GrScorecard } from "react-icons/gr";
import { GrCatalogOption } from "react-icons/gr";
import { FaUserGroup } from "react-icons/fa6";
import { FaUserTag } from "react-icons/fa6";
import { DiCssdeck } from "react-icons/di";
import { FiMenu } from "react-icons/fi";
import { GrOrganization } from "react-icons/gr";
import { IoLogOut } from "react-icons/io5";
import { FaBuildingUser } from "react-icons/fa6";
import Cookie from "js-cookie";
import cookieKeys from "@/configs/cookieKeys";

const SideBar = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const [selected, setSelected] = useState("dashboard");
  const router = useRouter();

  return (
    <div
      className={`relative flex h-screen flex-col border-r border-gray-300/100 bg-gray-200/50 ${
        menuOpen ? "min-w-[240px]" : "min-w-[70px]"
      }`}
    >
      {/*sidebar top section*/}
      <div className="flex items-center justify-between p-3.5 px-5">
        <div className="rounded-full border border-blue-400 bg-blue-100 p-0.5 shadow-lg shadow-indigo-600">
          <DiCssdeck
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-7 cursor-pointer text-indigo-600"
          />
        </div>
        {menuOpen ? (
          <FiMenu
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-5 cursor-pointer"
          />
        ) : (
          ""
        )}
      </div>

      {/*side bar nav links*/}
      <div className="p-4">
        <div className="flex flex-col space-y-2">
          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "dashboard" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => {
              (setSelected("dashboard"), router.push("/home/dashboard"));
            }}
          >
            {menuOpen ? (
              <div className="flex items-center gap-2">
                <IoIosHome className="size-5" />
                {menuOpen ? <p>Dashboard</p> : null}
              </div>
            ) : (
              <IoIosHome className="size-5" />
            )}
          </button>

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "organization" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("organization")}
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

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "membership" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("membership")}
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

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "settings" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("settings")}
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

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "help" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("help")}
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

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "calendar" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => {
              (setSelected("calendar"), router.push("/home/calander"));
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

      {/*sidebar rating section*/}
      <div className="mt-2 p-3.5">
        {menuOpen ? (
          <h2 className="mb-3 text-gray-500">Team Rating management</h2>
        ) : (
          <p className="mb-2 text-gray-500"></p>
        )}

        <div className="flex flex-col space-y-2">
          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "rating" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("rating")}
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
          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "criteria" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("criteria")}
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
          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "employee" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("employee")}
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

          <button
            className={`flex w-full cursor-pointer items-center px-2 py-0.5 ${selected === "supervisor" ? "rounded-md border border-gray-300/100 bg-white" : "rounded-md hover:bg-white"}`}
            onClick={() => setSelected("supervisor")}
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

          <div className="absolute bottom-2 left-3 w-full p-3">
            <button
              onClick={() => {
                (Cookie.remove(cookieKeys.USER_TOKEN),
                  Cookie.remove(cookieKeys.USER),
                  router.push("/login"));
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
      </div>
    </div>
  );
};

export default SideBar;
