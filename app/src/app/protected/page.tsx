"use client";

import { useAuth, useAuthActions } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const { user } = useAuth();
  const { logout } = useAuthActions();
  const router = useRouter();
  return (
    <section className="flex h-dvh w-full flex-col items-center justify-center">
      {user && (
        <>
          <pre className="text-xs text-gray-800">
            {JSON.stringify(user, null, 2)}
          </pre>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            logout
          </button>
        </>
      )}
    </section>
  );
};

export default Page;
