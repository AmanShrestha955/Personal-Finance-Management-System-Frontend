"use client";
import AnalyticsCard from "@/component/AnalyticsCard";
import DashboardCard from "@/component/DashboardCard";
import DropDown from "@/component/DropDown";
import ExpencesCard from "@/component/ExpencesCard";
import PieChartComponent from "@/component/PieChartComponent";
import TransactionItem from "@/component/TransactionItem";
import { TimeOptionsDataType, TransactionType } from "@/types/type";
import { categoryColors, categoryIcons } from "@/utils/category";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAccountSummaryData,
  getExpensesByTimePeriod,
  getRecentMonthTransactions,
  getTop5Expenses,
  TimeFilter,
} from "@/utils/homeApi";

const Page: NextPage = ({}) => {
  const currentDate = new Date();
  const previousDate = new Date();
  previousDate.setMonth(currentDate.getMonth() - 1);
  const currentDay = String(currentDate.getDate()).padStart(2, "0");
  const currentMounth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const previousDay = String(previousDate.getDate()).padStart(2, "0");
  const previousMonth = String(previousDate.getMonth() + 1).padStart(2, "0");

  const [selectedTimeOption, setSelectedTimeOption] = useState({
    text: "This Month",
  });
  const [selectedExpenseTimeOption, setSelectedExpenseTimeOption] = useState({
    text: "This Month",
  });
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [isExpenseTimeOpen, setIsExpenseTimeOpen] = useState(false);
  const timeOptions: { text: TimeOptionsDataType }[] = [
    { text: "This Week" },
    { text: "This Month" },
    { text: "Last 3 Months" },
    { text: "Last 6 Months" },
    { text: "This Year" },
  ];
  const typeOptions = [{ text: "Expense" }, { text: "Income" }];
  const [selectedTypeOption, setSelectedTypeOption] = useState({
    text: "Expense",
  });
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const timeOptionsData: Record<TimeOptionsDataType, TimeFilter> = {
    "This Week": { key: "week", timeRange: "1" },
    "This Month": { key: "month", timeRange: "1" },
    "Last 3 Months": { key: "month", timeRange: "3" },
    "Last 6 Months": { key: "month", timeRange: "6" },
    "This Year": { key: "year", timeRange: "1" },
  } as const;
  const queryClient = useQueryClient();
  const {
    data: top5ExpensesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top5Expenses", selectedExpenseTimeOption.text],
    queryFn: async () => {
      console.log(
        "Fetching top 5 expenses by time period with option:",
        timeOptionsData[selectedExpenseTimeOption.text as TimeOptionsDataType],
      );
      const props =
        timeOptionsData[selectedExpenseTimeOption.text as TimeOptionsDataType];
      const response = await getTop5Expenses(props);
      return response;
    },
  });
  const {
    data: accountSummaryData,
    isLoading: isAccountSummaryLoading,
    isError: isAccountSummaryError,
  } = useQuery({
    queryKey: ["accountSummary"],
    queryFn: async () => {
      const response = await getAccountSummaryData();
      return response;
    },
  });
  const {
    data: expenseByTimePeriodData,
    isLoading: isExpenseByTimePeriodLoading,
    isError: isExpenseByTimePeriodError,
  } = useQuery({
    queryKey: [
      "expenseByTimePeriod",
      selectedTimeOption.text,
      selectedTypeOption.text,
    ],
    queryFn: async () => {
      console.log(
        "Fetching expense by time period with option:",
        timeOptionsData[selectedTimeOption.text as TimeOptionsDataType],
      );
      const type = selectedTypeOption.text.toLowerCase() as TransactionType;
      const props =
        timeOptionsData[selectedTimeOption.text as TimeOptionsDataType];
      const response = await getExpensesByTimePeriod(props, type);
      return response;
    },
  });

  const {
    data: recentTransactionsData,
    isLoading: isRecentTransactionsLoading,
    isError: isRecentTransactionsError,
  } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: async () => {
      const response = await getRecentMonthTransactions();
      return response;
    },
  });

  useEffect(() => {
    console.log("Recent Transactions Data:", recentTransactionsData);
  }, [recentTransactionsData]);
  useEffect(() => {
    console.log("Top 5 Expenses Data:", top5ExpensesData);
  }, [top5ExpensesData]);
  useEffect(() => {
    console.log("Account Summary Data:", accountSummaryData);
  }, [accountSummaryData]);
  useEffect(() => {
    console.log("Expense By Time Period Data:", expenseByTimePeriodData);
  }, [expenseByTimePeriodData]);

  const data =
    top5ExpensesData && top5ExpensesData.length > 0
      ? top5ExpensesData.map((expense) => ({
          name: expense.category,
          value: expense.amount,
          colors: categoryColors[expense.category],
        }))
      : [];
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-md ">
      <h1 className="font-sansation text-heading font-semibold">Dashboard</h1>
      <p className="font-nunitosans font-normal text-body text-text-1000 tracking-[5%]">
        FINANCIAL OVERVIEW {previousMonth} / {previousDay} - {currentMounth} /{" "}
        {currentDay}
      </p>
      <div className="flex flex-row gap-md font-nunitosans">
        <DashboardCard
          title="Total Income"
          amount={`Rs ${accountSummaryData?.thisMonth.income || 0}`}
          change={`Rs ${accountSummaryData?.monthChanges.income.amount || 0}`}
          percentage={`${accountSummaryData?.monthChanges.income.percentage || 0}%`}
        />
        <DashboardCard
          title="Total Expenses"
          amount={`Rs ${accountSummaryData?.thisMonth.expenses || 0}`}
          change={`Rs ${accountSummaryData?.monthChanges.expenses.amount || 0}`}
          percentage={`${accountSummaryData?.monthChanges.expenses.percentage || 0}%`}
        />
        <DashboardCard
          title="Net Balance"
          amount={`Rs ${accountSummaryData?.totalBalance || 0}`}
          change={`Rs ${accountSummaryData?.thisMonth.balance || 0}`}
          percentage={`${accountSummaryData?.monthChanges.balance.percentage || 0}%`}
        />
      </div>
      <div className="flex flex-row gap-md">
        <div className="flex-1 flex flex-col gap-md">
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
            <AnalyticsCard data={expenseByTimePeriodData || []} />
          </div>
          {/* Recent Transactions section */}
          <div className="flex flex-col gap-xs p-lg rounded-md shadow-effect-2 bg-card-100">
            <h2 className="font-nunitosans text-heading2 font-semibold text-text-1000">
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
        </div>
        {/* total Spending card */}
        <div className="flex flex-col gap-sm p-xl rounded-md border border-card-200 bg-card-100 shadow-effect-2">
          <div className="flex flex-row justify-between min-w-[400px]">
            <h1 className="font-nunitosans text-heading2 font-medium text-text-1000">
              Total Spending
            </h1>
            <DropDown
              options={timeOptions}
              selectedOption={selectedExpenseTimeOption}
              onSelect={(option) => {
                setSelectedExpenseTimeOption(option);
                setIsExpenseTimeOpen(false);
              }}
              isOpen={isExpenseTimeOpen}
              onToggle={() => setIsExpenseTimeOpen(!isExpenseTimeOpen)}
            />
          </div>
          <h1 className="font-nunitosans text-heading font-semibold text-red-600">
            Rs{" "}
            {top5ExpensesData?.reduce(
              (acc, expense) => acc + expense.amount,
              0,
            ) || 0}
          </h1>
          <PieChartComponent data={data} />
          <div className="flex flex-col gap-sm">
            <h1 className="font-nunitosans text-heading2 font-medium text-text-1000">
              Top 5 Expenses
            </h1>
            <div className="flex flex-col gap-xs">
              {top5ExpensesData &&
                top5ExpensesData.map((expense, index) => (
                  <ExpencesCard
                    key={index}
                    color={categoryColors[expense.category]}
                    category={expense.category}
                    amount={expense.amount}
                    icon={
                      categoryIcons[expense.category] ? (
                        categoryIcons[expense.category]({})
                      ) : (
                        <div></div>
                      )
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
