"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/ApiProvider";
import {
  FaBuilding,
  FaUserTag,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
} from "react-icons/fa";

interface OrganizationMember {
  id: string;
  role: string;
  status: string;
  Organization: {
    id: string;
    name: string;
  };
}

interface UserMembershipsResponse {
  OrganizationMembers: OrganizationMember[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const MembershipPage = () => {
  const { jsonApiClient } = useApi();
  const [memberships, setMemberships] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading(true);
      try {
        const response =
          await jsonApiClient.get<ApiResponse<UserMembershipsResponse>>(
            "/auth/whoami",
          );
        const normalizedMemberships =
          response.data.data.OrganizationMembers?.map((member) => ({
            ...member,
            status: member.status.trim().toLowerCase(),
          })) ?? [];
        setMemberships(normalizedMemberships);
      } catch (error) {
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [jsonApiClient]);

  const filteredMemberships = memberships.filter(
    (member) =>
      member.Organization.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.status.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="animate-pulse text-lg font-semibold text-gray-900 dark:text-gray-200">
            Loading memberships...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
                My Organization Memberships
              </h1>
              <p className="mt-2 text-base text-gray-700 dark:text-gray-400">
                Manage and view your organization memberships
              </p>
            </div>
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch
                  className="h-5 w-5 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                placeholder="Search memberships..."
                className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search memberships"
              />
            </div>
          </div>
        </div>

        {filteredMemberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-gray-100 p-8 shadow-lg transition-all duration-300 dark:bg-gray-800">
            <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-700">
              <FaBuilding
                className="h-10 w-10 text-blue-500 dark:text-blue-400"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-gray-200">
              No memberships found
            </h3>
            <p className="mt-2 max-w-md text-center text-sm text-gray-700 dark:text-gray-400">
              You don’t have any organization memberships yet. Join an
              organization to get started.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-base font-medium text-gray-900 dark:text-gray-200">
                {filteredMemberships.length}{" "}
                {filteredMemberships.length === 1
                  ? "membership"
                  : "memberships"}{" "}
                found
              </p>
            </div>
            <div className="overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-300"
                    >
                      Organization
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-300"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-gray-300"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  {filteredMemberships.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                      role="row"
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-200">
                        <div className="flex items-center space-x-2">
                          <FaBuilding
                            className="h-5 w-5 text-blue-500 dark:text-blue-400"
                            aria-hidden="true"
                          />
                          <span>{member.Organization.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          <FaUserTag
                            className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-900 dark:bg-gray-700 dark:text-blue-400">
                            {member.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                          {member.status === "active" ? (
                            <FaCheckCircle
                              className="h-5 w-5 text-green-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaTimesCircle
                              className="h-5 w-5 text-red-500"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                              member.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400"
                            }`}
                          >
                            {member.status.charAt(0).toUpperCase() +
                              member.status.slice(1)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
