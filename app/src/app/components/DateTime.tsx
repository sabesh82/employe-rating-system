"use client";

import React, { useEffect, useState } from "react";

export default function DateTime() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-mono text-xs text-black">
      {dateTime.toLocaleString()}
    </div>
  );
}
