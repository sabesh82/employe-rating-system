"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/stores/authStore";
import { useApi } from "@/providers/ApiProvider";
import {
  FaBuilding,
  FaTrash,
  FaCalendar,
  FaCrown,
  FaPlus,
  FaSearch,
  FaEye,
} from "react-icons/fa";
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
  const [searchQuery, setSearchQuery] = useState("");
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
      "Are you sure you want to delete this organization? This action cannot be undone.",
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

  const filteredOrganizations = organizations.filter(
    (org) =>
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.Owner?.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            Loading organizations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                Organizations
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Manage your organizations and access their settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search organizations..."
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                onClick={() =>
                  router.push("/dashboard/owner/organizations/neworg")
                }
              >
                <FaPlus className="text-sm" />
                <span>New Organization</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {organizations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-16 dark:border-gray-700 dark:bg-gray-800">
            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900">
              <FaBuilding className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900 dark:text-gray-200">
              No organizations
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Get started by creating your first organization.
            </p>
            <button
              className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              onClick={() =>
                router.push("/dashboard/owner/organizations/neworg")
              }
            >
              <FaPlus className="mr-2 text-sm" />
              New Organization
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-700 dark:text-gray-400">
                {filteredOrganizations.length}{" "}
                {filteredOrganizations.length === 1
                  ? "organization"
                  : "organizations"}
              </p>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                      Status
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {filteredOrganizations.map((org) => (
                    <tr
                      key={org.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-200">
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/owner/organizations/${org.id}`,
                            )
                          }
                          className="text-left text-blue-600 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          {org.name}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaCrown className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                          {org.Owner?.name || org.Owner?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FaCalendar className="mr-1.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                          <time dateTime={org.createdAt}>
                            {new Date(org.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            org.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200"
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/owner/organizations/${org.id}`,
                              )
                            }
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                          >
                            <FaEye className="mr-1.5 -ml-0.5 h-4 w-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(org.id)}
                            disabled={deletingId === org.id}
                            className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:border-red-700 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-800"
                          >
                            <FaTrash className="mr-1.5 -ml-0.5 h-4 w-4" />
                            {deletingId === org.id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrganizationsPage;
