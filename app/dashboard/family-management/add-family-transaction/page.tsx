"use client";
import DropDown from "@/component/DropDown";
import TagIcon from "@/component/icons/tag";
import Input from "@/component/Input";
import Tag from "@/component/Tag";
import { BackendErrorResponse } from "@/types/type";
import { getMyFamily, Family } from "@/utils/familyApi";
import {
  createFamilyTransaction,
  updateFamilyTransaction,
  getFamilyTransactionById,
  CreateFamilyTransactionPayload,
  FamilyTransaction,
} from "@/utils/familyTransactionApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { categoryWithIcon } from "@/utils/category";
import { OthersIcon } from "@/component/icons/CategoryIcons";
import { useNotification } from "@/hooks/NotificationContext";

type FamilyTransactionFormData = {
  title: string;
  type: "income" | "expense";
  amount: number;
  transactionDate: string;
  category: string;
  paymentMethod: string;
  description: string;
  tags: string[];
  receipt: File | string | null;
  note: string;
};

const Page: NextPage = () => {
  const { addNotification } = useNotification();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("id");
  const isEditMode = !!transactionId;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FamilyTransactionFormData>({
    defaultValues: {
      title: "",
      type: "expense",
      amount: 0,
      transactionDate: new Date().toISOString().split("T")[0],
      category: "",
      paymentMethod: "",
      description: "",
      tags: [],
      receipt: null,
      note: "",
    },
  });

  const type = watch("type");

  // ─── Fetch family ──────────────────────────────────────────────────────────
  const { data: family } = useQuery<Family, AxiosError>({
    queryKey: ["family"],
    queryFn: getMyFamily,
    retry: false,
  });

  // ─── Fetch existing transaction (edit mode) ────────────────────────────────
  const { data: transactionData, isLoading: isLoadingTransaction } =
    useQuery<FamilyTransaction>({
      queryKey: ["familyTransaction", transactionId],
      queryFn: () => getFamilyTransactionById(family!._id, transactionId!),
      enabled: isEditMode && !!family?._id,
      retry: false,
    });

  // ─── Dropdowns ─────────────────────────────────────────────────────────────
  const categoryOptions = categoryWithIcon;
  const defaultCategory = {
    text: "Select Category",
    icon: OthersIcon,
  };
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categoryOptions)[0]>(defaultCategory as (typeof categoryOptions)[0]);

  const paymentOptions = [
    { text: "Cash" },
    { text: "Credit Card" },
    { text: "Debit Card" },
    { text: "e-Wallet" },
  ];
  const defaultPayment = { text: "Select Payment Method" };
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(defaultPayment);

  // ─── Tags & Receipt ────────────────────────────────────────────────────────
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const recentTags = ["groceries", "bills", "travel", "utilities"];

  const selectTag = (tag: string) => {
    if (selectedTags.includes(tag)) return;
    const next = [...selectedTags, tag];
    setSelectedTags(next);
    setValue("tags", next);
  };

  const removeTag = (tag: string) => {
    const next = selectedTags.filter((t) => t !== tag);
    setSelectedTags(next);
    setValue("tags", next);
  };

  // ─── Populate form in edit mode ────────────────────────────────────────────
  useEffect(() => {
    if (!transactionData || !isEditMode) return;
    reset({
      title: transactionData.title,
      type: transactionData.type,
      amount: transactionData.amount,
      transactionDate: new Date(transactionData.transactionDate)
        .toISOString()
        .split("T")[0],
      category: transactionData.category,
      paymentMethod: transactionData.paymentMethod,
      description: transactionData.description ?? "",
      tags: transactionData.tags ?? [],
      note: transactionData.note ?? "",
      receipt: transactionData.receipt ?? null,
    });

    if (transactionData.receipt) {
      setReceiptPreview(
        `${process.env.NEXT_PUBLIC_API_URL}/${transactionData.receipt}`,
      );
    }

    const cat = categoryOptions.find(
      (o) => o.text === transactionData.category,
    );
    if (cat) setSelectedCategory(cat);

    const pay = paymentOptions.find(
      (o) => o.text === transactionData.paymentMethod,
    );
    if (pay) setSelectedPayment(pay);

    if (transactionData.tags) setSelectedTags(transactionData.tags);
  }, [transactionData, isEditMode]);

  // ─── Mutations ─────────────────────────────────────────────────────────────
  const createMutation = useMutation({
    mutationFn: (payload: CreateFamilyTransactionPayload) =>
      createFamilyTransaction(family!._id, payload),
    onSuccess: (data) => {
      if (data.warning && data.warningStatus) {
        addNotification(data.warningStatus, "Budget Alert", data.warning);
      }
      addNotification(data.messageStatus, "Transaction", data.message);
      queryClient.invalidateQueries({ queryKey: ["familyTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["familyTransactionSummary"] });
      router.push("/dashboard/family-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.message ?? error.message;
      addNotification("error", "Transaction Error", message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<CreateFamilyTransactionPayload>) =>
      updateFamilyTransaction(family!._id, transactionId!, payload),
    onSuccess: (data) => {
      if (data.warning && data.warningStatus) {
        addNotification(data.warningStatus, "Budget Alert", data.warning);
      }
      addNotification(data.messageStatus, "Transaction", data.message);
      queryClient.invalidateQueries({ queryKey: ["familyTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["familyTransactionSummary"] });
      router.push("/dashboard/family-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.message ?? error.message;
      addNotification("error", "Update Error", message);
    },
  });

  // ─── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = (data: FamilyTransactionFormData) => {
    if (!family?._id) {
      addNotification(
        "error",
        "Error",
        "No family found. Please create a family first.",
      );
      return;
    }

    const payload: CreateFamilyTransactionPayload = {
      title: data.title,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      paymentMethod: data.paymentMethod,
      transactionDate: new Date(data.transactionDate).toISOString(),
      description: data.description,
      note: data.note,
      tags: data.tags,
      receipt: data.receipt instanceof File ? data.receipt : undefined,
    };

    if (isEditMode) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  // ─── Guards ────────────────────────────────────────────────────────────────
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
          {isEditMode ? "Edit Family Transaction" : "Add Family Transaction"}
        </h1>

        {/* ── Basic Details ── */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Basic Details
          </h3>

          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Title
            </p>
            <Input
              placeholder="eg: Grocery Shopping"
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
                    id="expense"
                    className="hidden peer"
                    {...register("type")}
                  />
                  <label
                    htmlFor="expense"
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

          {/* Date */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Date
            </p>
            <Input
              placeholder=""
              type="date"
              {...register("transactionDate", {
                required: "Date is required",
                validate: (v) =>
                  v <= new Date().toISOString().split("T")[0] ||
                  "Date cannot be in the future",
              })}
            />
            {errors.transactionDate && (
              <span className="text-red-500 text-sm">
                {errors.transactionDate.message}
              </span>
            )}
          </div>
        </div>

        {/* ── Categorization ── */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Categorization
          </h3>

          <div className="flex flex-row gap-md">
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

            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Payment Method
              </p>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: "Payment method is required" }}
                render={({ field }) => (
                  <DropDown
                    options={paymentOptions}
                    selectedOption={selectedPayment}
                    onSelect={(option) => {
                      setSelectedPayment(option);
                      setIsPaymentOpen(false);
                      field.onChange(option.text);
                    }}
                    isOpen={isPaymentOpen}
                    onToggle={() => setIsPaymentOpen(!isPaymentOpen)}
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

        {/* ── Optional Details ── */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Optional Details
          </h3>

          <div className="flex flex-row gap-md">
            {/* Tags */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Tags
              </p>
              <div className="flex flex-row flex-wrap gap-md">
                {selectedTags.map((tag, i) => (
                  <Tag
                    key={i}
                    text={tag}
                    isSelected
                    removeTag={() => removeTag(tag)}
                  />
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)"
                type="text"
                name="tagInput"
                prefix={<TagIcon className="text-text-500" />}
                suffix={<TagIcon className="text-text-1000" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newTag = input.value.trim();
                    if (newTag && !selectedTags.includes(newTag)) {
                      selectTag(newTag);
                      input.value = "";
                    }
                  }
                }}
              />
            </div>

            {/* Receipt */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Receipt
              </p>
              <input
                type="file"
                id="receipt-upload"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setReceiptPreview(reader.result as string);
                  reader.readAsDataURL(file);
                  setValue("receipt", file);
                }}
              />
              <label
                htmlFor="receipt-upload"
                className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150 cursor-pointer text-center"
              >
                Upload Receipt
              </label>
              {receiptPreview && (
                <div className="mt-xs relative">
                  <Image
                    width={100}
                    height={100}
                    src={receiptPreview}
                    alt="Receipt preview"
                    className="w-full h-32 object-cover rounded-sm border border-card-200"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setReceiptPreview(null);
                      setValue("receipt", null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Tags */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Recent Tags
            </p>
            <div className="flex flex-row flex-wrap gap-md">
              {recentTags.map((tag, i) => (
                <Tag
                  key={i}
                  text={tag}
                  isSelected={false}
                  selectTag={() => selectTag(tag)}
                />
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Notes
            </p>
            <textarea
              placeholder="Any additional notes?"
              rows={3}
              className="bg-card-100 p-xs rounded-sm border border-text-300"
              {...register("note")}
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending || updateMutation.isPending
              ? "Saving..."
              : isEditMode
                ? "Update Transaction"
                : "Save Transaction"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/family-management")}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* ── Sidebar Summary ── */}
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-md py-lg px-md w-[442px] min-w-[300px] rounded-md bg-card-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            Transaction Summary
          </h4>
          <p className="font-nunitosans text-text-1000 opacity-70 text-body">
            This transaction will be recorded under{" "}
            <b>{family?.name ?? "your family"}</b> and visible to all members.
          </p>
          {selectedCategory.text !== defaultCategory.text && (
            <div className="flex flex-row items-center gap-sm">
              <span className="font-nunitosans text-body text-text-1000 opacity-60">
                Category:
              </span>
              <span className="font-nunitosans font-bold text-body text-text-1000">
                {selectedCategory.text}
              </span>
            </div>
          )}
          <div className="flex flex-row items-center gap-sm">
            <span className="font-nunitosans text-body text-text-1000 opacity-60">
              Type:
            </span>
            <span
              className={`font-nunitosans font-bold text-body ${
                type === "expense" ? "text-red-500" : "text-green-500"
              }`}
            >
              {type === "expense" ? "Expense" : "Income"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
