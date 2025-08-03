"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/stores/authStore";
import { useApi } from "@/providers/ApiProvider";
import { FaRegSquarePlus } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface Organization {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  Owner: {
    id: string;
    name: string | null;
    email: string;
  };
}

const MyOrganizationsPage = () => {
  const { jsonApiClient } = useApi();
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
  }, [jsonApiClient]);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await jsonApiClient.get("/organization");
      setOrganizations(response.data.organizations);
    } catch (error) {
      console.error("Failed to fetch organizations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organization?",
    );
    if (!confirmed) return;

    setDeletingId(id);

    try {
      await jsonApiClient.delete(`/organization/${id}`);
      setOrganizations((prev) => prev.filter((org) => org.id !== id));
    } catch (error) {
      console.error("Failed to delete organization", error);
      alert("Failed to delete organization. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <p className="animate-pulse p-6 text-center text-lg font-medium text-slate-800">
        Loading organizations...
      </p>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-4xl flex-col p-6">
      {/* Header Section */}
      <div className="mb-7 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">My Organizations</h1>
        <button
          className="flex cursor-pointer items-center gap-1.5 rounded border border-gray-400 bg-gradient-to-br from-white to-gray-300 px-3 py-1.5 text-sm font-semibold shadow-md shadow-indigo-400 transition duration-200 hover:from-white hover:to-gray-400"
          onClick={() => router.push("/dashboard/owner/organizations/neworg")}
        >
          <FaRegSquarePlus className="text-lg" />
          <span className="text-md">New Organization</span>
        </button>
      </div>

      {/* Content Section */}
      {organizations.length === 0 ? (
        <p className="mt-12 text-center text-lg text-slate-600 dark:text-slate-400">
          You don’t have any organizations yet.
        </p>
      ) : (
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full flex-col space-y-7 overflow-y-auto pr-2">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="flex flex-col rounded-xl border border-indigo-400/50 bg-blue-100/50 p-6 shadow-md shadow-indigo-200 transition hover:shadow-lg hover:shadow-indigo-400"
              >
                <button
                  onClick={() =>
                    router.push(`/dashboard/owner/organizations/${org.id}`)
                  }
                  className="mb-2 w-fit text-left text-2xl font-semibold text-indigo-700 underline-offset-4 hover:underline"
                >
                  {org.name}
                </button>

                <div className="flex flex-col gap-1 text-sm text-slate-700">
                  <div>
                    <span className="font-medium">Organization Status: </span>
                    <span className="capitalize">{org.status}</span>
                  </div>
                  <div>
                    <span className="font-medium">Created At: </span>
                    <time dateTime={org.createdAt}>
                      {new Date(org.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <div className="truncate">
                    <span className="font-medium">Owner: </span>
                    {org.Owner?.name ?? org.Owner?.email}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(org.id)}
                  disabled={deletingId === org.id}
                  className="mt-4 w-fit rounded-md border-1 border-white bg-red-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === org.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrganizationsPage;
