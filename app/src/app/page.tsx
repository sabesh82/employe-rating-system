"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/stores/authStore";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Check if the user has any organization memberships
    const memberships = (user as any).OrganizationMembers ?? [];

    if (memberships.length === 0) {
      router.replace("/dashboard/owner");
      return;
    }

    // Use role from the first membership
    const role = memberships[0]?.role;

    switch (role) {
      case "OWNER":
        router.replace("/dashboard/owner");
        break;
      case "EMPLOYEE":
        router.replace("/dashboard/employee");
        break;
      case "SUPERVISOR":
        router.replace("/dashboard/supervisor");
        break;
      default:
        router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CircularProgress />
    </div>
  );
}
