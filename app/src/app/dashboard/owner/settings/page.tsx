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
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6 transition-colors duration-300 sm:p-10 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-12 text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Settings
        </h1>

        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-800/50 dark:ring-gray-700/50">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Theme Preference
          </h2>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Choose how you want the application to look.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {themeOptions.map(({ label, value, description }) => (
              <label
                key={value}
                className={`flex cursor-pointer flex-col rounded-lg border p-4 transition-all duration-200 ${
                  mode === value
                    ? "border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-200 dark:bg-indigo-900/50 dark:shadow-indigo-900/50"
                    : "border-gray-200 hover:border-indigo-400 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-indigo-600 dark:hover:bg-gray-700/50"
                } focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-800`}
                role="radio"
                aria-checked={mode === value}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={mode === value}
                    onChange={() => setMode(value)}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    aria-label={`Select ${label} theme`}
                  />
                  <span className="text-base font-medium text-gray-900 select-none dark:text-gray-100">
                    {label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 select-none dark:text-gray-400">
                  {description}
                </p>
              </label>
            ))}
          </div>
        </div>

        {/* Future Settings Placeholder */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200/50 transition-all duration-300 dark:bg-gray-800 dark:shadow-gray-800/50 dark:ring-gray-700/50">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            More Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Additional settings coming soon...
          </p>
        </div>
      </div>
    </section>
  );
}
