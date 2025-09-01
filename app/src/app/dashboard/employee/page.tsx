"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "@/providers/ApiProvider";
import { useAuth } from "@/stores/authStore";
import { FaSearch, FaList, FaUserTie, FaBuilding } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { useRouter } from "next/navigation";

type CriteriaScore = {
  score: number;
  criteriaId?: string;
  Criteria?: { name?: string | null };
};

type Rating = {
  id: string;
  periodStart: string;
  periodEnd: string;
  overallScore: number;
  maxOverallScore: number;
  feedback?: string | null;
  Organization?: { id: string; name: string };
  Supervisor?: {
    firstName?: string | null;
    lastName?: string | null;
    email: string;
  };
  criteriaScores?: CriteriaScore[];
};

export default function EmployeeDashboardPage() {
  const { jsonApiClient } = useApi();
  const { user } = useAuth();
  const router = useRouter();

  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        // Aggregated ratings for this employee across all orgs
        const res = await jsonApiClient.get(`/user/${user.id}/ratings`);
        // Expecting { success: true, data: Rating[] }
        setRatings(res.data?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch employee ratings", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jsonApiClient, user?.id]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ratings;
    return ratings.filter((r) => {
      const org = r.Organization?.name?.toLowerCase() ?? "";
      const supName =
        `${r.Supervisor?.firstName ?? ""} ${r.Supervisor?.lastName ?? ""}`
          .trim()
          .toLowerCase();
      const supEmail = r.Supervisor?.email?.toLowerCase() ?? "";
      const feedback = r.feedback?.toLowerCase() ?? "";
      return (
        org.includes(q) ||
        supName.includes(q) ||
        supEmail.includes(q) ||
        feedback.includes(q)
      );
    });
  }, [ratings, search]);

  // quick summary
  const summary = useMemo(() => {
    if (!ratings.length) return { count: 0, avgPct: 0 };
    const sumPct = ratings.reduce((acc, r) => {
      const pct = r.maxOverallScore
        ? (r.overallScore / r.maxOverallScore) * 100
        : 0;
      return acc + pct;
    }, 0);
    return {
      count: ratings.length,
      avgPct: Math.round((sumPct / ratings.length) * 10) / 10,
    };
  }, [ratings]);

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : "-";
  const supLabel = (r: Rating) => {
    const fn = r.Supervisor?.firstName ?? "";
    const ln = r.Supervisor?.lastName ?? "";
    const full = `${fn} ${ln}`.trim();
    return full || r.Supervisor?.email || "-";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-200">
            Loading your ratings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <IoIosHome className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              My Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by org, supervisor, or feedback..."
                className="block w-80 rounded-md border border-gray-300 bg-white py-2 pr-3 pl-10 text-sm placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50">
            <div className="flex items-center gap-3">
              <FaList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Ratings
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {summary.count}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50">
            <div className="flex items-center gap-3">
              <FaUserTie className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Score
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {summary.avgPct}%
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200/50 dark:bg-gray-800 dark:ring-gray-700/50">
            <div className="flex items-center gap-3">
              <FaBuilding className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Organizations Rated In
                </p>
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {new Set(ratings.map((r) => r.Organization?.id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-16 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
              No ratings found
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Try clearing the search or check back later.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Supervisor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Criteria Breakdown
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-white">
                    Feedback
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filtered.map((r) => {
                  const pct = r.maxOverallScore
                    ? Math.round((r.overallScore / r.maxOverallScore) * 100)
                    : 0;
                  return (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-200">
                        {r.Organization?.name ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {fmtDate(r.periodStart)} – {fmtDate(r.periodEnd)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                        {supLabel(r)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {r.overallScore}
                          </span>
                          <span className="text-gray-400 dark:text-gray-500">
                            / {r.maxOverallScore}
                          </span>
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <div className="flex flex-wrap gap-2">
                          {(r.criteriaScores ?? []).map((cs, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                            >
                              {cs.Criteria?.name ?? "Criteria"} : {cs.score}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="max-w-xs px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        <p className="line-clamp-3">{r.feedback ?? "-"}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
