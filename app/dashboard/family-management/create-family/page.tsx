"use client";
import Input from "@/component/Input";
import { BackendErrorResponse } from "@/types/type";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createFamily, CreateFamilyPayload } from "@/utils/familyApi";
import { useNotification } from "@/hooks/NotificationContext";

const Page: NextPage = () => {
  const { addNotification } = useNotification();
  const navigation = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateFamilyPayload>({
    defaultValues: {
      name: "",
    },
  });

  const familyName = watch("name");

  const createMutation = useMutation({
    mutationFn: async (data: CreateFamilyPayload) => {
      return await createFamily(data);
    },
    onSuccess: (data) => {
      console.log("Successfully created family: ", data);
      addNotification(
        "success",
        "Family Created",
        "Your family has been created successfully",
      );
      navigation.push("/dashboard/family");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Create Family", message);
      console.log("Error creating family: ", message);
    },
  });

  const onSubmit = (data: CreateFamilyPayload) => {
    createMutation.mutate(data);
  };

  return (
    <div className="flex flex-row gap-md mt-8 mr-[32px]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col gap-xl"
      >
        <div className="flex flex-col gap-md">
          <h1 className="font-sansation font-bold text-heading text-text-1000 leading-[100%]">
            Create a Family
          </h1>
          <p className="font-sansation text-body tracking-[5%] text-text-1000">
            Set up your family group. You can invite members after creating it.
          </p>
        </div>

        {/* Family Name */}
        <div className="flex flex-col gap-lg">
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Family Name
            </p>
            <Input
              placeholder="eg. The Johnsons"
              type="text"
              {...register("name", { required: "Family name is required" })}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button
            type="submit"
            disabled={isSubmitting || createMutation.isPending}
            className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Creating..." : "Create Family"}
          </button>
          <button
            type="button"
            disabled={isSubmitting || createMutation.isPending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigation.push("/dashboard/family");
            }}
            className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Right Panel */}
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-md py-lg px-md w-[442px] min-w-[300px] rounded-md bg-card-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            Important Note
          </h4>
          <p className="font-nunitosans text-text-1000 text-body leading-[110%]">
            Creating a family group lets you collaborate and share financial
            insights with your household. As the owner, you can invite members
            by email, remove members, and manage pending invitations at any
            time. Each user can only belong to one family at a time.
          </p>
        </div>

        {/* Live Preview */}
        {familyName ? (
          <div className="flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border border-card-200 bg-card-100 text-text-1000 shadow-effect-2">
            <h4 className="font-nunitosans font-bold text-heading3">
              Family Preview
            </h4>
            <div className="flex flex-col gap-xxs">
              <p className="font-nunitosans font-normal">
                Family name: <b>{familyName}</b>
              </p>
              <p className="font-nunitosans font-normal">
                Role: <b>Owner</b>
              </p>
              <div className="flex items-center gap-xxs mt-xxs">
                <span className="inline-block px-sm py-0.5 rounded-full bg-tag-1 text-caption font-nunitosans font-medium text-text-100">
                  1 Member
                </span>
                <span className="inline-block px-sm py-0.5 rounded-full bg-tag-2 text-caption font-nunitosans font-medium text-text-100">
                  0 Pending Invites
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Page;
