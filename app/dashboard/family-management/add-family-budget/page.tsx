"use client";
import DropDown from "@/component/DropDown";
import { OthersIcon } from "@/component/icons/CategoryIcons";
import Input from "@/component/Input";
import { useNotification } from "@/hooks/NotificationContext";
import { BackendErrorResponse } from "@/types/type";
import { categoryWithIcon } from "@/utils/category";
import { getMyFamily, Family } from "@/utils/familyApi";
import {
  createFamilyBudget,
  updateFamilyBudget,
  getFamilyBudgetById,
  FamilyBudget,
} from "@/utils/familyBudgetApi";
import { getFamilyTransactions as fetchFamilyTxns } from "@/utils/familyTransactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

const Page: NextPage = () => {
  const { addNotification } = useNotification();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const budgetId = searchParams.get("id");
  const isEditMode = !!budgetId;

  const [spendingPercentage, setSpendingPercentage] = useState<number>(0);

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

  // ─── Category dropdown ─────────────────────────────────────────────────────
  const categoryOptions = categoryWithIcon;
  const defaultCategory = { text: "Select Category", icon: OthersIcon };
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{ text: string; icon: React.ComponentType }>(defaultCategory);

  // ─── Fetch family ──────────────────────────────────────────────────────────
  const { data: family } = useQuery<Family, AxiosError>({
    queryKey: ["family"],
    queryFn: getMyFamily,
    retry: false,
  });

  // ─── Fetch existing budget (edit mode) ────────────────────────────────────
  const { data: existingBudget, isLoading: isLoadingBudget } =
    useQuery<FamilyBudget>({
      queryKey: ["familyBudget", budgetId],
      queryFn: () => getFamilyBudgetById(family!._id, budgetId!),
      enabled: isEditMode && !!family?._id,
      retry: false,
    });

  // ─── Populate form in edit mode ────────────────────────────────────────────
  useEffect(() => {
    if (!existingBudget) return;
    const cat =
      categoryOptions.find(
        (o) => o.text.toLowerCase() === existingBudget.category.toLowerCase(),
      ) ?? defaultCategory;
    setSelectedCategory(cat);
    reset({
      category: existingBudget.category,
      budgetAmount: existingBudget.budgetAmount,
      alertThreshold: existingBudget.alertThreshold,
    });
  }, [existingBudget]);

  // ─── Family transactions — used for spend preview bar ─────────────────────
  // We derive category spend from the transactions we already have cached,
  // avoiding an extra analytics endpoint that doesn't exist on the family API.
  const { data: transactions = [] } = useQuery({
    queryKey: ["familyTransactions", family?._id],
    queryFn: () => fetchFamilyTxns(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // Current month spend for the selected category
  const categorySpend = useMemo(() => {
    if (!category) return 0;
    const now = new Date();
    return transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          t.category === category &&
          new Date(t.transactionDate).getMonth() === now.getMonth() &&
          new Date(t.transactionDate).getFullYear() === now.getFullYear(),
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions, category]);

  // Update preview percentage whenever spend or budget amount changes
  useEffect(() => {
    const pct =
      budgetAmt > 0 ? Math.min((categorySpend / Number(budgetAmt)) * 100, 100) : 0;
    setSpendingPercentage(pct);
  }, [categorySpend, budgetAmt]);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (data: BudgetFormData) =>
      createFamilyBudget(family!._id, {
        category: data.category,
        budgetAmount: Number(data.budgetAmount),
        alertThreshold: Number(data.alertThreshold),
      }),
    onSuccess: () => {
      addNotification("success", "Created Budget Alert", "Family budget created successfully.");
      queryClient.invalidateQueries({ queryKey: ["familyBudgetSummary"] });
      router.push("/dashboard/family-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message =
        error?.response?.data?.message ?? "An error occurred while saving the budget.";
      addNotification("error", "Error", message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: BudgetFormData) =>
      updateFamilyBudget(family!._id, budgetId!, {
        category: data.category,
        budgetAmount: Number(data.budgetAmount),
        alertThreshold: Number(data.alertThreshold),
      }),
    onSuccess: () => {
      addNotification("success", "Updated Budget Alert", "Family budget updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["familyBudgetSummary"] });
      queryClient.invalidateQueries({ queryKey: ["familyBudget", budgetId] });
      router.push("/dashboard/family-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message =
        error?.response?.data?.message ?? "An error occurred while updating the budget.";
      addNotification("error", "Error", message);
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    if (!family?._id) {
      addNotification("error", "Error", "No family found.");
      return;
    }
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // ─── Guards ────────────────────────────────────────────────────────────────
  if (isEditMode && isLoadingBudget) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-heading3">Loading budget data...</p>
      </div>
    );
  }

  const isBusy =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-lg"
      >
        <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[130%]">
          {isEditMode ? "Edit Family Budget Alert" : "Family Budget Alert"}
        </h1>

        <div className="flex flex-col gap-lg">
          {/* Category */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Category
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
                    setIsCategoryOpen(false);
                    field.onChange(option.text);
                  }}
                  isOpen={isCategoryOpen}
                  onToggle={() => setIsCategoryOpen(!isCategoryOpen)}
                />
              )}
            />
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Budget Limit */}
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

          {/* Alert Threshold */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Alert Threshold ( % )
            </p>
            <Input
              placeholder="70"
              type="number"
              prefix="%"
              {...register("alertThreshold", {
                max: { value: 100, message: "Alert threshold can't exceed 100." },
                min: { value: 0, message: "Alert threshold can't be negative." },
              })}
            />
            {errors.alertThreshold && (
              <span className="text-red-500 text-sm">
                {errors.alertThreshold.message}
              </span>
            )}
            <p className="font-semibold font-nunitosans text-text-700 text-body leading-[130%]">
              Receive an alert when the family has spent this percentage of the
              budget
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isBusy}
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isBusy
              ? "Saving..."
              : isEditMode
                ? "Update Budget"
                : "Save Budget"}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => router.push("/dashboard/family-management")}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* ── Sidebar ── */}
      <div className="flex flex-col gap-md">
        {/* Important Note */}
        <div className="flex flex-col gap-md px-lg py-2xl bg-card-200 rounded-md max-w-[445px] shadow-effect-2">
          <h1 className="font-nunitosans font-bold text-heading3 text-text-1000">
            Important Note
          </h1>
          <p className="font-nunitosans text-body text-text-1000 leading-[110%]">
            {isEditMode
              ? "Updating this budget will apply the new limits immediately across all family members. Existing spending history is unchanged — only future tracking is affected."
              : "Once activated, this family budget will track expenses from the current month across all members. Spending logged before activation won't count toward the initial total, but all future family transactions in this category will be monitored against your limit."}
          </p>
        </div>

        {/* Spend Preview — derived from cached family transactions */}
        {category && (
          <div className="bg-card-100 flex flex-col rounded-md px-md py-lg gap-md shadow-effect-2 font-nunitosans">
            <h1 className="font-bold text-heading3 leading-[100%]">
              Remaining Budget Preview
            </h1>
            <p className="font-medium text-body leading-[100%]">
              Family has spent <b>Rs {categorySpend}</b> out of{" "}
              <b>Rs {budgetAmt}</b> for <b>{selectedCategory.text}</b> this
              month
            </p>
            <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  spendingPercentage >= 100
                    ? "bg-red-500"
                    : spendingPercentage >= Number(watch("alertThreshold"))
                      ? "bg-yellow-500"
                      : "bg-secondary-400"
                }`}
                style={{ width: `${spendingPercentage}%` }}
              />
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