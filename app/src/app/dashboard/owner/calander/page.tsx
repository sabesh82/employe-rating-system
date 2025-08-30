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
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8">
      <div className="flex flex-col">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-200">
          Calendar
        </h1>
        <div className="inline-block rounded-md bg-gray-800 p-4 shadow-md">
          <Calendar
            onChange={(val) => setValue(val)}
            value={value}
            selectRange
          />
          <p className="mt-4 text-gray-200">
            You selected: {renderSelectedDate()}
          </p>
        </div>
      </div>

      {/* Dark mode calendar CSS overrides */}
      <style jsx global>{`
        /* Main calendar container */
        .react-calendar {
          background-color: #1f2937 !important; /* gray-800 */
          color: #e5e7eb !important; /* gray-200 */
          border: none !important;
          font-family: inherit;
        }

        /* Navigation buttons */
        .react-calendar__navigation button {
          color: #e5e7eb !important;
          background: #374151 !important; /* gray-700 */
        }

        /* Weekdays row */
        .react-calendar__month-view__weekdays {
          color: #9ca3af !important; /* gray-400 */
        }

        /* Day tiles */
        .react-calendar__tile {
          background: #374151 !important; /* gray-700 */
          color: #e5e7eb !important;
          border-radius: 0.25rem;
        }

        /* Remove hover changing to white */
        .react-calendar__tile:hover {
          background: #4b5563 !important; /* gray-600 */
          color: #e5e7eb !important;
        }

        /* Current day */
        .react-calendar__tile--now {
          background: #4b5563 !important; /* gray-600 */
          color: #fbbf24 !important; /* yellow-400 */
        }

        /* Active / selected day */
        .react-calendar__tile--active {
          background: #2563eb !important; /* blue-600 */
          color: white !important;
        }

        /* Range selection */
        .react-calendar__tile--range {
          background: #1d4ed8 !important; /* blue-700 */
          color: white !important;
        }
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background: #1e40af !important; /* blue-800 */
          color: white !important;
        }

        /* Weekend days */
        .react-calendar__month-view__days__day--weekend {
          color: #fbbf24 !important; /* yellow-400 */
        }
      `}</style>
    </div>
  );
}
