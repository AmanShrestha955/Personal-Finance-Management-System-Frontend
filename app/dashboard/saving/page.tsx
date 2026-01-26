"use client";
import SavingGoalDetailCard from "@/component/SavingGoalDetailCard";
import SavingInfoCard from "@/component/SavingInfoCard";
import { Plus } from "lucide-react";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSavingGoals, getSavingGoalsStats } from "@/utils/savingGoalApi";
import { useRouter } from "next/navigation";

const Page: NextPage = ({}) => {
  const navigator = useRouter();
  const filterOptions = ["All", "In Progress", "Completed"];
  const [selectedFilter, setSelectedFilter] = useState("All");

  const {
    data: savingGoalsStats,
    isLoading: isLoadingSavingGoalsStats,
    error: savingGoalsStatsError,
  } = useQuery({
    queryKey: ["saving-goals-stats"],
    queryFn: () => getSavingGoalsStats(),
  });

  const {
    data: savingGoals,
    isLoading: isLoadingSavingGoals,
    error: savingGoalsError,
  } = useQuery({
    queryKey: ["saving-goals"],
    queryFn: () => getSavingGoals(),
  });

  useEffect(() => {
    console.log("Saving Goals Stats:", savingGoalsStats);
    console.log("Saving Goals:", savingGoals);
  }, [savingGoalsStats, savingGoals]);

  const filteredSavingGoals = useMemo(() => {
    if (!savingGoals) return [];

    if (selectedFilter === "All") {
      return savingGoals;
    } else if (selectedFilter === "In Progress") {
      return savingGoals.filter((goal) => !goal.isCompleted);
    } else if (selectedFilter === "Completed") {
      return savingGoals.filter((goal) => goal.isCompleted);
    }
    return [];
  }, [selectedFilter, savingGoals]);
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-xl ">
      <div className="flex flex-row justify-between items-end">
        <div className="flex flex-col gap-md">
          <h1 className="font-sansation text-heading font-semibold">
            Saving Goals
          </h1>
          <p className="font-nunitosans font-normal text-body text-text-1000 tracking-[5%]">
            Track and manage your saving goals easily.
          </p>
        </div>
        <button
          onClick={() => {
            navigator.push("/dashboard/saving/add-goal");
          }}
          className=" flex flex-row items-center gap-sm px-md py-xs bg-primary-500 rounded-sm shadow-effect-2 hover:bg-primary-600 transition-all duration-300 cursor-pointer"
        >
          <Plus size={14} className="text-text-100" />
          <p className="font-nunitosans font-medium text-body text-text-100 leading-[130%] ">
            Add Goal
          </p>
        </button>
      </div>
      {/* SavingInfoCard */}
      <div className="flex flex-row items-start gap-xl ">
        <SavingInfoCard
          name="Total Saved"
          value={`Rs ${savingGoalsStats ? savingGoalsStats.totalSaved.amount.toFixed(2) : "0.00"}`}
          monthPer={
            savingGoalsStats ? savingGoalsStats.totalSaved.percentageChange : 0
          }
          monthAmount={
            savingGoalsStats ? savingGoalsStats.totalSaved.difference : 0
          }
        />
        <SavingInfoCard
          name="Total Goals"
          value={`${savingGoalsStats ? savingGoalsStats.totalGoals.count : 0}`}
        />
        <SavingInfoCard
          name="Completed Goals"
          value={`${savingGoalsStats ? savingGoalsStats.completedGoals.count : 0}`}
        />
        <SavingInfoCard
          name="Remaining Balance"
          value={`Rs ${savingGoalsStats ? savingGoalsStats.remainingBalance.amount.toFixed(2) : "0.00"}`}
          monthAmount={
            savingGoalsStats ? savingGoalsStats.remainingBalance.difference : 0
          }
          monthPer={
            savingGoalsStats
              ? savingGoalsStats.remainingBalance.percentageChange
              : 0
          }
        />
      </div>
      {/* yourSavingGoals */}
      <div className="flex flex-col gap-sm">
        <h1 className="font-nunitosans font-bold text-heading2 text-text-1000">
          Your Saving Goals
        </h1>
        <div className="flex flex-row gap-md justify-start font-nunitosans font-bold text-text-600">
          {filterOptions.map((option) => (
            <div key={option}>
              <input
                type="radio"
                name="savingGoal"
                id={option}
                value={option}
                className="hidden peer"
                checked={selectedFilter === option}
                onChange={() => setSelectedFilter(option)}
              />
              <label
                htmlFor={option}
                className="peer-checked:text-primary-600 w-[200px] py-xxs text-center inline-block cursor-pointer border-b-2 border-b-primary-600/0 peer-checked:border-b-primary-600 transition-all duration-300"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-md">
          {/* savingGoalDetailCard */}
          {filteredSavingGoals?.map((goal) => (
            <SavingGoalDetailCard
              key={goal._id}
              id={goal._id}
              goalName={goal.goalName}
              targetAmount={goal.targetAmount}
              currentSaving={goal.currentSaving}
              deadline={new Date(goal.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
              category={goal.category}
              isCompleted={goal.isCompleted}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
