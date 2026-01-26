import { useRouter } from "next/navigation";
import Tag from "./Tag";

export type SavingGoalDetailCardProps = {
  id: string;
  goalName: string;
  targetAmount: number;
  currentSaving: number;
  deadline: string;
  category: string;
  isCompleted: boolean;
};
export default function SavingGoalDetailCard({
  id,
  goalName,
  targetAmount,
  currentSaving,
  deadline,
  category,
  isCompleted,
}: SavingGoalDetailCardProps) {
  const router = useRouter();
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/dashboard/saving/add-goal?id=${id}`);
      }}
      className="flex flex-col p-md gap-sm rounded-md border border-card-200 bg-card-100 shadow-effect-2 font-nunitosans hover:scale-[1.02] transition-all duration-300 cursor-pointer"
    >
      <h1 className="font-bold text-heading3 text-text-1000">{goalName}</h1>
      <div className="flex flex-row flex-wrap gap-md">
        <Tag text={category} isSelected={false} />
      </div>
      <div className="flex flex-col gap-xs">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-sm font-semibold text-body">
            <p>Saved:</p>
            <p>Rs {currentSaving}</p>
          </div>
          <div className="flex flex-row gap-sm font-semibold text-body">
            <p>Target:</p>
            <p>Rs {targetAmount}</p>
          </div>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-row gap-sm font-semibold text-body">
            <p>Remaining: </p>
            <p>Rs {targetAmount - currentSaving}</p>
          </div>
          <div className="flex flex-row gap-sm font-semibold text-body">
            <p>Deadline: </p>
            <p>{deadline}</p>
          </div>
        </div>
      </div>
      {/* progress bar  */}
      <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
        <div
          className={`h-1 rounded-full bg-secondary-400`}
          style={{ width: `${(currentSaving / targetAmount) * 100}%` }}
        ></div>
      </div>
      {!isCompleted && (
        <div className="flex flex-row gap-sm justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Withdraw clicked");
              router.push(`/dashboard/saving/withdraw?id=${id}`);
            }}
            className="px-sm py-xxs rounded-sm shadow-effect-2 border-[0.5px] border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 duration-300 transition-all text-text-1000 font-medium text-body leading-[130%] cursor-pointer"
          >
            Withdraw
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add Amount clicked");
              router.push(`/dashboard/saving/add-amount?id=${id}`);
            }}
            className="px-sm py-xxs rounded-sm shadow-effect-2 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 transition-all duration-300 text-text-100 font-medium text-body leading-[130%] cursor-pointer"
          >
            Add Amount
          </button>
        </div>
      )}
    </div>
  );
}
