"use client";

import React from "react";
import { useAuthActions } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useWhoAmI } from "../api-client/user/useWhoAmI";

const Page = () => {
  const router = useRouter();
  const { logout } = useAuthActions();
  const { data: user, isPending: isUserLoading } = useWhoAmI();
  return (
    <section className="flex h-dvh w-full flex-col">
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

      {isUserLoading && <p>loading...</p>}
    </section>
  );
};

export default Page;
