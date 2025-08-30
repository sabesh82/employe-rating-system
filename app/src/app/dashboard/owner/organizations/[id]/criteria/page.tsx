"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import { CriteriaSchema } from "@/schemas/criteria.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useApi } from "@/providers/ApiProvider";

type Criteria = {
  id: string;
  name: string;
  maxScore: number;
  createdAt: string;
};

export default function CriteriaPage() {
  const { id: organizationId } = useParams();
  const [criteriaList, setCriteriaList] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);

  const { jsonApiClient } = useApi();

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editMaxScore, setEditMaxScore] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof CriteriaSchema>>({
    resolver: zodResolver(CriteriaSchema),
  });

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const res = await jsonApiClient.get(
        `/organization/${organizationId}/criteria`,
      );
      setCriteriaList(res.data.data);
    } catch {
      toast.error("Failed to load criteria");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof CriteriaSchema>) => {
    try {
      await jsonApiClient.post(
        `/organization/${organizationId}/criteria`,
        data,
      );
      toast.success("Criteria created");
      reset();
      fetchCriteria();
    } catch (err: any) {
      toast.error(
        err.response?.data?.error?.message || "Error creating criteria",
      );
    }
  };

  const deleteCriteria = async (criteriaId: string) => {
    try {
      await jsonApiClient.delete(
        `/organization/${organizationId}/criteria/${criteriaId}`,
      );
      toast.success("Deleted successfully");
      fetchCriteria();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleUpdate = async (criteriaId: string) => {
    try {
      await jsonApiClient.patch(
        `/organization/${organizationId}/criteria/${criteriaId}`,
        {
          name: editName,
          maxScore: editMaxScore,
        },
      );
      toast.success("Criteria updated");
      setEditId(null);
      fetchCriteria();
    } catch {
      toast.error("Failed to update criteria");
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, [organizationId]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Organization Criteria
        </h1>

        {/* New Criteria Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-5 space-y-3 rounded-lg border border-gray-200/50 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Add New Criteria
          </h2>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              {...register("name")}
              className="w-full rounded-md border px-4 py-1 focus:border-indigo-500 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Max Score
            </label>
            <input
              type="number"
              {...register("maxScore", { valueAsNumber: true })}
              className="w-full rounded-md border px-4 py-1 focus:border-indigo-500 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {errors.maxScore && (
              <p className="mt-1 text-sm text-red-500">
                {errors.maxScore.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>

        {/* Existing Criteria Section*/}
        <div
          className="flex flex-col rounded-lg border border-gray-400/50 bg-gray-200/30 p-4 shadow-md shadow-gray-600 dark:border-gray-700 dark:bg-gray-800"
          style={{ height: 300 }}
        >
          <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white">
            Existing Criterias
          </h2>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Loading...</p>
          ) : criteriaList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              No criteria found.
            </p>
          ) : (
            <div className="scrollbar-thin scrollbar-thumb-indigo-500 flex-1 overflow-y-auto bg-white pr-2 dark:bg-gray-700">
              <ul className="space-y-3">
                {criteriaList.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-md border p-4 dark:border-gray-600"
                  >
                    {editId === item.id ? (
                      <div className="w-full space-y-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <input
                          type="number"
                          value={editMaxScore}
                          onChange={(e) =>
                            setEditMaxScore(Number(e.target.value))
                          }
                          className="w-full rounded-md border px-2 py-1 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(item.id)}
                            className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="rounded bg-gray-400 px-3 py-1 text-white hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Max Score: {item.maxScore}
                          </p>
                        </div>
                        <div className="space-x-4">
                          <button
                            onClick={() => {
                              setEditId(item.id);
                              setEditName(item.name);
                              setEditMaxScore(item.maxScore);
                            }}
                            className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCriteria(item.id)}
                            className="text-sm text-red-600 hover:underline dark:text-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
