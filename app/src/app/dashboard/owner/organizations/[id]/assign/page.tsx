"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApi } from "@/providers/ApiProvider";

interface Member {
  id: string;
  name: string;
}

export default function AssignEmployeesPage() {
  const { jsonApiClient } = useApi();
  const { id: orgId } = useParams();

  const [supervisors, setSupervisors] = useState<Member[]>([]);
  const [employees, setEmployees] = useState<Member[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    const fetchMembers = async () => {
      try {
        const res = await jsonApiClient.get(`/organization/${orgId}/members`);
        const members = res.data?.data ?? [];

        setSupervisors(members.filter((m: any) => m.role === "SUPERVISOR"));
        setEmployees(members.filter((m: any) => m.role === "EMPLOYEE"));
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    fetchMembers();
  }, [jsonApiClient, orgId]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await jsonApiClient.post(
        `/organization/${orgId}/assign-employees-to-supervisor`,
        {
          supervisorId: selectedSupervisor,
          employeeIds: selectedEmployees,
        },
      );

      alert("Employees assigned successfully!");
      setSelectedSupervisor("");
      setSelectedEmployees([]);
    } catch (error: any) {
      console.error("Assignment failed", error);
      alert(error?.response?.data?.error?.message ?? "Assignment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 dark:text-gray-200">
        <h2 className="mb-8 text-center text-3xl font-extrabold text-gray-800 dark:text-gray-100">
          Assign Employees to Supervisor
        </h2>

        <div className="mb-6">
          <label
            htmlFor="supervisor-select"
            className="mb-2 block text-lg font-semibold text-gray-700 dark:text-gray-200"
          >
            Select Supervisor
          </label>
          <select
            id="supervisor-select"
            className="w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            value={selectedSupervisor}
            onChange={(e) => setSelectedSupervisor(e.target.value)}
          >
            <option value="" disabled>
              -- Select a Supervisor --
            </option>
            {supervisors.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8">
          <label
            htmlFor="employees-select"
            className="mb-2 block text-lg font-semibold text-gray-700 dark:text-gray-200"
          >
            Select Employees
          </label>
          <select
            id="employees-select"
            multiple
            size={6}
            className="w-full cursor-pointer rounded-md border border-gray-300 px-4 py-3 text-gray-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            value={selectedEmployees}
            onChange={(e) =>
              setSelectedEmployees(
                Array.from(e.target.selectedOptions, (option) => option.value),
              )
            }
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            loading || !selectedSupervisor || selectedEmployees.length === 0
          }
          className={`w-full rounded-md px-6 py-3 text-lg font-semibold shadow-md transition ${
            loading || !selectedSupervisor || selectedEmployees.length === 0
              ? "cursor-not-allowed bg-gray-400 dark:bg-gray-600"
              : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400 focus:outline-none dark:bg-indigo-500 dark:hover:bg-indigo-600"
          }`}
        >
          {loading ? "Assigning..." : "Assign Employees"}
        </button>
      </div>
    </div>
  );
}
