"use client";
import DropDown from "@/component/DropDown";
import Input from "@/component/Input";
import { BackendErrorResponse } from "@/types/type";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import {
  createFamilySavingGoal,
  CreateFamilySavingGoalPayload,
  getFamilySavingGoalById,
  updateFamilySavingGoal,
  UpdateFamilySavingGoalPayload,
} from "@/utils/familySavingGoalApi";
import { categoryWithIcon } from "@/utils/category";
import { OthersIcon } from "@/component/icons/CategoryIcons";
import { useNotification } from "@/hooks/NotificationContext";
import { getMyFamily } from "@/utils/familyApi";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";

const Page: NextPage = () => {
  const { addNotification } = useNotification();
  const navigation = useRouter();
  const searchParams = useSearchParams();
  const savingId = searchParams.get("id");
  const isEditMode = !!savingId;
  const currentUserId = useCurrentUserId();

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
      deadline: "",
      category: "",
    },
  });

  const goalName = watch("goalName");
  const targetAmount = watch("targetAmount");

  // Fetch family data
  const { data: family } = useQuery({
    queryKey: ["family"],
    queryFn: getMyFamily,
    retry: false,
  });

  // Fetch saving data if in edit mode
  const { data: savingData, isLoading: isLoadingSaving } = useQuery({
    queryKey: ["family-saving", savingId, family?._id],
    queryFn: () =>
      family?._id && savingId
        ? getFamilySavingGoalById(family._id, savingId as string)
        : undefined,
    enabled: isEditMode && !!family?._id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateFamilySavingGoalPayload) => {
      if (!family?._id) throw new Error("Family not found");
      return await createFamilySavingGoal(family._id, data);
    },
    onSuccess: (data) => {
      console.log("successfully created family saving goal: ", data);
      addNotification(
        "success",
        "Family Saving Goal Created",
        "Your family saving goal has been created successfully",
      );
      navigation.push("/dashboard/family-management");
    },

    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Create Family Saving Goal", message);
      console.log("error in form data post: ", message);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateFamilySavingGoalPayload) => {
      if (!family?._id) throw new Error("Family not found");
      return await updateFamilySavingGoal(family._id, savingId as string, data);
    },
    onSuccess: (data) => {
      console.log("Successfully updated Family Saving: ", data);
      addNotification(
        "success",
        "Update Family Saving Goal",
        "Family saving goal updated successfully",
      );
      navigation.push("/dashboard/family-management");
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      addNotification("error", "Update Family Saving Goal", message);
      console.log("Error updating family saving goal: ", message);
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
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategorySelectedOption,
  );

  // Populate form when editing
  useEffect(() => {
    if (savingData && isEditMode) {
      reset({
        goalName: savingData.goalName,
        targetAmount: savingData.targetAmount,
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

  const onSubmit = (data: CreateFamilySavingGoalPayload) => {
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
            {isEditMode ? "Edit Family Saving Goal" : "Add Family Saving Goal"}
          </h1>
          <p className="font-sansation text-body tracking-[5%] text-text-1000">
            {isEditMode
              ? "Update your family saving goal details."
              : "Set up a new family savings objective. Fill in the details below."}
          </p>
        </div>

        {/* basic details */}
        <div className="flex flex-col gap-lg">
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Goal Name
            </p>
            <Input
              placeholder="eg. Family Vacation"
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
              {...register("targetAmount", {
                required: "Target Amount is required",
              })}
            />
          </div>

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
              navigation.push("/dashboard/family-management");
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
            Family saving goals allow your entire family to contribute towards a
            common objective. Track progress together and see how close you are
            to achieving your shared goal. All family members can contribute, and
            the goal owner can manage the goal details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
