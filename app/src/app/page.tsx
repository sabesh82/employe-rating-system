"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "@/stores/authStore";

export default function HomePage() {
  const router = useRouter();
  const { user, authToken } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give the auth state a moment to load
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If we're still checking, don't do anything
    if (isChecking) return;

    // If no user or auth token, redirect to login
    if (!user || !authToken) {
      router.replace("/login");
      return;
    }

    // Check if the user has any organization memberships
    // Using type assertion safely
    const userWithMemberships = user as any;
    const memberships = userWithMemberships.OrganizationMembers || [];

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
        console.error("Unknown role:", role);
        router.replace("/login");
    }
  }, [user, authToken, router, isChecking]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <CircularProgress />
    </div>
  );
}
