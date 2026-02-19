"use client";
import Input from "@/component/Input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ArrowLeft, Lock, Shield } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { changePassword } from "@/utils/userApi";

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const Page: NextPage = ({}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    mutate: updatePassword,
    isPending,
    isError,
    isSuccess,
    error,
  } = useMutation({
    mutationFn: (data: ChangePasswordFormValues) =>
      changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      }),
    onSuccess: () => {
      reset();
    },
  });

  const onSubmit = (data: ChangePasswordFormValues) => {
    updatePassword(data);
  };

  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl">
      <div className="flex flex-row gap-md items-center">
        <button
          onClick={() => router.back()}
          className="size-[40px] rounded-lg bg-card-100 shadow-effect-2 flex justify-center items-center cursor-pointer hover:bg-card-200 active:bg-card-300 transition-all duration-200"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="font-nunitosans text-body font-bold">Edit Profile</h1>
      </div>

      <div className="flex flex-row gap-lg">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-2 flex flex-col gap-2xl p-xl bg-card-100 shadow-effect-2 rounded-xl font-nunitosans"
        >
          <div className="flex flex-row gap-md items-center">
            <div className="size-[40px] flex justify-center items-center bg-primary-500 text-text-100 rounded-lg">
              <Lock size={18} />
            </div>
            <h1 className="font-medium text-text-1000 text-body">
              Update Your Password
            </h1>
          </div>

          <div className="flex flex-col gap-lg">
            {/* Current Password */}
            <div className="flex flex-col gap-xs">
              <p className="text-text-1000 text-body">Current Password</p>
              <Input
                type="password"
                placeholder="Enter current password"
                {...register("oldPassword", {
                  required: "Current password is required",
                })}
              />
              {errors.oldPassword && (
                <p className="text-red-500 text-sm">
                  {errors.oldPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-xs">
              <p className="text-text-1000 text-body">New Password</p>
              <Input
                type="password"
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])/,
                    message:
                      "Must include uppercase, lowercase, number and symbol",
                  },
                })}
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-xs">
              <p className="text-text-1000 text-body">Confirm New Password</p>
              <Input
                type="password"
                placeholder="Re-enter new password"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("newPassword") || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* API error */}
            {isError && (
              <p className="text-red-600 text-sm">
                {(error as Error)?.message ??
                  "Something went wrong. Please try again."}
              </p>
            )}

            {/* Success */}
            {isSuccess && (
              <p className="text-green-600 text-sm">
                Password updated successfully!
              </p>
            )}

            <div className="flex flex-row justify-end font-nunitosans text-body text-text-100 gap-md">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-xl py-xs rounded-lg bg-card-100 hover:bg-card-200 active:bg-card-300 cursor-pointer transition-all duration-200 border border-card-200 text-text-1000"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isDirty || isPending}
                className={`px-xl py-xs rounded-lg ${
                  !isDirty || isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-primary-600 active:bg-primary-700 cursor-pointer"
                } bg-primary-500 transition-all duration-200 text-text-100`}
              >
                {isPending ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </form>

        {/* Security Tips */}
        <div>
          <div className="flex-1 flex flex-col gap-2xl p-xl bg-card-100 shadow-effect-2 rounded-xl font-nunitosans">
            <div className="flex flex-row gap-md items-start">
              <Shield size={20} className="text-green-600" />
              <h1 className="font-medium text-text-1000 text-body">
                Security Tips
              </h1>
            </div>
            <ul className="list-disc list-inside space-y-2 marker:text-primary-500 text-text-1000 text-body">
              <li>Minimum 8 characters</li>
              <li>Include a number and symbol</li>
              <li>Avoid previous passwords</li>
              <li>Use a mix of uppercase and lowercase letters</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
