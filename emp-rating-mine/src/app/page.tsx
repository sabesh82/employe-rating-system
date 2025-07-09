"use client";

import cookieKeys from "@/configs/cookieKeys";
import { useThemeActions } from "@/stores/themeStore";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

const Home = () => {
  const { setMode } = useThemeActions();
  const router = useRouter();

  const token = useMemo(() => Cookie.get(cookieKeys.USER_TOKEN), []);
  return (
    <section className="flex h-dvh w-full flex-col items-center justify-center dark:bg-gray-950">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Employee Rating
      </h1>
      <p className="text-xs text-gray-600 dark:text-white/60">
        An Application to rate employees
      </p>

      {token && <p className="text-blue-500">user available</p>}

      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          onClick={() => setMode("system")}
          className="text-xs text-gray-800 hover:underline focus:outline-0 dark:text-white"
        >
          system
        </button>
        <button
          onClick={() => setMode("light")}
          className="text-xs text-gray-800 hover:underline focus:outline-0 dark:text-white"
        >
          light
        </button>
        <button
          onClick={() => setMode("dark")}
          className="text-xs text-gray-800 hover:underline focus:outline-0 dark:text-white"
        >
          dark
        </button>
      </div>
      <button
        onClick={() => {
          Cookie.remove(cookieKeys.USER_TOKEN), router.push("/login");
        }}
        className="mt-25 rounded-3xl bg-red-500 p-1 text-white"
      >
        Logout
      </button>
    </section>
  );
};

export default Home;
