import { useRouter } from "next/navigation";
import Tag from "./Tag";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSavingGoal, GoalProjection } from "@/utils/savingGoalApi";
import { useState } from "react";

export type SavingGoalDetailCardProps = {
  id: string;
  goalName: string;
  targetAmount: number;
  currentSaving: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
  projection?: GoalProjection;
};

const getProjectionColor = (monthsNeeded: number) => {
  if (monthsNeeded <= 3) return { bg: "bg-green-200", text: "text-green-600" };
  if (monthsNeeded <= 6)
    return { bg: "bg-yellow-200", text: "text-yellow-600" };
  return { bg: "bg-red-200", text: "text-red-600" };
};

export default function SavingGoalDetailCard({
  id,
  goalName,
  targetAmount,
  currentSaving,
  deadline,
  category,
  isCompleted,
  projection,
}: SavingGoalDetailCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: () => deleteSavingGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({ queryKey: ["saving-goals-stats"] });
    },
  });

  const progressPercent = Math.min((currentSaving / targetAmount) * 100, 100);
  const colors = projection?.monthsNeeded
    ? getProjectionColor(projection.monthsNeeded)
    : null;

  return (
    <div
      onClick={() => router.push(`/dashboard/saving/add-goal?id=${id}`)}
      className="grid grid-cols-[1fr_auto] gap-x-5xl gap-y-sm p-md rounded-md border border-card-200 bg-card-100 shadow-effect-2 font-nunitosans hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      {/* Col 1 Row 1: title + tags */}
      <div className="flex flex-row items-center gap-sm flex-wrap">
        <h1 className="font-bold text-heading3 text-text-1000 capitalize">
          {goalName}
        </h1>
        {isCompleted ? (
          <span className="px-sm py-xxs rounded-full border border-green-400 bg-green-100 text-green-600 text-caption font-semibold">
            Completed
          </span>
        ) : (
          <Tag text={category} isSelected={false} />
        )}
      </div>

      {/* Col 2: actions — spans all rows */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="row-span-3 flex flex-col items-end justify-center gap-sm"
      >
        <button
          onClick={() => setShowConfirm(true)}
          className="px-sm py-xs rounded-sm shadow-effect-2 border-[0.5px] border-card-200 bg-card-100 hover:bg-red-50 hover:border-red-200 hover:text-red-500 active:bg-red-100 transition-all duration-300 text-text-600 font-medium text-body cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
        {!isCompleted && (
          <>
            <button
              onClick={() => router.push(`/dashboard/saving/withdraw?id=${id}`)}
              className="px-sm py-xs rounded-sm shadow-effect-2 border-[0.5px] border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 duration-300 transition-all text-text-1000 font-medium text-body leading-[130%] cursor-pointer"
            >
              Withdraw
            </button>
            <button
              onClick={() =>
                router.push(`/dashboard/saving/add-amount?id=${id}`)
              }
              className="px-sm py-xs rounded-sm shadow-effect-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-all duration-300 text-text-100 font-medium text-body leading-[130%] cursor-pointer"
            >
              Add Amount
            </button>
          </>
        )}
      </div>

      {/* Col 1 Row 2: stats */}
      <div className="flex flex-row flex-wrap gap-x-lg gap-y-xs">
        <div className="flex flex-row gap-sm font-semibold text-body">
          <p>Saved:</p>
          <p>Rs {currentSaving.toLocaleString()}</p>
        </div>
        <div className="flex flex-row gap-sm font-semibold text-body">
          <p>Target:</p>
          <p>Rs {targetAmount.toLocaleString()}</p>
        </div>
        <div className="flex flex-row gap-sm font-semibold text-body">
          <p>Remaining:</p>
          <p>Rs {(targetAmount - currentSaving).toLocaleString()}</p>
        </div>
        <div className="flex flex-row gap-sm font-semibold text-body">
          <p>Deadline:</p>
          <p>{deadline}</p>
        </div>
      </div>

      {/* Col 1 Row 3: progress + projection */}
      <div className="flex flex-col gap-xs">
        <div className="relative h-1 w-full rounded-full bg-card-200 overflow-hidden">
          <div
            className="h-1 rounded-full bg-secondary-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex md:flex-row flex-col justify-between items-start">
          <p className="text-caption text-text-600">
            {progressPercent.toFixed(1)}% completed
          </p>
          {projection?.status === "on_track" &&
            !isCompleted &&
            projection.monthsNeeded &&
            colors && (
              <span
                className={`text-caption font-semibold px-sm py-xxs rounded-full ${colors.bg} ${colors.text}`}
              >
                Goal by {projection.projectedDateLabel}
              </span>
            )}
        </div>

        {/* Delete confirm */}
        {showConfirm && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-xs px-sm py-xs rounded-sm bg-red-50 border border-red-200 mt-xs"
          >
            <p className="text-red-600 font-medium text-body">
              Delete this goal?
            </p>
            {isCompleted ? (
              <p className="text-red-400 text-body">
                This goal is completed. Deleting it will{" "}
                <span className="font-bold">not</span> return any amount to your
                account balance.
              </p>
            ) : currentSaving > 0 ? (
              <p className="text-red-400 text-body">
                All saved amount{" "}
                <span className="font-bold">
                  Rs {currentSaving.toLocaleString()}
                </span>{" "}
                will be returned to your account balance.
              </p>
            ) : null}
            <div className="flex flex-row gap-sm justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                className="px-sm py-xs rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 transition-all duration-300 text-text-1000 font-medium text-body cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate();
                  setShowConfirm(false);
                }}
                disabled={deleteMutation.isPending}
                className="px-sm py-xs rounded-sm bg-red-500 hover:bg-red-600 active:bg-red-700 transition-all duration-300 text-white font-medium text-body cursor-pointer disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
