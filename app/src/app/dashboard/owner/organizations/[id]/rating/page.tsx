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

  // New state to hold given ratings
  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);

  // Fetch members and criteria when organizationId or rateeType changes
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

  // Fetch given ratings on mount and after submit
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

      // Reset form
      setSelectedUserId("");
      setScores({});
      setFeedback("");
      setStartDate("");
      setEndDate("");

      // Refresh the ratings list
      fetchGivenRatings();
    } catch (err) {
      console.error("Submit rating failed", err);
      alert("Error submitting rating.");
    }
  };

  // New: Delete handler
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

  // New: Edit handler placeholder
  const handleEdit = (ratingId: string) => {
    alert(`Edit functionality coming soon for rating id: ${ratingId}`);
    // You can extend this to open a modal or navigate to an edit page
  };

  return (
    <div
      className="mx-auto max-w-2xl space-y-6 p-6"
      style={{ maxHeight: "100vh", overflowY: "auto" }}
    >
      {/* --- Existing form elements --- */}
      <h1 className="text-2xl font-bold">Rate a {rateeType.toLowerCase()}</h1>

      <div className="flex space-x-4">
        <button
          onClick={() => setRateeType("EMPLOYEE")}
          className={`border px-4 py-2 ${
            rateeType === "EMPLOYEE" ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          Employee
        </button>
        <button
          onClick={() => setRateeType("SUPERVISOR")}
          className={`border px-4 py-2 ${
            rateeType === "SUPERVISOR" ? "bg-gray-200" : ""
          }`}
          type="button"
        >
          Supervisor
        </button>
      </div>

      <div>
        <label className="mb-1 block font-medium">
          Select a {rateeType.toLowerCase()}:
        </label>
        <select
          className="w-full border p-2"
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
          <label className="block">Start Date:</label>
          <input
            type="date"
            className="w-full border p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block">End Date:</label>
          <input
            type="date"
            className="w-full border p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Criteria Scores</h2>
        {criteria.length === 0 && <p>No criteria available.</p>}
        {criteria.map((c) => (
          <div key={c.id}>
            <label className="block font-medium text-gray-700">
              {c.name}{" "}
              <span className="text-sm text-gray-500">
                (Max Score: {c.maxScore})
              </span>
            </label>
            <input
              type="number"
              min={1}
              max={5}
              className="w-full border p-2"
              value={scores[c.id] || ""}
              onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block">Feedback (optional):</label>
        <textarea
          className="w-full border p-2"
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        type="button"
      >
        Submit Rating
      </button>

      {/* --- Updated Ratings View Section --- */}
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Ratings You've Given</h2>
        {givenRatings.length === 0 && <p>No ratings submitted yet.</p>}
        {givenRatings.map((rating) => (
          <div
            key={rating.id}
            className="mb-4 rounded border bg-gray-50 p-4 shadow-sm"
          >
            <p>
              <strong>Rated:</strong> {rating.Employee.firstName}{" "}
              {rating.Employee.lastName}
            </p>
            <p>
              <strong>Period:</strong>{" "}
              {new Date(rating.periodStart).toLocaleDateString()} -{" "}
              {new Date(rating.periodEnd).toLocaleDateString()}
            </p>
            <p>
              <strong>Overall Score:</strong> {rating.overallScore}
            </p>
            {rating.feedback && (
              <p>
                <strong>Feedback:</strong> {rating.feedback}
              </p>
            )}

            {/* New buttons */}
            <div className="mt-3 flex space-x-2">
              <button
                onClick={() => handleDelete(rating.id)}
                className="rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
