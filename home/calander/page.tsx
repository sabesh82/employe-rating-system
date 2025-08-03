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
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col">
        <h1 className="mb-4 text-center text-2xl font-bold">Calendar</h1>
        <div className="inline-block rounded-md bg-gray-100 p-4 shadow-md">
          <Calendar
            onChange={(val) => setValue(val)}
            value={value}
            selectRange
          />
          <p className="mt-4">You selected: {renderSelectedDate()}</p>
        </div>
      </div>
    </div>
  );
}
