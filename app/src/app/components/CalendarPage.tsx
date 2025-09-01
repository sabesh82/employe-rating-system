"use client";

import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type Value = Date | [Date | null, Date | null] | null;

export default function CalendarPage() {
  const [value, setValue] = useState<Value>(new Date());

  const renderSelectedDate = () => {
    if (value === null) return "No date selected";
    if (Array.isArray(value)) {
      const start = value[0]?.toDateString() ?? "–";
      const end = value[1]?.toDateString() ?? "–";
      return `${start} → ${end}`;
    }
    return value.toDateString();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-900">
      <div className="flex flex-col">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 dark:text-gray-200">
          Calendar
        </h1>
        <div className="inline-block rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
          <Calendar
            onChange={(val) => setValue(val)}
            value={value}
            selectRange
          />
          <p className="mt-4 text-gray-900 dark:text-gray-200">
            You selected: {renderSelectedDate()}
          </p>
        </div>
      </div>

      {/* Dark/light mode calendar CSS overrides */}
      <style jsx global>{`
        .react-calendar {
          background-color: white; /* Light mode background */
          color: #111827; /* gray-900 */
          border: none !important;
          font-family: inherit;
        }
        .dark .react-calendar {
          background-color: #1f2937; /* gray-800 */
          color: #e5e7eb; /* gray-200 */
        }

        .react-calendar__navigation button {
          color: #111827; /* gray-900 */
          background: #f3f4f6; /* gray-100 */
        }
        .dark .react-calendar__navigation button {
          color: #e5e7eb; /* gray-200 */
          background: #374151; /* gray-700 */
        }

        .react-calendar__month-view__weekdays {
          color: #6b7280; /* gray-500 */
        }
        .dark .react-calendar__month-view__weekdays {
          color: #9ca3af; /* gray-400 */
        }

        .react-calendar__tile {
          background: #f3f4f6; /* gray-100 */
          color: #111827; /* gray-900 */
          border-radius: 0.25rem;
        }
        .dark .react-calendar__tile {
          background: #374151; /* gray-700 */
          color: #e5e7eb; /* gray-200 */
        }

        .react-calendar__tile:hover {
          background: #e5e7eb; /* gray-200 */
          color: #111827; /* gray-900 */
        }
        .dark .react-calendar__tile:hover {
          background: #4b5563; /* gray-600 */
          color: #e5e7eb; /* gray-200 */
        }

        .react-calendar__tile--now {
          background: #d1fae5; /* green-100 */
          color: #065f46; /* green-800 */
        }
        .dark .react-calendar__tile--now {
          background: #4b5563; /* gray-600 */
          color: #fbbf24; /* yellow-400 */
        }

        .react-calendar__tile--active {
          background: #2563eb; /* blue-600 */
          color: white;
        }
        .react-calendar__tile--range {
          background: #1d4ed8; /* blue-700 */
          color: white;
        }
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background: #1e40af; /* blue-800 */
          color: white;
        }

        .react-calendar__month-view__days__day--weekend {
          color: #b45309; /* amber-700 */
        }
        .dark .react-calendar__month-view__days__day--weekend {
          color: #fbbf24; /* yellow-400 */
        }
      `}</style>
    </div>
  );
}
