"use client";

import { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postData } from "@/utils/request";

interface SetupFormData {
  balance: number;
}

interface SetupResponse {
  message: string;
  data: {
    _id: string;
    userId: string;
    balance: number;
  };
}

const Page: NextPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>({
    defaultValues: {
      balance: 0,
    },
  });

  const onSubmit = async (data: SetupFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postData<SetupFormData, SetupResponse>(
        "/auth/setup",
        data,
      );

      if (response) {
        // Redirect to dashboard on success
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Setup failed:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to setup account. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background-100 to-indigo-50 p-4">
      <div className="w-full max-w-[600px] bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Setup Your Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your initial balance to get started
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="balance"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-600 font-semibold">
                Rs.
              </span>
              <input
                {...register("balance", {
                  required: "Balance is required",
                  min: {
                    value: 0,
                    message: "Balance must be 0 or greater",
                  },
                  valueAsNumber: true,
                })}
                type="number"
                step="1"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            {errors.balance && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {errors.balance.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting up...
              </span>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
