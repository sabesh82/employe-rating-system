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
    } catch (err) {
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
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchCriteria();
  }, [organizationId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Organization Criteria
        </h1>

        {/* New Criteria Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-8 space-y-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800"
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
              className="w-full rounded-md border px-4 py-2 focus:border-indigo-500 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
              className="w-full rounded-md border px-4 py-2 focus:border-indigo-500 focus:ring focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </form>

        {/* Criteria List */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            Existing Criteria
          </h2>
          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Loading...</p>
          ) : criteriaList.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-300">
              No criteria found.
            </p>
          ) : (
            <ul className="scrollbar-thin scrollbar-thumb-indigo-500 max-h-[400px] space-y-3 overflow-y-auto">
              {criteriaList.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-md border p-4 dark:border-gray-600"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      Max Score: {item.maxScore}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteCriteria(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
