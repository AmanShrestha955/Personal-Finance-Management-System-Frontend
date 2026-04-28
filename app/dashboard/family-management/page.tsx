"use client";
import AnalyticsCard from "@/component/AnalyticsCard";
import { BudgetAlertCard } from "@/component/BudgetAlertCard";
import DropDown from "@/component/DropDown";
import ExpencesCard from "@/component/ExpencesCard";
import { FamilyMembers } from "@/component/FamilyMembers";
import MoneyHighlights from "@/component/MoneyHighlights";
import PieChartComponent from "@/component/PieChartComponent";
import TransactionItem from "@/component/TransactionItem";
import { Category, TransactionDetail, TimeOptionsDataType } from "@/types/type";
import {
  categoryColors,
  categoryIcons,
  categoryWithIcon,
} from "@/utils/category";
import { Family, FamilyMember, getMyFamily } from "@/utils/familyApi";
import {
  getFamilyTransactions,
  getFamilyTransactionSummary,
  FamilyTransaction,
} from "@/utils/familyTransactionApi";
import {
  getFamilyBudgetSummary,
  FamilyBudgetSummaryItem,
} from "@/utils/familyBudgetApi";
import {
  getFamilySavingGoals,
  FamilySavingGoal,
} from "@/utils/familySavingGoalApi";
import {
  getFamilyTop5Expenses,
  getFamilyAmountByPeriod,
  FamilyTopExpenseCategory,
  FamilyAmountByPeriodItem,
} from "@/utils/familyStatisticsApi";
import {
  getFamilyTransfers,
  getMyTransfers,
  createTransfer,
  confirmTransfer,
  cancelTransfer,
  FamilyTransfer,
  CreateTransferPayload,
} from "@/utils/familyTransferApi";
import { TimeFilter } from "@/utils/homeApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowRight, Plus, Users } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useCurrentUserId } from "@/hooks/useCurrentUserId";
import { useEffect, useMemo, useRef, useState } from "react";
import Input from "@/component/Input";

const Page: NextPage = ({}) => {
  const owner = true; // Example ownership status
  const percentage = 70; // Example percentage for the progress bar
  const router = useRouter();
  const currentUserId = useCurrentUserId();

  // ─── Time Period & Type Filter State ──────────────────────────────────────
  const [selectedTimeOption, setSelectedTimeOption] = useState({
    text: "This Month",
  });
  const [selectedTypeOption, setSelectedTypeOption] = useState({
    text: "Expense",
  });
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);

  const timeOptions: { text: TimeOptionsDataType }[] = [
    { text: "This Week" },
    { text: "This Month" },
    { text: "Last 3 Months" },
    { text: "Last 6 Months" },
    { text: "This Year" },
  ];
  const typeOptions = [{ text: "Expense" }, { text: "Income" }];

  const timeOptionsData: Record<TimeOptionsDataType, TimeFilter> = {
    "This Week": { key: "week", timeRange: "1" },
    "This Month": { key: "month", timeRange: "1" },
    "Last 3 Months": { key: "month", timeRange: "3" },
    "Last 6 Months": { key: "month", timeRange: "6" },
    "This Year": { key: "year", timeRange: "1" },
  } as const;

  // ─── Transfer Form State ──────────────────────────────────────────────────
  const [transferToUser, setTransferToUser] = useState("");
  const [selectedUserOption, setSelectedUserOption] = useState({
    text: "Select Recipient",
  });
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");
  const queryClient = useQueryClient();

  // Ref and effect for horizontal scroll on the saving goals card ───────────────────────────────────────────────────────────────

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // ─── Family ───────────────────────────────────────────────────────────────
  const {
    data: family,
    isLoading: isFamilyLoading,
    isError: isFamilyError,
  } = useQuery<Family, AxiosError>({
    queryKey: ["family"],
    queryFn: getMyFamily,
    retry: false,
  });

  const isOwner = family?.owner?._id === currentUserId;
  const hasNoFamily = isFamilyError || !family;

  // ─── Transactions ──────────────────────────────────────────────────────────
  const { data: transactions = [] } = useQuery<FamilyTransaction[]>({
    queryKey: ["familyTransactions", family?._id],
    queryFn: () => getFamilyTransactions(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Transaction Summary ───────────────────────────────────────────────────
  const { data: summary } = useQuery({
    queryKey: ["familyTransactionSummary", family?._id],
    queryFn: () => getFamilyTransactionSummary(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Budget Summary ────────────────────────────────────────────────────────
  const { data: budgetSummary = [] } = useQuery<FamilyBudgetSummaryItem[]>({
    queryKey: ["familyBudgetSummary", family?._id],
    queryFn: () => getFamilyBudgetSummary(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Family Saving Goals ───────────────────────────────────────────────────
  const { data: familySavingGoals = [] } = useQuery<FamilySavingGoal[]>({
    queryKey: ["familySavingGoals", family?._id],
    queryFn: () => getFamilySavingGoals(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Family Statistics ────────────────────────────────────────────────────
  const { data: top5Expenses = [] } = useQuery<FamilyTopExpenseCategory[]>({
    queryKey: ["familyTop5Expenses", family?._id],
    queryFn: () =>
      getFamilyTop5Expenses(family!._id, { key: "month", timeRange: "1" }),
    enabled: !!family?._id,
    retry: false,
  });

  const { data: amountByPeriod = [] } = useQuery<FamilyAmountByPeriodItem[]>({
    queryKey: [
      "familyAmountByPeriod",
      family?._id,
      selectedTimeOption.text,
      selectedTypeOption.text,
    ],
    queryFn: () => {
      const type = selectedTypeOption.text.toLowerCase() as
        | "expense"
        | "income";
      const timeFilter =
        timeOptionsData[selectedTimeOption.text as TimeOptionsDataType];
      return getFamilyAmountByPeriod(family!._id, timeFilter, type);
    },
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Family Transfers ────────────────────────────────────────────────────
  const { data: familyTransfers = [] } = useQuery<FamilyTransfer[]>({
    queryKey: ["familyTransfers", family?._id],
    queryFn: () => getFamilyTransfers(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  const { data: myTransfers = [] } = useQuery<FamilyTransfer[]>({
    queryKey: ["myTransfers", family?._id],
    queryFn: () => getMyTransfers(family!._id),
    enabled: !!family?._id,
    retry: false,
  });

  // ─── Transfer Mutations ──────────────────────────────────────────────────
  const createTransferMutation = useMutation({
    mutationFn: (payload: CreateTransferPayload) => {
      console.log("Creating transfer with payload:", payload);
      return createTransfer(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["myTransfers"] });
      setTransferToUser("");
      setSelectedUserOption({ text: "Select Recipient" });
      setTransferAmount("");
      setTransferNote("");
    },
    onError: (error) => {
      console.error("Error creating transfer:", error);
    },
  });

  const confirmTransferMutation = useMutation({
    mutationFn: (transferId: string) => confirmTransfer(transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["myTransfers"] });
    },
  });

  const cancelTransferMutation = useMutation({
    mutationFn: (transferId: string) => cancelTransfer(transferId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["familyTransfers"] });
      queryClient.invalidateQueries({ queryKey: ["myTransfers"] });
    },
  });

  // ─── Derived data ──────────────────────────────────────────────────────────

  // Family member options for transfer dropdown (excluding current user)
  const familyMemberOptions = useMemo(() => {
    if (!family) return [];
    const members = family.members
      .filter((member) => member.user._id !== currentUserId)
      .map((member) => ({
        text: member.user.name,
      }));
    return members;
  }, [family, currentUserId]);

  // Mapping of member name to userId for dropdown selection
  const memberNameToIdMap = useMemo(() => {
    if (!family) return {};
    const map: Record<string, string> = {};
    family.members.forEach((member) => {
      map[member.user.name] = member.user._id;
    });
    return map;
  }, [family]);

  // Weekly spending bucketed by week-of-month
  const weeklyData = useMemo(() => {
    const weeks = [
      { week: "week1", amount: 0 },
      { week: "week2", amount: 0 },
      { week: "week3", amount: 0 },
      { week: "week4", amount: 0 },
      { week: "week5", amount: 0 },
    ];
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      const day = new Date(t.transactionDate).getDate();
      const weekIndex = Math.min(Math.floor((day - 1) / 7), 4);
      weeks[weekIndex].amount += t.amount;
    });
    return weeks;
  }, [transactions]);

  const pieData =
    top5Expenses.length > 0
      ? top5Expenses.map((expense) => ({
          name: expense.category,
          value: expense.amount,
          colors: categoryColors[expense.category as Category],
        }))
      : [];

  // Recent transactions → map FamilyTransaction → TransactionDetail shape
  const recentTransactions: TransactionDetail[] = useMemo(
    () =>
      [...transactions]
        .sort(
          (a, b) =>
            new Date(b.transactionDate).getTime() -
            new Date(a.transactionDate).getTime(),
        )
        .slice(0, 10)
        .map((t) => ({
          _id: t._id,
          userId:
            t.userId && typeof t.userId === "object" ? t.userId._id : t.userId,
          accountId: t.accountId,
          title: t.title,
          amount: t.amount,
          category: t.category,
          transactionDate: new Date(t.transactionDate),
          description: t.description ?? "",
          type: t.type,
          note: t.note ?? "",
          receipt: t.receipt,
          tags: t.tags ?? [],
        })),
    [transactions],
  );

  const totalSpending = top5Expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-md font-nunitosans">
      {/* ── Header ── */}
      <div className="flex flex-row justify-between items-end">
        <h1 className="font-sansation text-heading font-semibold">
          Family Management
        </h1>
        <div className="flex flex-row gap-sm">
          {hasNoFamily && (
            <button
              onClick={() =>
                router.push("/dashboard/family-management/add-family")
              }
              className="flex flex-row gap-md p-sm h-2xl rounded-md bg-primary-500 text-white font-semibold text-body items-center"
            >
              <Plus size={18} /> Create Family
            </button>
          )}
          {isOwner && (
            <button
              onClick={() =>
                router.push("/dashboard/family-management/manage-members")
              }
              className="flex flex-row gap-md p-sm h-2xl rounded-md bg-primary-500 text-white font-semibold text-body items-center"
            >
              Manage Members
            </button>
          )}
          {family && (
            <button
              onClick={() =>
                router.push(
                  "/dashboard/family-management/add-family-transaction",
                )
              }
              className="flex flex-row gap-md p-sm h-2xl rounded-md bg-tag-1 text-white font-semibold text-body items-center"
            >
              <Plus size={18} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* ── Money Highlights ── */}
      <MoneyHighlights
        period="This Month"
        totalExpenses={`Rs. ${summary?.expense ?? 0}`}
        totalExpensesChange={
          summary ? `${summary.expenseCount} transactions` : "—"
        }
        totalExpensesColor="red"
        totalIncome={`Rs. ${summary?.income ?? 0}`}
        totalIncomeChange={
          summary ? `${summary.incomeCount} transactions` : "—"
        }
        totalSavings={`Rs. ${summary?.balance ?? 0}`}
        totalSavingsChange={
          summary && summary.balance >= 0 ? "positive" : "negative"
        }
        transactions={transactions.length}
        totalIncomeColor="green"
        totalSavingsColor={summary && summary.balance >= 0 ? "green" : "red"}
      />

      {/* ── Family Members ── */}
      {isFamilyLoading ? (
        <div className="flex items-center justify-center py-xl rounded-md border border-card-200 bg-card-100 shadow-effect-2">
          <p className="font-nunitosans text-body text-text-1000 opacity-60">
            Loading family...
          </p>
        </div>
      ) : hasNoFamily ? (
        <div className="flex flex-col items-center justify-center gap-md py-2xl rounded-md border border-dashed border-card-200 bg-card-100">
          <Users size={40} className="text-text-1000 opacity-30" />
          <p className="font-nunitosans font-bold text-heading3 text-text-1000">
            You're not part of a family yet
          </p>
          <p className="font-nunitosans text-body text-text-1000 opacity-60 text-center max-w-[400px]">
            Create a family to collaborate and share financial insights with
            your household.
          </p>
          <button
            onClick={() =>
              router.push("/dashboard/family-management/add-family")
            }
            className="flex flex-row gap-sm p-sm h-2xl rounded-md bg-primary-500 text-white font-semibold text-body items-center px-md"
          >
            <Plus size={18} /> Create Family
          </button>
        </div>
      ) : currentUserId ? (
        <FamilyMembers family={family} currentUserId={currentUserId} />
      ) : null}

      {/* saving goals card ------------------------ */}
      <div className="flex flex-col gap-lg p-lg rounded-lg bg-card-100 shadow-effect-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-heading2 font-bold">Saving Goals</h2>
          {family && (
            <button
              onClick={() =>
                router.push("/dashboard/family-management/add-saving-goals")
              }
              className=" flex flex-row items-center gap-sm px-md py-xs bg-primary-500 rounded-md shadow-effect-2 hover:bg-primary-600 transition-all duration-300 cursor-pointer"
            >
              <Plus size={14} className="text-text-100" />
              <p className="font-nunitosans font-medium text-body text-text-100 leading-[130%] ">
                Add Goal
              </p>
            </button>
          )}
        </div>
        {familySavingGoals.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex flex-row gap-lg overflow-x-auto py-sm scrollbar [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:bg-background-100/0"
          >
            {familySavingGoals.map((goal) => {
              const category = categoryWithIcon.find(
                (c) => c.text === goal.category,
              );
              const Icon = category?.icon || categoryIcons["Others"];
              const progressPercentage = goal.targetAmount
                ? Math.round((goal.currentSaving / goal.targetAmount) * 100)
                : 0;

              return (
                <div
                  key={goal._id}
                  className="flex flex-col gap-md p-lg rounded-md bg-card-200/50 min-w-[400px] cursor-pointer hover:bg-card-200/70 transition-all"
                  onClick={() =>
                    router.push(
                      `/dashboard/family-management/add-saving-goals?id=${goal._id}`,
                    )
                  }
                >
                  <div className="flex flex-row gap-md items-center">
                    <Icon />
                    <div className="flex flex-col gap-xxs">
                      <p className="text-[18px] font-semibold">
                        {goal.goalName}
                      </p>
                      <p className="text-[14px] font-semibold">
                        Due:{" "}
                        {new Date(goal.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xxs">
                    <div className="flex flex-row justify-between">
                      <p className="capitalize text-[14px]">progress</p>
                      <p className="text-[14px] font-bold">
                        {progressPercentage}%
                      </p>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${
                          progressPercentage < 100
                            ? "bg-secondary-400"
                            : "bg-primary-400"
                        }`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 grid-rows-2 gap-y-0 justify-between items-start">
                      <p className="text-[14px] capitalize">current</p>
                      <p className="text-[14px] text-right capitalize">
                        target
                      </p>
                      <p className="text-[14px] font-bold capitalize">
                        Rs {goal.currentSaving.toLocaleString()}
                      </p>
                      <p className="text-[14px] font-bold text-right capitalize">
                        Rs {goal.targetAmount.toLocaleString()}
                      </p>
                    </div>
                    {isOwner ? (
                      <div className="flex flex-row gap-md">
                        {/* for owner */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/family-management/add-saving-goals/add-amount?id=${goal._id}`,
                            );
                          }}
                          className="cursor-pointer capitalize flex-1 bg-primary-400 w-full py-xs rounded-md text-white hover:bg-primary-500 active:bg-primary-600 transition-all duration-300"
                        >
                          Add Funds
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(
                              `/dashboard/family-management/add-saving-goals/withdraw?id=${goal._id}`,
                            );
                          }}
                          className="capitalize flex-1 bg-gray-100 w-full py-xs rounded-md hover:bg-gray-300 active:bg-gray-400 transition-all duration-300"
                        >
                          withdraw
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/dashboard/family-management/add-saving-goals/add-amount?id=${goal._id}`,
                          );
                        }}
                        className=" cursor-pointer capitalize bg-primary-400 w-full py-xs rounded-md text-white hover:bg-primary-500 active:bg-primary-600 transition-all duration-300"
                      >
                        {/* for members */}
                        contribute
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-xl rounded-md border border-dashed border-card-200 bg-card-100">
            <p className="font-nunitosans text-body text-text-1000 opacity-60">
              No saving goals yet. Create one to get started!
            </p>
          </div>
        )}
      </div>
      {/* transfer Money to the family member form family member ------------------- */}
      <div className="flex flex-col gap-lg p-lg bg-card-100 shadow-effect-2 rounded-lg">
        <h1 className="text-heading2 font-bold">Money Transfer</h1>
        <div className="flex flex-row gap-lg items-start">
          {/* new Transfer form */}
          <div className="flex-1 flex flex-col gap-md p-lg rounded-lg bg-card-200/50">
            <p className="capitalize text-[20px] font-bold">New Transfer</p>
            <form
              className="flex flex-col gap-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (family && transferToUser && transferAmount) {
                  createTransferMutation.mutate({
                    familyId: family._id,
                    toUser: transferToUser,
                    amount: parseFloat(transferAmount),
                    note: transferNote,
                  });
                }
              }}
            >
              <div className="flex flex-col gap-0">
                <p className="capitalize text-[14px]">from</p>
                <Input
                  type="text"
                  value={currentUserId ? "Current User" : ""}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-0">
                <p className="capitalize text-[14px]">to</p>
                {familyMemberOptions.length > 0 ? (
                  <DropDown
                    options={familyMemberOptions}
                    selectedOption={selectedUserOption}
                    onSelect={(option) => {
                      setSelectedUserOption(option);
                      setTransferToUser(memberNameToIdMap[option.text]);
                      setIsUserOpen(false);
                    }}
                    isOpen={isUserOpen}
                    onToggle={() => setIsUserOpen(!isUserOpen)}
                  />
                ) : (
                  <Input
                    type="text"
                    placeholder="No family members available"
                    disabled
                  />
                )}
              </div>
              <div className="flex flex-col gap-0">
                <p className="capitalize text-[14px]">amount (Rs)</p>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-0">
                <p className="capitalize text-[14px]">Note</p>
                <Input
                  type="text"
                  placeholder="Description"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={createTransferMutation.isPending}
                className="py-sm w-full bg-primary-400 rounded-md text-white hover:bg-primary-500 disabled:opacity-60 transition-colors"
              >
                {createTransferMutation.isPending
                  ? "Processing..."
                  : "Transfer Money"}
              </button>
            </form>
          </div>
          {/* transfer history */}
          <div className="flex-1 flex flex-col gap-md">
            {/* pending transfer history */}
            <div className="flex flex-col gap-md">
              <h2 className="font-nunitosans text-heading3 font-bold text-text-1000">
                Pending Approvals
              </h2>
              <div className="flex flex-col flex-1 gap-sm max-h-[300px] overflow-y-auto scrollbar [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:bg-background-100/0">
                {myTransfers.filter((t) => t.status === "pending").length ===
                0 ? (
                  <p className="text-body text-text-1000 opacity-60 text-center py-md">
                    No pending transfers
                  </p>
                ) : (
                  myTransfers
                    .filter((t) => t.status === "pending")
                    .map((transfer) => (
                      <div
                        key={transfer._id}
                        className="flex flex-col gap-sm bg-[#FEFCE8] p-lg rounded-lg border-2 border-[#FFF085]"
                      >
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-sm">
                            <div className="flex flex-col gap-0 ">
                              <div className="flex flex-row gap-xs items-center">
                                <p className="text-[18px] font-bold">
                                  {transfer.fromUser.name}
                                </p>
                                <ArrowRight
                                  size={16}
                                  className="text-text-500"
                                />
                                <p className="text-[18px] font-bold">
                                  {transfer.toUser.name}
                                </p>
                              </div>
                              <p>
                                {new Date(
                                  transfer.transferDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <p className="text-[22px] font-bold text-[#D08700]">
                            Rs {transfer.amount}
                          </p>
                        </div>
                        <p className="text-[14px] text-text-500">
                          Transfer initiated by {transfer.fromUser.name}
                        </p>
                        {transfer.toUser._id === currentUserId ? (
                          <button
                            onClick={() =>
                              confirmTransferMutation.mutate(transfer._id)
                            }
                            disabled={confirmTransferMutation.isPending}
                            className="w-full py-sm bg-primary-400 rounded-md text-white hover:bg-primary-500 disabled:opacity-60 transition-colors"
                          >
                            {confirmTransferMutation.isPending
                              ? "Processing..."
                              : "Approve"}
                          </button>
                        ) : transfer.fromUser._id === currentUserId ? (
                          <button
                            onClick={() =>
                              cancelTransferMutation.mutate(transfer._id)
                            }
                            disabled={cancelTransferMutation.isPending}
                            className="w-full py-sm bg-red-500 rounded-md text-text-100 hover:bg-red-600 disabled:opacity-60 transition-colors"
                          >
                            {cancelTransferMutation.isPending
                              ? "Processing..."
                              : "Cancel Transfer"}
                          </button>
                        ) : (
                          <p className="text-sm text-text-500">
                            Awaiting recipient approval
                          </p>
                        )}
                      </div>
                    ))
                )}
              </div>
            </div>
            {/* transfer history */}
            <div className="flex flex-col gap-md">
              <h2 className="font-nunitosans text-heading3 font-bold text-text-1000">
                Transfer History
              </h2>
              <div className="flex flex-col flex-1 gap-sm min-h-[300px] overflow-y-auto scrollbar [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:bg-background-100/0">
                {myTransfers.filter((t) => t.status !== "pending").length ===
                0 ? (
                  <p className="text-body text-text-1000 opacity-60 text-center py-md">
                    No transfer history
                  </p>
                ) : (
                  myTransfers
                    .filter((t) => t.status !== "pending")
                    .map((transfer) => (
                      <div
                        key={transfer._id}
                        className={`flex flex-col gap-sm p-lg rounded-lg border-2 ${
                          transfer.status === "confirmed"
                            ? "bg-[#F0FDF4] border-[#B9F8CF]"
                            : "bg-[#FEF2F2] border-[#FECACA]"
                        }`}
                      >
                        <div className="flex flex-row justify-between">
                          <div className="flex flex-row gap-sm">
                            <div className="flex flex-col gap-0 ">
                              <div className="flex flex-row gap-xs items-center">
                                <p className="text-[18px] font-bold">
                                  {transfer.fromUser.name}
                                </p>
                                <ArrowRight
                                  size={16}
                                  className="text-text-500"
                                />
                                <p className="text-[18px] font-bold">
                                  {transfer.toUser.name}
                                </p>
                              </div>
                              <p>
                                {new Date(
                                  transfer.transferDate,
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <p
                            className={`text-[22px] font-bold ${
                              transfer.status === "confirmed"
                                ? "text-[#00A63E]"
                                : "text-[#DC2626]"
                            }`}
                          >
                            Rs {transfer.amount}
                          </p>
                        </div>
                        <p className="text-[14px] text-text-500">
                          Transfer initiated by {transfer.fromUser.name}
                          <span className="ml-2 capitalize font-semibold">
                            ({transfer.status})
                          </span>
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Analytics + Budget Alerts + Total Spending ── */}
      <div className="flex flex-row gap-md items-start">
        <div className="flex flex-col gap-md flex-1">
          {/* Analytics */}
          <div className="bg-card-100 flex-1 flex-col gap-xl p-2xl rounded-md shadow-effect-2 border border-card-200">
            <div className="flex flex-row justify-between">
              <h2 className="font-nunitosans text-heading2">Analytics</h2>
              <div className="flex flex-row gap-md">
                <DropDown
                  options={timeOptions}
                  selectedOption={selectedTimeOption}
                  onSelect={(option) => {
                    setSelectedTimeOption(option);
                    setIsTimeOpen(false);
                  }}
                  isOpen={isTimeOpen}
                  onToggle={() => setIsTimeOpen(!isTimeOpen)}
                />
                <DropDown
                  options={typeOptions}
                  selectedOption={selectedTypeOption}
                  onSelect={(option) => {
                    setSelectedTypeOption(option);
                    setIsTypeOpen(false);
                  }}
                  isOpen={isTypeOpen}
                  onToggle={() => setIsTypeOpen(!isTypeOpen)}
                />
              </div>
            </div>
            <AnalyticsCard data={amountByPeriod} />
          </div>

          {/* Budget Alerts — driven by real family budget summary */}
          <div className="bg-card-100 rounded-md shadow-effect-2 border border-card-200 p-lg flex flex-col gap-md">
            <div className="flex items-center justify-between">
              <h2 className="font-nunitosans text-heading2 font-bold text-text-1000">
                Budget Alerts
              </h2>
              {isOwner && (
                <button
                  onClick={() =>
                    router.push(
                      "/dashboard/family-management/add-family-budget",
                    )
                  }
                  className="flex flex-row gap-sm px-md py-xs rounded-sm bg-primary-500 text-white text-body font-semibold hover:bg-primary-600 transition-colors items-center"
                >
                  <Plus size={16} /> Add Budget
                </button>
              )}
            </div>

            {budgetSummary.length === 0 ? (
              <p className="font-nunitosans text-body text-text-1000 opacity-60 py-lg text-center">
                {isOwner
                  ? "No family budgets yet. Create one to start tracking!"
                  : "No family budgets have been set up yet."}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {budgetSummary.map((b) => (
                  <BudgetAlertCard
                    key={b._id}
                    id={b._id}
                    category={b.category}
                    alertThreshold={b.alertThreshold}
                    budgetAmount={b.budgetAmount}
                    spentAmount={b.spentAmount}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Total Spending */}
        <div className="flex flex-col gap-sm p-xl rounded-md border border-card-200 bg-card-100 shadow-effect-2">
          <h1 className="min-w-[400px] font-nunitosans text-heading2 font-medium text-text-1000">
            Total Spending
          </h1>
          <h1 className="font-nunitosans text-heading font-semibold text-red-600">
            Rs {totalSpending}
          </h1>
          <PieChartComponent data={pieData} />
          <div className="flex flex-col gap-sm">
            <h1 className="font-nunitosans text-heading2 font-medium text-text-1000">
              Top 5 Expenses
            </h1>
            <div className="flex flex-col gap-xs">
              {top5Expenses.map((expense, index) => (
                <ExpencesCard
                  key={index}
                  color={categoryColors[expense.category as Category]}
                  category={expense.category}
                  amount={expense.amount}
                  icon={
                    categoryIcons[expense.category as Category] ? (
                      categoryIcons[expense.category as Category]({})
                    ) : (
                      <div />
                    )
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="flex flex-col gap-xs p-lg rounded-md shadow-effect-2 bg-card-100">
        <div className="flex flex-row justify-between items-center">
          <h2 className="font-nunitosans text-heading2 font-semibold text-text-1000">
            Recent Transactions
          </h2>
          {family && (
            <button
              onClick={() =>
                router.push(
                  "/dashboard/family-management/add-family-transaction",
                )
              }
              className="flex flex-row gap-sm p-sm h-xl rounded-md bg-primary-500 text-white font-semibold text-body items-center px-md"
            >
              <Plus size={16} /> Add Transaction
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <p className="font-nunitosans text-body text-text-1000 opacity-60 py-lg text-center">
            No family transactions yet. Add the first one!
          </p>
        ) : (
          <table className="border-separate border-spacing-y-sm">
            <thead>
              <tr className="border-b border-card-600">
                <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                  Name
                </td>
                <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                  Date
                </td>
                <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                  Type
                </td>
                <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                  Amount (Rs)
                </td>
              </tr>
            </thead>
            <tbody className="[&>tr>td:first-child]:rounded-l-sm [&>tr>td:last-child]:rounded-r-sm">
              {recentTransactions.map((transaction, index) => (
                <TransactionItem key={index} {...transaction} action={false} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
