"use client";
import DropDown from "@/component/DropDown";
import TagIcon from "@/component/icons/tag";
import Input from "@/component/Input";
import Tag from "@/component/Tag";
import {
  AccountResponseData,
  AllBudgetResponseData,
  BackendErrorResponse,
  BudgetData,
  TransactionFormData,
  TransactionFormResponseData,
} from "@/types/type";
import { getData, postData, putData } from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  createSavingGoal,
  CreateSavingGoalData,
  getSavingGoalById,
  updateSavingGoal,
} from "@/utils/savingGoalApi";

const Page: NextPage = () => {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const savingId = searchParams.get("id");
  const isEditMode = !!savingId;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      goalName: "",
      targetAmount: 0,
      currentSaving: 0,
      deadline: "",
      category: "",
    },
  });

  const goalName = watch("goalName");
  const targetAmount = watch("targetAmount");
  const currentSaving = watch("currentSaving");

  // Fetch saving data if in edit mode
  const { data: savingData, isLoading: isLoadingSaving } = useQuery({
    queryKey: ["saving", savingId],
    queryFn: () => getSavingGoalById(savingId as string),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateSavingGoalData) => {
      return await createSavingGoal(data);
    },
    onSuccess: (data) => {
      console.log("sucessfully send form data: ", data);
      navigation.push("/dashboard/saving");
    },

    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
      console.log("error in form data post: ", message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: CreateSavingGoalData) => {
      return await updateSavingGoal(savingId as string, data);
    },
    onSuccess: (data) => {
      console.log("Successfully updated transaction: ", data);
      navigation.push("/dashboard/saving");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
    },
  });

  const categoryOptions = [
    { text: "Food", icon: <></> },
    { text: "Transport", icon: <></> },
    { text: "Shopping", icon: <></> },
    { text: "Bills", icon: <></> },
    { text: "Rent", icon: <></> },
    { text: "Entertainment", icon: <></> },
    { text: "Others", icon: <></> },
  ];
  const defaultCategorySelectedOption = {
    text: "Select Category",
    icon: <></>,
  };
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategorySelectedOption,
  );

  const [errorMessage, setErrorMessage] = useState<string>("");

  // Populate form when editing
  useEffect(() => {
    if (savingData && isEditMode) {
      reset({
        goalName: savingData.goalName,
        targetAmount: savingData.targetAmount,
        currentSaving: savingData.currentSaving,
        deadline: new Date(savingData.deadline).toISOString().split("T")[0],
        category: savingData.category,
      });

      // Update selected category
      const category = categoryOptions.find(
        (opt) => opt.text === savingData.category,
      );
      if (category) setSelectedCategory(category);
    }
  }, [savingData, isEditMode]);

  const onSubmit = (data: CreateSavingGoalData) => {
    data.deadline = new Date(data.deadline).toISOString();
    console.log(data);

    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoadingSaving) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-body">Loading Saving...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-xl"
      >
        <div className="flex flex-col gap-md">
          <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[100%]">
            Add Saving Goals
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
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Goal Name
            </p>
            <Input
              placeholder="eg. Buy a House"
              type="text"
              {...register("goalName", { required: "Goal Name is required" })}
            />
            {errors.goalName && (
              <span className="text-red-500 text-sm">
                {errors.goalName.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-medium">
              Target Amount
            </p>

            <Input
              prefix="Rs"
              placeholder="5000"
              type="number"
              {...register("targetAmount")}
            />
          </div>
          {isEditMode ? null : (
            <div className="flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-medium">
                Current Saved
              </p>

              <Input
                prefix="Rs"
                placeholder="5000"
                type="number"
                {...register("currentSaving")}
              />
            </div>
          )}

          {/* categories */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Categories
            </p>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <DropDown
                  options={categoryOptions}
                  selectedOption={selectedCategory}
                  onSelect={(option) => {
                    setSelectedCategory(option);
                    setIsCategoryDropdownOpen(false);
                    field.onChange(option.text);
                  }}
                  isOpen={isCategoryDropdownOpen}
                  onToggle={() =>
                    setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                  }
                />
              )}
            />
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Date */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Deadline
            </p>
            <Input
              placeholder=""
              type="date"
              {...register("deadline", { required: "Deadline is required" })}
            />
            {errors.deadline && (
              <span className="text-red-500 text-sm">
                {errors.deadline.message}
              </span>
            )}
          </div>
        </div>

        {/* button */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Goal"
                : "Create Goal"}
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigation.push("/dashboard/transaction-management");
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
            Important Note
          </h4>
          <p className="font-nunitosans text-text-1000 text-body leading-[110%]">
            Once you create a saving goal, your progress will automatically
            update based on the amount you add to your savings. Adjusting the
            “Current Saved” amount will immediately recalculate your progress.
            You’ll be able to track how close you are to achieving your goal,
            get reminders, and stay motivated.
          </p>
        </div>
        {goalName && targetAmount ? (
          <div
            className={`flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border border-card-200 bg-card-100 text-text-1000 shadow-effect-2`}
          >
            <h4 className="font-nunitosans font-bold  text-heading3">
              Goal Progress Preview
            </h4>
            <div className="flex flex-col gap-xxs">
              <p className="font-nunitosans font-normal ">
                You&apos;ve saved <b>Rs {currentSaving} </b> out of{" "}
                <b>Rs {targetAmount}</b> for <b>{goalName}</b> budget.
              </p>
              <div className="relative h-1 w-full rounded-full bg-card-200 z-10 overflow-hidden">
                <div
                  className={`h-1 rounded-full bg-secondary-400`}
                  style={{
                    width: `${(currentSaving / targetAmount) * 100 > 100 ? 100 : (currentSaving / targetAmount) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="font-nunitosans font-medium text-caption text-right ">
                {(currentSaving / targetAmount) * 100 > 100
                  ? 100
                  : (currentSaving / targetAmount) * 100}
                % Completed
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
