"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/providers/ApiProvider";
import toast from "react-hot-toast";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Supervisor {
  id: string;
  role: string;
  status: string;
  User: User;
}

export default function SupervisorsPage() {
  const { id: organizationId } = useParams();
  const { jsonApiClient } = useApi();

  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!organizationId) return;

    setLoading(true);
    jsonApiClient
      .get(`/organization/${organizationId}/supervisor`)
      .then((res) => {
        if (res.data.success) {
          setSupervisors(res.data.data);
        } else {
          toast.error("Failed to fetch supervisors.");
        }
      })
      .catch(() => toast.error("Failed to fetch supervisors."))
      .finally(() => setLoading(false));
  }, [organizationId, jsonApiClient]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <h1 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        Supervisors
      </h1>

      {loading ? (
        <p className="text-gray-700 dark:text-gray-300">
          Loading supervisors...
        </p>
      ) : supervisors.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No supervisors found.
        </p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 p-2 text-left text-gray-900 dark:border-gray-600 dark:text-gray-200">
                Name
              </th>
              <th className="border border-gray-300 p-2 text-left text-gray-900 dark:border-gray-600 dark:text-gray-200">
                Email
              </th>
              <th className="border border-gray-300 p-2 text-left text-gray-900 dark:border-gray-600 dark:text-gray-200">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {supervisors.map((supervisor) => (
              <tr
                key={supervisor.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-200">
                  {supervisor.User.firstName} {supervisor.User.lastName}
                </td>
                <td className="border border-gray-300 p-2 text-gray-900 dark:border-gray-600 dark:text-gray-200">
                  {supervisor.User.email}
                </td>
                <td className="border border-gray-300 p-2 dark:border-gray-600">
                  <StatusBadge status={supervisor.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let baseClasses =
    "inline-block rounded-full px-3 py-1 text-xs font-semibold ";
  if (status === "ACTIVE")
    baseClasses += "bg-green-500 text-white dark:bg-green-600";
  else if (status === "INVITED")
    baseClasses +=
      "bg-yellow-400 text-black dark:bg-yellow-500 dark:text-black";
  else if (status === "INACTIVE")
    baseClasses += "bg-red-500 text-white dark:bg-red-600";

  return <span className={baseClasses}>{status}</span>;
}
