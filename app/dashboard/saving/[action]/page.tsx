"use client";
import Input from "@/component/Input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  createSavingGoal,
  CreateSavingGoalData,
  getSavingGoalById,
  UpdateProgressData,
  updateSavingGoal,
  updateSavingProgress,
} from "@/utils/savingGoalApi";
import { BackendErrorResponse } from "@/types/type";

export default function Page({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
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

  const {
    data: savingGoal,
    isLoading: isLoadingSavingGoal,
    error: savingGoalError,
  } = useQuery({
    queryKey: ["saving-goal", savingId],
    queryFn: () => getSavingGoalById(savingId as string),
    enabled: !!savingId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: UpdateProgressData) => {
      return await updateSavingProgress(savingId as string, data);
    },
    onSuccess: (data) => {
      console.log("sucessfully send form data: ", data);
      queryClient.invalidateQueries({ queryKey: ["saving-goals-stats"] });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({ queryKey: ["saving-goal", savingId] });
      navigation.push("/dashboard/saving");
    },

    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
      console.log("error in form data post: ", message);
    },
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    params.then((p) => setAction(p.action));
  }, [params]);

  const onSubmit = async (data: UpdateProgressData) => {
    try {
      setErrorMessage("");
      if (savingId) {
        if (action === "withdraw") {
          data.amount = -Math.abs(data.amount);
        }
        updateProgressMutation.mutate(data);

        navigation.push("/dashboard/saving");
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
            Set up your new savings objective. Fill in the details bellow.
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
              {savingGoal?.goalName}
            </h2>
            <div className="flex flex-row justify-between font-semibold text-body text-text-1000">
              <div className="flex flex-col gap-lg">
                <p>Category: {savingGoal?.category}</p>
                <p>Total Amount: Rs {savingGoal?.targetAmount}</p>
              </div>
              <div className="flex flex-col gap-lg">
                <p>
                  Deadline:{" "}
                  {savingGoal?.deadline
                    ? new Date(savingGoal.deadline).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )
                    : "N/A"}
                </p>
                <p>
                  Remaining Amount: Rs{" "}
                  {(savingGoal?.targetAmount as number) -
                    ((savingGoal?.currentSaving as number) ?? 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-medium">
              Target Amount
            </p>

            <Input
              prefix="Rs"
              placeholder="5000"
              type="number"
              {...register("amount", {
                valueAsNumber: true,
                required: "Amount is required",
              })}
            />
          </div>
        </div>

        {/* button */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Amount"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigation.push("/dashboard/saving");
            }}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-md">
        {savingGoal && (
          <div
            className={`flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border border-card-200 bg-card-100 text-text-1000 shadow-effect-2`}
          >
            <h4 className="font-nunitosans font-bold  text-heading3">
              Goal Progress Preview
            </h4>
            <div className="flex flex-col gap-xxs">
              <p className="font-nunitosans font-normal ">
                You&apos;ve saved <b>Rs {savingGoal.currentSaving} </b> out of{" "}
                <b>Rs {savingGoal.targetAmount}</b> for{" "}
                <b>{savingGoal.goalName}</b> budget.
              </p>
              <div className="relative h-1 w-full rounded-full bg-card-200 z-10 overflow-hidden">
                <div
                  className={`h-1 rounded-full bg-secondary-400`}
                  style={{
                    width: `${(savingGoal.currentSaving / savingGoal.targetAmount) * 100 > 100 ? 100 : (savingGoal.currentSaving / savingGoal.targetAmount) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="font-nunitosans font-medium text-caption text-right ">
                {(savingGoal.currentSaving / savingGoal.targetAmount) * 100 >
                100
                  ? 100
                  : (savingGoal.currentSaving / savingGoal.targetAmount) * 100}
                % Completed
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
