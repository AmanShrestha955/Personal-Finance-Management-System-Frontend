"use client";
import Input from "@/component/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  getFamilySavingGoalById,
  updateFamilySavingProgress,
} from "@/utils/familySavingGoalApi";
import { BackendErrorResponse } from "@/types/type";
import { useNotification } from "@/hooks/NotificationContext";
import { getMyFamily } from "@/utils/familyApi";

export default function Page({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const { addNotification } = useNotification();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [action, setAction] = useState<string>("");
  const savingId = searchParams.get("id");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      amount: 0,
    },
  });

  // Fetch family data
  const { data: family } = useQuery({
    queryKey: ["family"],
    queryFn: getMyFamily,
    retry: false,
  });

  const {
    data: savingGoal,
    isLoading: isLoadingSavingGoal,
    error: savingGoalError,
  } = useQuery({
    queryKey: ["family-saving-goal", savingId, family?._id],
    queryFn: () =>
      family?._id && savingId
        ? getFamilySavingGoalById(family._id, savingId as string)
        : undefined,
    enabled: !!savingId && !!family?._id,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (amount: number) => {
      if (!family?._id) throw new Error("Family not found");
      return await updateFamilySavingProgress(family._id, savingId as string, amount);
    },
    onSuccess: (data) => {
      console.log("successfully updated family saving progress: ", data);
      addNotification(
        "success",
        action === "withdraw" ? "Withdrawal" : "Saving",
        "Family saving progress updated successfully",
      );

      queryClient.invalidateQueries({ queryKey: ["family-saving-goals-stats"] });
      queryClient.invalidateQueries({ queryKey: ["family-saving-goals"] });
      queryClient.invalidateQueries({ queryKey: ["family-saving-goal", savingId] });
      navigation.push("/dashboard/family-management");
    },

    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
      addNotification(
        "error",
        action === "withdraw" ? "Withdrawal" : "Saving",
        message,
      );
      console.log("error in form data post: ", message);
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    params.then((p) => setAction(p.action));
  }, [params]);

  const onSubmit = async (data: { amount: number }) => {
    try {
      setErrorMessage("");
      if (savingId) {
        let amount = data.amount;
        if (action === "withdraw") {
          amount = -Math.abs(data.amount);
        }
        updateProgressMutation.mutate(amount);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrorMessage(
        axiosError.response?.data?.message || "An error occurred",
      );
    }
  };

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-xl"
      >
        <div className="flex flex-col gap-md">
          <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[100%]">
            {action === "add-amount"
              ? "Add Saving Amount"
              : "Withdraw Saving Amount"}
          </h1>
          <p className="font-sansation text-body tracking-[5%] text-text-1000">
            {action === "add-amount"
              ? "Add funds to your family saving goal."
              : "Withdraw funds from your family saving goal."}
          </p>
        </div>
        {errorMessage && (
          <p className="font-nunitosans text-body text-red-700 font-bold">
            {errorMessage}
          </p>
        )}

        {/* basic details */}
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col p-lg gap-lg rounded-md bg-card-100 shadow-effect-2 font-nunitosans">
            <h2 className="font-bold text-heading2 text-text-1000">
              {isLoadingSavingGoal ? "Loading..." : savingGoal?.goalName}
            </h2>
            {savingGoal && (
              <>
                <div className="flex flex-row justify-between font-semibold text-body text-text-1000">
                  <div className="flex flex-col gap-lg">
                    <p>Category: {savingGoal.category}</p>
                    <p>Total Amount: Rs {savingGoal.targetAmount}</p>
                  </div>
                  <div className="flex flex-col gap-lg">
                    <p>
                      Deadline:{" "}
                      {savingGoal.deadline
                        ? new Date(savingGoal.deadline).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : "—"}
                    </p>
                    <p>
                      Currently Saved: Rs {savingGoal.currentSaving}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-text-1000">
                      Progress
                    </span>
                    <span className="font-semibold text-text-1000">
                      {savingGoal.targetAmount > 0
                        ? Math.round(
                            (savingGoal.currentSaving / savingGoal.targetAmount) *
                              100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-card-300 rounded-full h-3">
                    <div
                      className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                      style={{
                        width:
                          savingGoal.targetAmount > 0
                            ? `${Math.min(
                                (savingGoal.currentSaving /
                                  savingGoal.targetAmount) *
                                  100,
                                100,
                              )}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Amount Input */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              {action === "add-amount" ? "Add Amount" : "Withdraw Amount"}
            </p>

            <Input
              prefix="Rs"
              placeholder="5000"
              type="number"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be greater than 0" },
              })}
            />
          </div>
        </div>

        {/* button */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
              action === "withdraw"
                ? "bg-red-500 hover:bg-red-600 active:bg-red-800"
                : "bg-primary-500 hover:bg-primary-600 active:bg-primary-800"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : action === "withdraw"
                ? "Withdraw"
                : "Add Amount"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigation.push("/dashboard/family-management");
            }}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-md py-lg px-md w-[442px] min-w-[300px] rounded-md bg-card-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            {action === "add-amount"
              ? "How to Add Funds"
              : "How to Withdraw Funds"}
          </h4>
          <p className="font-nunitosans text-text-1000 text-body leading-[110%]">
            {action === "add-amount"
              ? "Enter the amount you want to add to your family's saving goal. The progress will update immediately and all family members can see the updated amount."
              : "Enter the amount you want to withdraw from your family's saving goal. Make sure you have sufficient balance before withdrawing."}
          </p>
        </div>
      </div>
    </div>
  );
}
