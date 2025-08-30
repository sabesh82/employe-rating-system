"use client";

import { useApi } from "@/providers/ApiProvider";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

type OrgMember = {
  id: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

type Criteria = {
  id: string;
  name: string;
  maxScore: number;
  createdAt: string;
};

type Rating = {
  id: string;
  periodStart: string;
  periodEnd: string;
  feedback?: string;
  overallScore: number;
  Employee: {
    firstName: string;
    lastName: string;
  };
};

export default function CreateRatingPage() {
  const { id: organizationId } = useParams<{ id: string }>();
  const { jsonApiClient } = useApi();

  const [rateeType, setRateeType] = useState<"EMPLOYEE" | "SUPERVISOR">(
    "EMPLOYEE",
  );
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);

  useEffect(() => {
    if (!organizationId) return;

    const fetchData = async () => {
      try {
        const rolePath = rateeType === "EMPLOYEE" ? "employees" : "supervisor";

        const [memberRes, criteriaRes] = await Promise.all([
          jsonApiClient.get(`/organization/${organizationId}/${rolePath}`),
          jsonApiClient.get(`/organization/${organizationId}/criteria`),
        ]);

        setMembers(memberRes.data?.data || []);
        setCriteria(criteriaRes.data?.data || []);
        setSelectedUserId("");
        setScores({});
      } catch (err) {
        console.error("Failed to fetch members or criteria", err);
      }
    };

    fetchData();
  }, [organizationId, rateeType, jsonApiClient]);

  const fetchGivenRatings = async () => {
    if (!organizationId) return;
    try {
      const res = await jsonApiClient.get(
        `/organization/${organizationId}/rating`,
      );
      setGivenRatings(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch given ratings", err);
    }
  };

  useEffect(() => {
    fetchGivenRatings();
  }, [organizationId]);

  const handleScoreChange = (criteriaId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: value,
    }));
  };

  const validateSubmission = () => {
    if (!selectedUserId) {
      alert("Please select a user to rate.");
      return false;
    }
    if (!startDate || !endDate) {
      alert("Please select a start and end date.");
      return false;
    }
    if (Object.keys(scores).length === 0) {
      alert("Please enter at least one score.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSubmission()) return;

    const payload = {
      employeeId: selectedUserId,
      periodStart: startDate,
      periodEnd: endDate,
      feedback,
      criteriaScores: Object.entries(scores).map(([criteriaId, score]) => ({
        criteriaId,
        score,
      })),
    };

    try {
      await jsonApiClient.post(
        `/organization/${organizationId}/rating`,
        payload,
      );
      alert("Rating submitted successfully!");

      setSelectedUserId("");
      setScores({});
      setFeedback("");
      setStartDate("");
      setEndDate("");

      fetchGivenRatings();
    } catch (err) {
      console.error("Submit rating failed", err);
      alert("Error submitting rating.");
    }
  };

  const handleDelete = async (ratingId: string) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;

    try {
      await jsonApiClient.delete(
        `/organization/${organizationId}/rating/${ratingId}`,
      );
      alert("Rating deleted successfully.");
      fetchGivenRatings();
    } catch (err) {
      console.error("Failed to delete rating", err);
      alert("Error deleting rating.");
    }
  };

  const handleEdit = (ratingId: string) => {
    alert(`Edit functionality coming soon for rating id: ${ratingId}`);
  };

  return (
    <div className="w-full dark:bg-gray-900">
      <div
        className="mx-auto max-w-3xl space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900 dark:text-gray-200 border-1 border-white/20"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Create Rating
        </h1>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Select Ratee Type
          </h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setRateeType("EMPLOYEE")}
              className={`flex-1 rounded-md px-6 py-3 font-medium transition-colors ${
                rateeType === "EMPLOYEE"
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
              type="button"
            >
              Employee
            </button>
            <button
              onClick={() => setRateeType("SUPERVISOR")}
              className={`flex-1 rounded-md px-6 py-3 font-medium transition-colors ${
                rateeType === "SUPERVISOR"
                  ? "bg-blue-600 text-white dark:bg-blue-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              }`}
              type="button"
            >
              Supervisor
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Rating Details
          </h2>
          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              Select a {rateeType.toLowerCase()}:
            </label>
            <select
              className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              onChange={(e) => setSelectedUserId(e.target.value)}
              value={selectedUserId}
            >
              <option value="">-- Select --</option>
              {members.map((member) =>
                member?.User ? (
                  <option key={member.id} value={member.User.id}>
                    {member.User.firstName} {member.User.lastName} (
                    {member.User.email})
                  </option>
                ) : null,
              )}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                Start Date:
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
                End Date:
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Criteria Scores
            </h3>
            {criteria.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                No criteria available.
              </p>
            )}
            {criteria.map((c) => (
              <div key={c.id} className="space-y-2">
                <label className="block font-medium text-gray-700 dark:text-gray-300">
                  {c.name}{" "}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    (Max Score: {c.maxScore})
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  value={scores[c.id] || ""}
                  onChange={(e) =>
                    handleScoreChange(c.id, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>

          <div>
            <label className="mb-2 block font-medium text-gray-700 dark:text-gray-300">
              Feedback (optional):
            </label>
            <textarea
              className="w-full rounded-md border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full rounded-md bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            type="button"
          >
            Submit Rating
          </button>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Ratings You've Given
          </h2>
          {givenRatings.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No ratings submitted yet.
            </p>
          )}
          {givenRatings.map((rating) => (
            <div
              key={rating.id}
              className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <p className="text-gray-800 dark:text-gray-200">
                <strong className="font-semibold">Rated:</strong>{" "}
                {rating.Employee.firstName} {rating.Employee.lastName}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong className="font-semibold">Period:</strong>{" "}
                {new Date(rating.periodStart).toLocaleDateString()} -{" "}
                {new Date(rating.periodEnd).toLocaleDateString()}
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong className="font-semibold">Overall Score:</strong>{" "}
                {rating.overallScore}
              </p>
              {rating.feedback && (
                <p className="text-gray-800 dark:text-gray-200">
                  <strong className="font-semibold">Feedback:</strong>{" "}
                  {rating.feedback}
                </p>
              )}

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleEdit(rating.id)}
                  className="rounded-md bg-yellow-500 px-4 py-2 font-medium text-white transition-colors hover:bg-yellow-600"
                  type="button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(rating.id)}
                  className="rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
