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
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Supervisors</h1>

      {loading ? (
        <p>Loading supervisors...</p>
      ) : supervisors.length === 0 ? (
        <p>No supervisors found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {supervisors.map((supervisor) => (
              <tr key={supervisor.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">
                  {supervisor.User.firstName} {supervisor.User.lastName}
                </td>
                <td className="border border-gray-300 p-2">
                  {supervisor.User.email}
                </td>
                <td className="border border-gray-300 p-2">
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
  let bgColor = "bg-gray-300";
  if (status === "ACTIVE") bgColor = "bg-green-500 text-white";
  else if (status === "INVITED") bgColor = "bg-yellow-400 text-black";
  else if (status === "INACTIVE") bgColor = "bg-red-500 text-white";

  return (
    <span
      className={`${bgColor} inline-block rounded-full px-3 py-1 text-xs font-semibold`}
    >
      {status}
    </span>
  );
}
