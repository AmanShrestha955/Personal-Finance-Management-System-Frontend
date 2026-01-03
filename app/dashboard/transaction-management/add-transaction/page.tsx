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

const Page: NextPage = () => {
  const navigation = useRouter();
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
  } = useForm<TransactionFormData>({
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
  const amount = watch("amount");
  const type = watch("type");

  // Fetch transaction data if in edit mode
  const { data: transactionData, isLoading: isLoadingTransaction } = useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: () =>
      getData<null, { data: TransactionFormData & { _id: string } }>(
        `/transactions/${transactionId}`
      ),
    enabled: isEditMode,
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      return await postData<TransactionFormData, TransactionFormResponseData>(
        "/transactions/",
        data
      );
    },
    onSuccess: (data) => {
      console.log("sucessfully send form data: ", data);
      navigation.push("/dashboard/transaction-management");
    },

    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      setErrorMessage(message);
      console.log("error in form data post: ", message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      return await putData<TransactionFormData, TransactionFormResponseData>(
        `/transactions/${transactionId}`,
        data
      );
    },
    onSuccess: (data) => {
      console.log("Successfully updated transaction: ", data);
      navigation.push("/dashboard/transaction-management");
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
    defaultCategorySelectedOption
  );

  const paymentOptions = [
    { text: "Cash" },
    { text: "Credit Card" },
    { text: "Debit Card" },
    { text: "e-Wallet" },
  ];
  const defaultPaymentSelectedOption = { text: "Select Payment Method" };
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultPaymentSelectedOption
  );

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const recentTags = ["recenttag1", "recenttag2", "recenttag3", "recenttag4"];

  const selectTagFun = (tag: string) => {
    if (selectedTags.includes(tag)) {
      return;
    }
    const newTags = [...selectedTags, tag];
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const removeTagFun = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  const { data: accountData } = useQuery({
    queryKey: ["account"],
    queryFn: () => getData<null, AccountResponseData>("/accounts"),
  });

  const { data: budgetData } = useQuery({
    queryKey: ["budget"],
    queryFn: () => getData<null, AllBudgetResponseData>("/budgets"),
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [afterTransactionBalance, setAfterTransactionBalance] = useState(
    (accountData?.data[0].balance as number) || 0
  );
  const [selectedBudget, setSelectedBudget] = useState<
    undefined | BudgetData
  >();

  // Populate form when editing
  useEffect(() => {
    if (transactionData && isEditMode) {
      reset({
        title: transactionData.title,
        type: transactionData.type,
        amount: transactionData.amount,
        transactionDate: new Date(transactionData.transactionDate)
          .toISOString()
          .split("T")[0],
        category: transactionData.category,
        paymentMethod: transactionData.paymentMethod,
        description: transactionData.description || "",
        tags: transactionData.tags || [],
        note: transactionData.note || "",
      });

      // Update selected category
      const category = categoryOptions.find(
        (opt) => opt.text === transactionData.category
      );
      if (category) setSelectedCategory(category);

      // Update selected payment method
      const payment = paymentOptions.find(
        (opt) => opt.text === transactionData.paymentMethod
      );
      if (payment) setSelectedPaymentMethod(payment);

      // Update selected tags
      if (transactionData.tags) setSelectedTags(transactionData.tags);
    }
  }, [transactionData, isEditMode, reset]);

  const onSubmit = (data: TransactionFormData) => {
    data.transactionDate = new Date(data.transactionDate).toISOString();
    console.log(data);

    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };
  useEffect(() => {
    // Check if budgetData exists and has the selected category
    setSelectedBudget(
      budgetData?.data?.find(
        (budget) => budget.category === selectedCategory.text
      )
    );
    console.log(
      budgetData?.data?.find(
        (budget) => budget.category === selectedCategory.text
      )
    );
  }, [budgetData?.data, selectedCategory]);

  useEffect(() => {
    console.log(accountData);
    setAfterTransactionBalance(accountData?.data[0].balance as number);
  }, [accountData]);

  useEffect(() => {
    console.log(accountData?.data[0].balance);
    const baseBalance = (accountData?.data[0].balance as number) || 0;
    const amountValue = parseFloat(amount.toString()) || 0; // ADD || 0 here

    if (type === "expense") {
      setAfterTransactionBalance(baseBalance - amountValue);
    } else {
      setAfterTransactionBalance(baseBalance + amountValue);
    }
  }, [accountData?.data, amount, type]);

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

        {/* basic details */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Basic Details
          </h3>
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Title
            </p>
            <Input
              placeholder="eg: Food with Family"
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
            {/* transaction type */}
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
                    // defaultChecked
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

            {/* amount */}
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
              {...register("transactionDate", { required: "Date is required" })}
            />
            {errors.transactionDate && (
              <span className="text-red-500 text-sm">
                {errors.transactionDate.message}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Categorization
          </h3>
          <div className="flex flex-row gap-md">
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
                      setSelectedPaymentMethod(option);
                      setIsPaymentDropdownOpen(false);
                      field.onChange(option.text); // You'll need to change this to actual account ID
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

        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Optional Details
          </h3>
          <div className="flex flex-row gap-md">
            {/* tags */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Tags
              </p>
              <div className="flex flex-row flex-wrap gap-md">
                {selectedTags.map((tag, index) => (
                  <Tag
                    text={tag}
                    isSelected={true}
                    key={index}
                    removeTag={() => removeTagFun(tag)}
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
                      const newTags = [...selectedTags, newTag];
                      setSelectedTags(newTags);
                      setValue("tags", newTags);
                      input.value = "";
                    }
                  }
                }}
              />
            </div>

            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Receipt
              </p>
              <input
                type="file"
                id="receipt-upload"
                accept="image/*"
                className="hidden"
                {...register("receipt")}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Create preview
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setReceiptPreview(reader.result as string);
                    };
                    reader.readAsDataURL(file);

                    // Update form value
                    setValue("receipt", e.target.files);
                  }
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

          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Recent Tags
            </p>
            <div className="flex flex-row flex-wrap gap-md">
              {recentTags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  isSelected={false}
                  selectTag={() => selectTagFun(tag)}
                />
              ))}
            </div>
          </div>

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
            After this transaction:{" "}
            <b>Balance = Rs {afterTransactionBalance}</b>
          </p>
        </div>
        {selectedBudget && type === "expense" ? (
          <div
            className={`flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border ${
              (selectedBudget.spentAmount / selectedBudget.budgetAmount) * 100 <
              selectedBudget.alertThreshold
                ? "border-green-400 bg-green-200 text-green-600"
                : (selectedBudget.spentAmount / selectedBudget.budgetAmount) *
                    100 <
                  100
                ? "border-yellow-400 bg-yellow-200 text-yellow-600"
                : "border-red-400 bg-red-200 text-red-600"
            }`}
          >
            <h4 className="font-nunitosans font-bold  text-heading3">
              Budget Status
            </h4>
            <div className="flex flex-col gap-xxs">
              <p className="font-nunitosans font-normal ">
                You&apos;ve spent Rs {selectedBudget?.spentAmount} of your Rs{" "}
                {selectedBudget?.budgetAmount} Food budget.
              </p>
              <p className="font-nunitosans font-bold ">
                Remaining: Rs{" "}
                {(selectedBudget?.budgetAmount ?? 0) -
                  (selectedBudget?.spentAmount ?? 0)}
                .
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
