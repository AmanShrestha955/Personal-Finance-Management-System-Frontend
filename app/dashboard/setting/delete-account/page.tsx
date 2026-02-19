"use client";
import Input from "@/component/Input";
import { deleteUser } from "@/utils/userApi";
import { useMutation } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Trash2 } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

// interface Props {}

const Page: NextPage = ({}) => {
  const router = useRouter();
  // const [isDisable, setIsDisable] = useState(true);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ confirmText: string }>({
    defaultValues: { confirmText: "" },
  });
  const confirmText = watch("confirmText");
  const isDisable = confirmText !== "DELETE";
  const {
    mutate: deleteAccount,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      router.replace("/");
    },
  });

  const onSubmit = () => {
    deleteAccount();
  };
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl ">
      <div className="flex flex-row gap-md items-center">
        <button
          onClick={() => {
            router.back();
          }}
          className="size-[40px] rounded-lg bg-card-100 shadow-effect-2 flex justify-center items-center cursor-pointer hover:bg-card-200 active:bg-card-300 transition-all duration-200"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-nunitosans text-body font-bold">Delete Account</h1>
      </div>
      <div className="p-sm rounded-xl bg-red-100 border border-red-300 shadow-effect-2 flex flex-col gap-xxs font-nunitosans text-body text-red-900 ">
        <div className="flex flex-row gap-md items-center ">
          <AlertTriangle size={16} />
          <p className="font-bold">Warning:</p>
        </div>
        <p className="pl-xl">
          This action is permanent and cannot be undone. All your data,
          including transaction history, budgets, and preferences will be
          permanently deleted.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2xl p-xl bg-card-100 shadow-effect-2 rounded-xl font-nunitosans"
      >
        <div className="flex flex-row gap-md items-center">
          <div className="size-[40px] flex justify-center items-center bg-red-600 text-text-100 rounded-lg">
            <Trash2 size={18} />
          </div>
          <h1 className="font-medium text-text-1000 text-body">
            Account Deletion
          </h1>
        </div>
        <div className="p-md rounded-lg bg-card-200 flex flex-col gap-sm font-nunitosans text-body text-text-700">
          <h1 className="text-[18px] font-semibold">
            Before you go, please note:
          </h1>
          <ul className="list-disc list-inside space-y-2 marker:text-text-500">
            <li>All your financial data will be permanently deleted</li>
            <li>
              You will lose access to all linked accounts and integrations
            </li>
            <li>This action cannot be reversed</li>
            <li>
              You can create a new account anytime, but your data will not be
              restored
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-lg">
          <div className="flex flex-col gap-xs">
            <p className="text-text-1000 text-body">
              Type <b>DELETE </b>
              to confirm
            </p>
            <Input
              type="text"
              placeholder="Type DELETE in capital letters"
              {...register("confirmText", {
                validate: (value) =>
                  value === "DELETE" || "Please type DELETE to confirm",
              })}
            />
            {errors.confirmText && (
              <p className="text-red-500 text-sm">
                {errors.confirmText.message}
              </p>
            )}
          </div>
          {isError && (
            <p className="text-red-600 text-sm">
              {(error as Error)?.message ??
                "Something went wrong. Please try again."}
            </p>
          )}
        </div>
        <div className="flex flex-row justify-end font-nunitosans text-body text-text-100 gap-md">
          <button className="px-xl py-xs rounded-lg bg-card-100 hover:bg-card-200 active:bg-card-300 cursor-pointer transition-all duration-200 border border-card-200 text-text-1000">
            Cancel
          </button>
          <button
            disabled={isDisable || isPending}
            className={`px-xl py-xs rounded-lg ${isDisable || isPending ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700 active:bg-red-800"} bg-red-600  cursor-pointer transition-all duration-200`}
          >
            {isPending ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
