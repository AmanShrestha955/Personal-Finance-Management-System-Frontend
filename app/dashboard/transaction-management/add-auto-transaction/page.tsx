"use client";
import DropDown from "@/component/DropDown";
import Input from "@/component/Input";
import { BackendErrorResponse } from "@/types/type";
import {
  createRecurringTransaction,
  updateRecurringTransaction,
  getRecurringTransactionById,
  CreateRecurringTransactionPayload,
  UpdateRecurringTransactionPayload,
} from "@/utils/recurringTransctionApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { categoryWithIcon } from "@/utils/category";
import { OthersIcon } from "@/component/icons/CategoryIcons";

type RecurringTransactionFormData = {
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  paymentMethod: string;
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate?: string;
  description?: string;
};

const Page: NextPage = () => {
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const isEditMode = !!transactionId;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecurringTransactionFormData>({
    defaultValues: {
      title: "",
      type: "expense",
      amount: 0,
      category: "",
      paymentMethod: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      description: "",
    },
  });

  const { data: transactionData, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["recurring-transaction", transactionId],
    queryFn: () => getRecurringTransactionById(transactionId!),
    enabled: isEditMode,
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: RecurringTransactionFormData) => {
      const payload: CreateRecurringTransactionPayload = {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        paymentMethod:
          data.paymentMethod as CreateRecurringTransactionPayload["paymentMethod"],
        frequency: data.frequency,
        startDate: data.startDate,
        description: data.description,
        endDate: data.endDate || undefined,
      };
      return await createRecurringTransaction(payload);
    },
    onSuccess: () => {
      navigation.push("/dashboard/transaction-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: RecurringTransactionFormData) => {
      const payload: UpdateRecurringTransactionPayload = {
        title: data.title,
        amount: data.amount,
        type: data.type,
        category: data.category,
        paymentMethod:
          data.paymentMethod as UpdateRecurringTransactionPayload["paymentMethod"],
        frequency: data.frequency,
        startDate: data.startDate,
        endDate: data.endDate || null,
        description: data.description,
      };
      return await updateRecurringTransaction(transactionId!, payload);
    },
    onSuccess: () => {
      navigation.push("/dashboard/transaction-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
    },
  });

  const categoryOptions = categoryWithIcon;
  const defaultCategorySelectedOption: {
    text: string;
    icon: React.ComponentType;
  } = {
    text: "Select Category",
    icon: OthersIcon,
  };
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const selectedCategory =
    categoryOptions.find((opt) => opt.text === watch("category")) ??
    defaultCategorySelectedOption;

  const paymentOptions = [
    { text: "Cash" },
    { text: "Credit Card" },
    { text: "Debit Card" },
    { text: "e-Wallet" },
  ];
  const defaultPaymentSelectedOption = { text: "Select Payment Method" };
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const selectedPaymentMethod =
    paymentOptions.find((opt) => opt.text === watch("paymentMethod")) ??
    defaultPaymentSelectedOption;

  const frequencyOptions = [
    { text: "daily" },
    { text: "weekly" },
    { text: "monthly" },
    { text: "yearly" },
  ];
  const defaultFrequencyOption = { text: "Select Frequency" };
  const [isFrequencyDropdownOpen, setIsFrequencyDropdownOpen] = useState(false);
  const selectedFrequency =
    frequencyOptions.find((opt) => opt.text === watch("frequency")) ??
    defaultFrequencyOption;

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (transactionData && isEditMode) {
      reset({
        title: transactionData.title,
        type: transactionData.type,
        amount: transactionData.amount,
        category: transactionData.category,
        paymentMethod: transactionData.paymentMethod,
        frequency: transactionData.frequency,
        startDate: transactionData.startDate.split("T")[0],
        endDate: transactionData.endDate
          ? transactionData.endDate.split("T")[0]
          : "",
        description: transactionData.description || "",
      });
    }
  }, [transactionData?._id]);

  const onSubmit = (data: RecurringTransactionFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEditMode && isLoadingTransaction) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="font-nunitosans text-body">Loading transaction...</p>
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
          Transaction Details
        </h1>

        <p className="font-nunitosans text-body text-red-700 font-bold">
          {errorMessage}
        </p>

        {/* Basic Details */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Basic Details
          </h3>

          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Title
            </p>
            <Input
              placeholder="eg: Monthly Rent"
              type="text"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className="flex flex-row gap-md">
            {/* Transaction Type */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Transaction Type
              </p>
              <div className="flex flex-row p-xxs bg-card-200 rounded-sm">
                <div className="flex-1 min-w-36 max-w-full">
                  <input
                    type="radio"
                    value="expense"
                    id="expenses"
                    className="hidden peer"
                    {...register("type")}
                  />
                  <label
                    htmlFor="expenses"
                    className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
                  >
                    Expenses
                  </label>
                </div>
                <div className="flex-1 min-w-36 max-w-full">
                  <input
                    type="radio"
                    value="income"
                    id="income"
                    className="hidden peer"
                    {...register("type")}
                  />
                  <label
                    htmlFor="income"
                    className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
                  >
                    Income
                  </label>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Amount
              </p>
              <Input
                placeholder="0.00"
                type="number"
                prefix="Rs"
                {...register("amount", {
                  required: "Amount is required",
                  min: {
                    value: 0.01,
                    message: "Amount must be greater than 0",
                  },
                })}
              />
              {errors.amount && (
                <span className="text-red-500 text-sm">
                  {errors.amount.message}
                </span>
              )}
            </div>
          </div>

          {/* Frequency */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Frequency
            </p>
            <Controller
              name="frequency"
              control={control}
              rules={{ required: "Frequency is required" }}
              render={({ field }) => (
                <DropDown
                  options={frequencyOptions}
                  selectedOption={selectedFrequency}
                  onSelect={(option) => {
                    setIsFrequencyDropdownOpen(false);
                    field.onChange(option.text);
                  }}
                  isOpen={isFrequencyDropdownOpen}
                  onToggle={() =>
                    setIsFrequencyDropdownOpen(!isFrequencyDropdownOpen)
                  }
                />
              )}
            />
            {errors.frequency && (
              <span className="text-red-500 text-sm">
                {errors.frequency.message}
              </span>
            )}
          </div>

          {/* Start & End Date */}
          <div className="flex flex-row gap-md">
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Start Date
              </p>
              <Input
                placeholder=""
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
              />
              {errors.startDate && (
                <span className="text-red-500 text-sm">
                  {errors.startDate.message}
                </span>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                End Date{" "}
                <span className="text-text-500 font-normal">(optional)</span>
              </p>
              <Input placeholder="" type="date" {...register("endDate")} />
            </div>
          </div>
        </div>

        {/* Categorization */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Categorization
          </h3>
          <div className="flex flex-row gap-md">
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

            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Payment Method
              </p>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Payment Method is required" }}
                render={({ field }) => (
                  <DropDown
                    options={paymentOptions}
                    selectedOption={selectedPaymentMethod}
                    onSelect={(option) => {
                      setIsPaymentDropdownOpen(false);
                      field.onChange(option.text);
                    }}
                    isOpen={isPaymentDropdownOpen}
                    onToggle={() =>
                      setIsPaymentDropdownOpen(!isPaymentDropdownOpen)
                    }
                  />
                )}
              />
              {errors.paymentMethod && (
                <span className="text-red-500 text-sm">
                  {errors.paymentMethod.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-medium">
              Description
            </p>
            <Input
              placeholder="What was this transaction for?"
              type="text"
              {...register("description")}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isSubmitting}
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Transaction"
                : "Save Transaction"}
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
            Transaction Summary
          </h4>
          <p className="font-nunitosans text-text-1000">
            This is a <b>recurring transaction</b> that will automatically
            repeat based on the selected frequency.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
