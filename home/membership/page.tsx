"use client";

import React, { useEffect, useState } from "react";
import { useApi } from "@/providers/ApiProvider";

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

  useEffect(() => {
    const fetchMemberships = async () => {
      setLoading(true);
      try {
        const response =
          await jsonApiClient.get<ApiResponse<UserMembershipsResponse>>(
            "/auth/whoami",
          );
        console.log("Whoami response:", response.data);
        setMemberships(response.data.data.OrganizationMembers ?? []);
      } catch (error) {
        console.error("Failed to fetch memberships", error);
        setMemberships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, [jsonApiClient]);

  if (loading) {
    return (
      <p className="animate-pulse p-6 text-center text-lg font-medium text-slate-800">
        Loading memberships...
      </p>
    );
  }

  if (memberships.length === 0) {
    return (
      <p className="p-6 text-center text-lg text-slate-600">
        You don’t have any organization memberships yet.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        My Organization Memberships
      </h1>
      <div className="space-y-4">
        {memberships.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border border-indigo-400/50 bg-indigo-100/50 p-4 shadow-md"
          >
            <div className="text-xl font-semibold text-indigo-700">
              {member.Organization.name}
            </div>
            <div className="mt-1 text-sm text-slate-700">
              <p>
                <span className="font-medium">Role: </span>
                {member.role}
              </p>
              <p>
                <span className="font-medium">Status: </span>
                {member.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembershipPage;
