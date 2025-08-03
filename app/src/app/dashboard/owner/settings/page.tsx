"use client";

import cookieKeys from "@/configs/cookieKeys";
import { useThemeActions, useTheme } from "@/stores/themeStore";
import Cookie from "js-cookie";

export default function SettingsPage() {
  const { mode } = useTheme();
  const { setMode } = useThemeActions();

  const token = Cookie.get(cookieKeys.USER_TOKEN);

  const themeOptions = [
    {
      label: "System",
      value: "system",
      description: "Use your device’s default theme",
    },
    { label: "Light", value: "light", description: "Always use light mode" },
    { label: "Dark", value: "dark", description: "Always use dark mode" },
  ] as const;

  return (
    <section className="min-h-screen bg-gray-50 p-8 transition-colors duration-300 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Settings
        </h1>

        <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-shadow duration-300 dark:bg-gray-800 dark:shadow-gray-700 dark:ring-gray-700">
          <h2 className="mb-3 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Theme:
          </h2>

          <div className="flex gap-8">
            {themeOptions.map(({ label, value, description }) => (
              <label
                key={value}
                className={`flex cursor-pointer flex-col rounded-lg border px-6 py-2 shadow-sm transition ${
                  mode === value
                    ? "border-indigo-600 bg-indigo-50 shadow-indigo-300 dark:bg-indigo-700 dark:shadow-indigo-800"
                    : "border-gray-300 hover:border-indigo-500 hover:shadow-md dark:border-gray-700"
                } focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1`}
              >
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                    className="h-6 w-6 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-lg font-medium text-gray-900 select-none dark:text-gray-100">
                    {label}
                  </span>
                </div>
                <p className="mt-1 max-w-xs text-sm text-gray-600 select-none dark:text-gray-300">
                  {description}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Future settings*/}

        {/* Future settings*/}
      </div>
    </section>
  );
}
