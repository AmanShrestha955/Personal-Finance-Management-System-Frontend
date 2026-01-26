"use client";
import DropDown from "@/component/DropDown";
import Input from "@/component/Input";
import { BackendErrorResponse, BudgetFormResponseData } from "@/types/type";
import { getData, postData, putData } from "@/utils/request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type BudgetFormData = {
  category: string;
  budgetAmount: number;
  alertThreshold: number;
};

type BudgetDetail = {
  _id: string;
  userId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  alertThreshold: number;
  month: Date;
  isActive: boolean;
};

type BudgetDetailResponse = {
  message: string;
  data: BudgetDetail;
};

type TotalSpendData = {
  startDate: string;
  endDate: string;
  totalSpend: number;
  transactionCount: number;
  category?: string;
};

type TotalSpendResponseData = {
  message: string;
  data: TotalSpendData;
};

const Page: NextPage = ({}) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [spendingPercentage, setSpendingPercentage] = useState<number>(0);
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("id");
  const isEditMode = !!budgetId;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    defaultValues: {
      category: "",
      budgetAmount: 0,
      alertThreshold: 70,
    },
  });

  const budgetAmt = watch("budgetAmount");
  const category = watch("category");

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
    defaultCategorySelectedOption
  );

  // Fetch existing budget data if in edit mode
  const { data: existingBudget, isLoading: isLoadingBudget } = useQuery({
    queryKey: ["budget", budgetId],
    queryFn: () => getData<null, BudgetDetailResponse>(`/budgets/${budgetId}`),
    enabled: isEditMode,
    select: (response) => response.data,
  });

  // Populate form when existing budget data is loaded
  useEffect(() => {
    if (existingBudget) {
      const categoryOption =
        categoryOptions.find(
          (opt) =>
            opt.text.toLowerCase() === existingBudget.category.toLowerCase()
        ) || defaultCategorySelectedOption;

      setSelectedCategory(categoryOption);

      reset({
        category: existingBudget.category,
        budgetAmount: existingBudget.budgetAmount,
        alertThreshold: existingBudget.alertThreshold,
      });
    }
  }, [existingBudget, reset]);

  // Mutation for creating or updating budget
  const mutation = useMutation({
    mutationFn: async (data: BudgetFormData) => {
      if (isEditMode) {
        return await putData<BudgetFormData, BudgetFormResponseData>(
          `/budgets/${budgetId}`,
          data
        );
      } else {
        return await postData<BudgetFormData, BudgetFormResponseData>(
          "/budgets/",
          data
        );
      }
    },
    onSuccess: (data) => {
      console.log("Successfully saved budget data: ", data);
      navigation.push("/dashboard/transaction-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
      console.log("Error in form data post: ", message);
    },
  });

  // Move date calculations inside useMemo
  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  }, []);

  const { data: totalSpendingData, isLoading: isLoadingTotalSpendingData } =
    useQuery({
      queryKey: ["total-spend", category],
      queryFn: () =>
        getData<null, TotalSpendResponseData>(
          `/transactions/analytics/total-spend?startDate=${startDate}&endDate=${endDate}${
            category ? "&category=" + category : ""
          }`
        ),
      enabled: !!category,
      select: (data) => {
        console.log("total spend data: ", data);
        return data.data;
      },
    });

  useEffect(() => {
    const totalSpend = totalSpendingData?.totalSpend ?? 0;
    const percentage =
      budgetAmt > 0 ? Math.min((totalSpend / budgetAmt) * 100, 100) : 0;

    setSpendingPercentage(percentage);
  }, [totalSpendingData?.totalSpend, budgetAmt]);

  const onSubmit = (data: BudgetFormData) => {
    console.log(data);
    mutation.mutate(data);
  };

  if (isEditMode && isLoadingBudget) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-heading3">Loading budget data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-lg"
      >
        <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[130%]">
          {isEditMode ? "Edit Budget Alert" : "Budget Alert"}
        </h1>

        <p className="font-nunitosans text-body text-red-700 font-bold">
          {errorMessage}
        </p>

        {/* category */}
        <div className="flex flex-col gap-lg">
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
          {/* budget limit */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Budget Limit
            </p>
            <Input
              placeholder="0.00"
              type="number"
              prefix="Rs"
              {...register("budgetAmount", {
                required: "Amount is required",
                min: {
                  value: 0.01,
                  message: "Budget amount must be greater than 0",
                },
              })}
            />
            {errors.budgetAmount && (
              <span className="text-red-500 text-sm">
                {errors.budgetAmount.message}
              </span>
            )}
          </div>
          {/* alert Threshold */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Alert Threshold ( % )
            </p>
            <Input
              placeholder="0"
              type="number"
              prefix="%"
              {...register("alertThreshold", {
                max: {
                  value: 100,
                  message: "Alert Threshold can't be greater than 100.",
                },
                min: {
                  value: 0,
                  message: "Alert Threshold can't be negative.",
                },
              })}
            />
            {errors.alertThreshold && (
              <span className="text-red-500 text-sm">
                {errors.alertThreshold.message}
              </span>
            )}
            <p className="font-semibold font-nunitosans text-text-700 text-body leading-[130%]">
              Receive an alert when you&apos;ve spent this percentage of your
              budget
            </p>
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
              ? "Update Budget"
              : "Save Budget"}
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
        {/* important note */}
        <div className="flex flex-col gap-md px-lg py-2xl bg-card-200 rounded-md max-w-[445px] shadow-effect-2">
          <h1 className="font-nunitosans font-bold text-heading3 text-text-1000">
            Important Note
          </h1>
          <p className="font-nunitosans text-body text-text-1000 leading-[110%]">
            {isEditMode
              ? "When you update your budget alert, the changes will apply immediately. Your spending history will remain the same, but future transactions will be tracked against the new limits you set."
              : "Once activated, your budget alert will begin tracking expenses from the current month. Any spending prior to activation will not be included in the initial calculation, but future transactions will be monitored against your set limits. You'll receive real-time updates to help you stay on track."}
          </p>
        </div>
        {/* preview */}
        {category && (
          <div className="bg-card-100 flex flex-col rounded-md px-md py-lg gap-md shadow-effect-2 font-nunitosans">
            <h1 className="font-bold text-heading3 leading-[100%]">
              Remaining Budget Preview
            </h1>
            <p className="font-medium text-body leading-[100%] ">
              You&apos;ve spent <b>Rs {totalSpendingData?.totalSpend}</b> out of{" "}
              <b>Rs {budgetAmt}</b> for <b>{selectedCategory.text}</b>
            </p>
            <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
              <div
                className={`h-1 rounded-full bg-secondary-400`}
                style={{
                  width: `${spendingPercentage}%`,
                }}
              ></div>
            </div>
            <p className="text-caption text-text-700 font-medium leading-[100%] text-right">
              {spendingPercentage.toFixed(1)}% Spent
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
