"use client";
import ExpenseTrendCard from "@/component/ExpenseTrendCard";
import { HealthcareIcon } from "@/component/icons/CategoryIcons";
import DropDownIcon from "@/component/icons/dropdown";
import IncomeVsExpenses from "@/component/IncomeVsExpencesCard";
import TransactionItem from "@/component/TransactionItem";
import { TimeFilter, TimeOptionsDataType } from "@/types/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Download, FileText, Goal, TrendingUp } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";
import {
  getMoneyHighlights,
  getExpensesByTimePeriod,
  getFinancialHealthMetrics,
  getIncomeExpenseComparison,
  getRecentMonthTransactions,
  getBudgets,
  getSavingGoals,
} from "@/utils/statisticsApi";
import { categoryColors, categoryIcons } from "@/utils/category";

// interface Props {}

const Page: NextPage = ({}) => {
  const quaryClient = useQueryClient();
  const financialHealthMessages: Record<string, string> = {
    Excellent: "Outstanding! Your financial health is excellent.",
    Good: "Your financial health is in good shape! Keep up the great work.",
    Fair: "Your financial health needs attention. Small changes can help.",
    "Needs Improvement":
      "Your financial health needs urgent care. Let's fix it together.",
  };
  const alertThreshold = 70;
  const timeOptions: { text: TimeOptionsDataType }[] = [
    { text: "This Week" },
    { text: "This Month" },
    { text: "Last 3 Months" },
    { text: "Last 6 Months" },
    { text: "This Year" },
  ];

  const timeOptionsData: Record<TimeOptionsDataType, TimeFilter> = {
    "This Week": { key: "week", timeRange: "1" },
    "This Month": { key: "month", timeRange: "1" },
    "Last 3 Months": { key: "month", timeRange: "3" },
    "Last 6 Months": { key: "month", timeRange: "6" },
    "This Year": { key: "year", timeRange: "1" },
  } as const;

  const [selectedTimeOption, setSelectedTimeOption] = useState<{
    text: TimeOptionsDataType;
  }>({
    text: "This Month",
  });
  const [period, setPeriod] = useState(selectedTimeOption.text);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const { data: moneyHighlightsData } = useQuery({
    queryKey: ["money-highlights"],
    queryFn: async () => {
      const response = await getMoneyHighlights(selectedTimeOption.text);
      return response;
    },
  });
  const { data: ExpensesByTime } = useQuery({
    queryKey: ["expenses-data"],
    queryFn: async () => {
      const props =
        timeOptionsData[selectedTimeOption.text as TimeOptionsDataType];
      const response = await getExpensesByTimePeriod(props, "expense");
      return response;
    },
  });

  const { data: incomeExpenseComparisonData } = useQuery({
    queryKey: ["income-vs-expenses"],
    queryFn: async () => {
      const response = await getIncomeExpenseComparison(
        timeOptionsData[selectedTimeOption.text],
      );
      return response;
    },
  });

  const {
    data: recentTransactionsData,
    // isLoading: isRecentTransactionsLoading,
    // isError: isRecentTransactionsError,
  } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: async () => {
      const response = await getRecentMonthTransactions();
      return response;
    },
  });
  const { data: savingGoals } = useQuery({
    queryKey: ["saving-goals"],
    queryFn: () => getSavingGoals(),
  });
  const { data: budgetData, isLoading: isBudgetDataLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await getBudgets();
      return response;
    },
  });
  const { data: financialHealth } = useQuery({
    queryKey: ["financial-health"],
    queryFn: async () => {
      const response = await getFinancialHealthMetrics();
      return response;
    },
  });

  const onApplyFilters = () => {
    quaryClient.invalidateQueries({ queryKey: ["income-vs-expenses"] });
    quaryClient.invalidateQueries({ queryKey: ["expenses-data"] });
    quaryClient.invalidateQueries({ queryKey: ["money-highlights"] });
    quaryClient.refetchQueries({ queryKey: ["expenses-data"] });
    quaryClient.refetchQueries({ queryKey: ["money-highlights"] });
    quaryClient.refetchQueries({ queryKey: ["income-vs-expenses"] });
    setPeriod(selectedTimeOption.text);
  };

  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col gap-md bg-background-100 ">
      <h1 className="font-sansation text-heading font-semibold mb-md">
        Statistics
      </h1>
      <div className="flex flex-row p-xl rounded-md bg-primary-500 font-nunitosans text-text-100">
        <div className="flex flex-col gap-xs">
          <div className="w-[48px] h-[48px] rounded-md bg-primary-300"></div>
          <p className="text-body ">Future Projection</p>
          <p className="text-heading2">Rs. 25,000</p>
          <p className="text-body">
            If you continue saving like this, in <b>2 months</b> you will reach
            this goal.
          </p>
          <div className="flex flex-row px-md py-xs gap-sm items-center bg-primary-300 max-w-60 rounded-full">
            <TrendingUp size={18} />
            <p className="text-body ">+18% from last month</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row px-lg py-md bg-card-100 rounded-xl justify-between font-nunitosans shadow-effect-2">
        <div className="flex flex-row flex-1 gap-xs items-center max-w-[700px] ">
          <Calendar size={18} />
          <p className="text-text-800 text-body">Date Range</p>
          {/* Drop Down */}
          <div className="relative w-[80%]">
            <button
              className={`w-full flex flex-row gap-xs justify-between py-xs px-sm items-center cursor-pointer rounded-full ${
                isTimeOpen ? "bg-card-300" : "bg-card-200"
              }  transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsTimeOpen(!isTimeOpen);
              }}
            >
              <p className="flex-1 font-nunitosans font-medium leading-[130%] text-text-1000 text-body text-left">
                {selectedTimeOption.text}
              </p>
              <DropDownIcon
                width={16}
                height={16}
                rotate={isTimeOpen ? 90 : 0}
              />
            </button>
            {isTimeOpen && (
              <div className="flex flex-col gap-0 w-full bg-card-200 rounded-sm shadow-effect-2 absolute top-[120%] left-0 z-10">
                {timeOptions.map((option, index) => {
                  return (
                    <div
                      key={index}
                      className={`flex flex-row gap-xs p-xs bg-card-100 hover:bg-card-200 ${
                        index === 0
                          ? "rounded-t-sm"
                          : index === timeOptions.length - 1
                            ? "rounded-b-sm"
                            : ""
                      } cursor-pointer transition-all duration-200`}
                      onClick={() => {
                        setSelectedTimeOption(option);
                        setIsTimeOpen(false);
                      }}
                    >
                      <p className="flex-1 font-bold font-nunitosans text-text-1000 text-body leading-[130%]">
                        {option.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onApplyFilters}
          className="py-xs px-md rounded-full bg-secondary-500 text-text-100 text-body cursor-pointer hover:bg-secondary-600 transition-all duration-75"
        >
          Apply Filters
        </button>
      </div>
      <div className="flex flex-col rounded-xl bg-card-100 p-lg gap-lg shadow-effect-2">
        <div className="flex flex-row gap-sm items-center">
          <div className="p-xs rounded-md bg-primary-500">
            <Calendar size={18} color="white" />
          </div>
          <p className="text-body font-nunitosans text-text-1000">
            {period}&apos;s Money Highlights
          </p>
        </div>
        <div className="flex flex-row gap-md">
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Income</h1>
            <h2 className="text-text-1000 text-body">
              {moneyHighlightsData?.totalIncome.formatted}
            </h2>
            <p
              className={`${moneyHighlightsData?.totalIncome.change.color === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
            >
              {moneyHighlightsData?.totalIncome.change.value} from last month
            </p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Expenses</h1>
            <h2 className="text-text-1000 text-body">
              {moneyHighlightsData?.totalExpenses.formatted}
            </h2>
            <p
              className={`${moneyHighlightsData?.totalExpenses.change.color === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
            >
              {moneyHighlightsData?.totalExpenses.change.value} from last month
            </p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Saving</h1>
            <h2 className="text-text-1000 text-body">
              {moneyHighlightsData?.totalSavings.formatted}
            </h2>
            <p
              className={`${moneyHighlightsData?.totalSavings.change.color === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
            >
              {moneyHighlightsData?.totalSavings.change.value} of income
            </p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Transaction</h1>
            <h2 className="text-text-1000 text-body">
              {moneyHighlightsData?.transactions.count}
            </h2>
            <p className="text-text-600 text-[14px]">
              {moneyHighlightsData?.transactions.period}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-md">
        <div className="flex flex-col flex-1 gap-md">
          <div className="flex flex-col gap-lg p-2xl rounded-xl bg-card-100 shadow-effect-2 font-nunitosans">
            <h1 className="text-heading3 font-semibold text-text-1000 leading-[130%]">
              Income vs Expense ({period})
            </h1>
            <IncomeVsExpenses data={incomeExpenseComparisonData || []} />
          </div>
          <div className="flex flex-col gap-3xl p-lg rounded-xl shadow-effect-2 font-nunitosans">
            <h1 className="text-heading3 font-semibold text-text-1000 leading-[130%]">
              Expense Trend ({period})
            </h1>
            <ExpenseTrendCard data={ExpensesByTime || []} />
          </div>
          <div className="flex flex-col gap-xs p-lg rounded-md shadow-effect-2 bg-card-100">
            <h2 className="font-nunitosans text-heading3 font-semibold text-text-1000">
              Recent Transactions
            </h2>
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
                {recentTransactionsData &&
                  recentTransactionsData.map((transaction, index) => (
                    <TransactionItem
                      key={index}
                      {...transaction}
                      action={false}
                    />
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-lg">
            <div className="flex flex-row gap-sm font-nunitosans">
              <Goal size={18} />
              <h1 className="text-body leading-[130%] text-text-1000">
                Your Goals Progress
              </h1>
            </div>
            <div className="flex flex-row justify-center flex-wrap gap-lg">
              {/* card */}
              {savingGoals &&
                savingGoals.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col p-lg rounded-xl shadow-effect-2 bg-card-100 gap-lg min-w-[440px]"
                  >
                    <div className="flex flex-row gap-sm">
                      {/* icon */}
                      <div
                        className={`w-[48px] h-[48px] flex justify-center items-center p-sm rounded-lg text-white `}
                        style={{
                          backgroundColor:
                            categoryColors[
                              item.category as keyof typeof categoryColors
                            ] ?? "#008944",
                        }}
                      >
                        {categoryIcons[
                          item.category as keyof typeof categoryIcons
                        ] ? (
                          categoryIcons[
                            item.category as keyof typeof categoryIcons
                          ]({})
                        ) : (
                          <div></div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0 items-start font-nunitosans">
                        <p className="text-heading3 text-text-1000">
                          {item.goalName}
                        </p>
                        <p className="text-body text-text-700 leading-[130%]">
                          Rs.{" "}
                          {item.currentSaving.toLocaleString("en-NP", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                          / Rs.{" "}
                          {item.targetAmount.toLocaleString("en-NP", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <div className="flex flex-row justify-between font-nunitosans">
                        <p className="text-body text-text-8000 leading-[130%]">
                          Progress
                        </p>
                        <p className="text-secondary-500 text-body leading-[130%]">
                          {(item.currentSaving / item.targetAmount) * 100}%
                        </p>
                      </div>
                      <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                        <div
                          className={`h-1 rounded-full bg-green-600`}
                          style={{
                            width: `${(item.currentSaving / item.targetAmount) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 p-sm rounded-lg bg-background-100 font-nunitosans">
                      <p className="text-text-1000 text-body leading-[130%]">
                        Remaining Amount
                      </p>
                      <p className="text-text-1000 text-heading3 leading-[130%]">
                        Rs.{" "}
                        {(
                          item.targetAmount - item.currentSaving
                        ).toLocaleString("en-NP", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-0 p-sm rounded-lg bg-green-200 font-nunitosans">
                      <p className="text-green-600 text-body leading-[130%]">
                        At this pace, you&apos;ll reach your goal by
                      </p>
                      <p className="text-green-600 text-body font-bold leading-[130%]">
                        March 2026
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="min-w-[360px] flex flex-col gap-md ">
          <div className="flex flex-col gap-2xl p-lg bg-card-100 rounded-xl shadow-effect-2 font-nunitosans">
            <div className="flex flex-row justify-between items-center">
              <p className="text-body leading-[130%] text-text-1000">
                Budget Status
              </p>
              <p className="text-[14px] leading-[130%] text-text-800">
                This Month
              </p>
            </div>
            <div className="flex flex-col gap-md">
              {/* card */}
              {isBudgetDataLoading ? (
                <div> loading ...</div>
              ) : (
                budgetData !== undefined &&
                budgetData.map((item, index) => (
                  <div
                    key={index}
                    className="p-md bg-background-100 rounded-lg flex flex-col gap-sm"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-sm items-center">
                        {/* icon */}
                        <div
                          className="size-[40px] rounded-md justify-center items-center flex text-white"
                          style={{
                            backgroundColor:
                              categoryColors[
                                item.category as keyof typeof categoryColors
                              ] ?? "#008944",
                          }}
                        >
                          {categoryIcons[
                            item.category as keyof typeof categoryIcons
                          ] ? (
                            categoryIcons[
                              item.category as keyof typeof categoryIcons
                            ]({})
                          ) : (
                            <div></div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-text-1000 text-body leading-[130%]">
                            {item.category}
                          </p>
                          <p className="text-text-700 text-body leading-[130%]">
                            Rs.{" "}
                            {item.spentAmount.toLocaleString("en-NP", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}{" "}
                            / Rs.
                            {item.budgetAmount.toLocaleString("en-NP", {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                      </div>
                      <h1 className="text-body font-semibold text-text-1000">
                        {(item.spentAmount / item.budgetAmount) * 100}%
                      </h1>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${(item.spentAmount / item.budgetAmount) * 100 < alertThreshold ? "bg-secondary-400" : (item.spentAmount / item.budgetAmount) * 100 < 100 ? "bg-yellow-400" : "bg-red-400"}`}
                        style={{
                          width: `${(item.spentAmount / item.budgetAmount) * 100 < 100 ? (item.spentAmount / item.budgetAmount) * 100 : 100}%`,
                        }}
                      ></div>
                    </div>
                    <h1 className="text-body text-text-700">
                      Rs.{" "}
                      {(item.budgetAmount - item.spentAmount).toLocaleString(
                        "en-NP",
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        },
                      )}{" "}
                      remaining
                    </h1>
                  </div>
                ))
              )}
            </div>
          </div>
          {financialHealth && (
            <div className="flex flex-col gap-2xl p-lg bg-card-100 rounded-xl shadow-effect-2 font-nunitosans">
              <div className="flex flex-row gap-sm items-center">
                <HealthcareIcon className="text-secondary-400" />
                <p className="text-body leading-[130%] text-text-1000">
                  Financial Health Score
                </p>
              </div>
              <div className="flex flex-col gap-2xl">
                <div className="flex flex-col gap-sm">
                  <div className="flex flex-col justify-center items-center gap-xxs">
                    <h1
                      className={`text-heading font-semibold ${financialHealth.overallHealthScore.score < 40 ? "text-red-600" : financialHealth.overallHealthScore.score < 60 ? "text-yellow-500" : financialHealth.overallHealthScore.score < 80 ? "text-secondary-500" : "text-green-600"}`}
                    >
                      {financialHealth.overallHealthScore.score}
                    </h1>
                    <p className="text-body text-text-700">
                      out of {financialHealth.overallHealthScore.outOf}
                    </p>
                  </div>
                  <div
                    className={`flex flex-row justify-center items-center gap-xs ${financialHealth.overallHealthScore.score < 40 ? "text-red-600" : financialHealth.overallHealthScore.score < 60 ? "text-yellow-500" : financialHealth.overallHealthScore.score < 80 ? "text-secondary-500" : "text-green-600"} `}
                  >
                    <TrendingUp size={18} />
                    <p className="text-heading3">
                      {financialHealth.overallHealthScore.status}
                    </p>
                  </div>
                  <p className="text-text-700 text-body text-wrap text-center max-w-[360px] px-md">
                    {
                      financialHealthMessages[
                        financialHealth.overallHealthScore.status
                      ]
                    }
                  </p>
                </div>
                <div className="flex flex-col gap-md ">
                  <p className="text-body text-text-700">
                    Contributing Factors
                  </p>

                  <div className="flex flex-col gap-xs">
                    <div className="flex flex-row justify-between">
                      <p>{financialHealth.metrics.budgetAdherence.label}</p>
                      <p>{financialHealth.metrics.budgetAdherence.value}%</p>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${financialHealth.metrics.budgetAdherence.value < 40 ? "bg-red-600" : financialHealth.metrics.budgetAdherence.value < 60 ? "bg-yellow-500" : financialHealth.metrics.budgetAdherence.value < 80 ? "bg-secondary-500" : "bg-green-600"}`}
                        style={{
                          width: `${financialHealth.metrics.budgetAdherence.value}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <div className="flex flex-row justify-between">
                      <p>{financialHealth.metrics.savingsRate.label}</p>
                      <p>{financialHealth.metrics.savingsRate.value}%</p>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${financialHealth.metrics.savingsRate.value < 40 ? "bg-red-600" : financialHealth.metrics.savingsRate.value < 60 ? "bg-yellow-500" : financialHealth.metrics.savingsRate.value < 80 ? "bg-secondary-500" : "bg-green-600"}`}
                        style={{
                          width: `${financialHealth.metrics.savingsRate.value}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <div className="flex flex-row justify-between">
                      <p>{financialHealth.metrics.spendingControl.label}</p>
                      <p>{financialHealth.metrics.spendingControl.value}%</p>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${financialHealth.metrics.spendingControl.value < 40 ? "bg-red-600" : financialHealth.metrics.spendingControl.value < 60 ? "bg-yellow-500" : financialHealth.metrics.spendingControl.value < 80 ? "bg-secondary-500" : "bg-green-600"}`}
                        style={{
                          width: `${financialHealth.metrics.spendingControl.value}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2xl p-lg bg-card-100 rounded-xl shadow-effect-2 font-nunitosans">
            <div className="flex flex-row gap-sm items-center">
              <Download size={20} />
              <p className="text-body leading-[130%] text-text-1000 ">
                Export & Share
              </p>
            </div>
            <div className="flex flex-row gap-md">
              <button className="flex flex-row gap-sm px-md py-xs border border-card-200 rounded-xl items-center">
                <FileText size={18} />
                <p>Export as PDF</p>
              </button>
              <button className="flex flex-row gap-sm px-md py-xs border border-card-200 rounded-xl items-center">
                <FileText size={18} />
                <p>Export as CSV</p>
              </button>
            </div>
            <p className="text-text-700 text-body text-wrap max-w-[360px] ">
              Export your financial data for record keeping or share with your
              financial advisor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
