"use client";
import AnalyticsCard from "@/component/AnalyticsCard";
import { BudgetAlertCard } from "@/component/BudgetAlertCard";
import ExpencesCard from "@/component/ExpencesCard";
import { FamilyMembers } from "@/component/FamilyMembers";
import MoneyHighlights from "@/component/MoneyHighlights";
import PieChartComponent from "@/component/PieChartComponent";
import TransactionItem from "@/component/TransactionItem";
import { Category, TransactionDetail } from "@/types/type";
import { categoryColors, categoryIcons } from "@/utils/category";
import { Calendar, Plus } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";

const Page: NextPage = ({}) => {
  const data = [
    { week: "week1", amount: 1200 },
    { week: "week2", amount: 0 },
    { week: "week3", amount: 0 },
    { week: "week4", amount: 0 },
    { week: "week5", amount: 0 },
  ];
  const top5category: { amount: number; category: Category }[] = [
    { amount: 700, category: "Food & Dining" },
    { amount: 500, category: "Shopping" },
  ];
  const pieData =
    top5category && top5category.length > 0
      ? top5category.map((expense) => ({
          name: expense.category,
          value: expense.amount,
          colors: categoryColors[expense.category],
        }))
      : [];
  const categories = [
    {
      name: "Rent/Housing",
      spend: 1200,
      budget: 1200,
      alertThreshold: 70,
      id: "1",
    },
    {
      name: "Food & Dining",
      spend: 320,
      budget: 450,
      alertThreshold: 70,
      id: "2",
    },
    {
      name: "Entertainment",
      spend: 89,
      budget: 150,
      alertThreshold: 70,
      id: "3",
    },
    { name: "Transport", spend: 120, budget: 200, alertThreshold: 70, id: "4" },
  ];

  const recentTransactionsData: TransactionDetail[] = [
    {
      _id: "69ac04c975a29655fef9f728",
      userId: "694d22e4993c135f5411fa55",
      accountId: "694d28611e67f636c7c8319d",
      title: "eating outside",
      amount: 700,
      category: "Food & Dining",
      transactionDate: new Date("2026-03-07T00:00:00.000Z"),
      description: "",
      type: "expense",
      note: "",
      receipt: undefined,
      tags: [],
    },
    {
      _id: "69ac036c75a29655fef9f6f6",
      userId: "694d22e4993c135f5411fa55",
      accountId: "694d28611e67f636c7c8319d",
      title: "cloth shopping",
      amount: 500,
      category: "Shopping",
      transactionDate: new Date("2026-03-07T00:00:00.000Z"),
      description: "",
      type: "expense",
      note: "",
      tags: [],
    },
    {
      _id: "69a6c3cb9ae8f9e292c85ca1",
      userId: "694d22e4993c135f5411fa55",
      accountId: "694d28611e67f636c7c8319d",
      title: "freelance",
      amount: 100,
      category: "Others",
      transactionDate: new Date("2026-03-04T00:00:00.000Z"),
      description: "",
      type: "income",
      note: "",
      tags: [],
    },
    {
      _id: "69995994b77e75a2d0536858",
      userId: "694d22e4993c135f5411fa55",
      accountId: "694d28611e67f636c7c8319d",
      title: "Daily Food Budget",
      amount: 100,
      category: "Food",
      transactionDate: new Date("2026-02-21T00:00:00.000Z"),
      description: "Daily food and meals budget",
      type: "income",
      tags: [],
    },
  ];
  const onAddAlert = () => {};
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 gap-md font-nunitosans">
      <h1 className="font-sansation text-heading font-semibold">
        Family Management
      </h1>
      <button className="flex flex-row gap-md p-sm rounded-md bg-primary-500 text-white font-semibold text-body items-center">
        <Plus size={18} /> Add Family Member
      </button>
      <MoneyHighlights
        period="This Month"
        totalExpenses="Rs. 1,200"
        totalExpensesChange="-61%"
        totalExpensesColor="green"
        totalIncome="Rs. 100"
        totalIncomeChange="-99%"
        totalSavings="Rs. 100"
        totalSavingsChange="+100%"
        transactions={5}
        totalIncomeColor="red"
        totalSavingsColor="green"
      />
      <FamilyMembers />
      <div className="flex flex-row gap-md items-start">
        <div className="flex flex-col gap-md flex-1">
          <div className="bg-card-100 flex-1 flex-col gap-xl p-2xl rounded-md shadow-effect-2 border border-card-200">
            <h2 className="font-nunitosans text-heading2">Analytics</h2>
            <AnalyticsCard data={data || []} />
          </div>
          <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col gap-6">
            {/* Widget header */}
            <div className="flex items-center justify-between h-9">
              <h2 className="text-[20px] font-bold leading-7 text-ink">
                Budget Alerts
              </h2>
              <button
                onClick={onAddAlert}
                className="px-[15px] py-2 rounded-[10px] bg-primary-500 text-white text-[14px] font-medium leading-5 hover:bg-brand-600 transition-colors"
              >
                + Alerts
              </button>
            </div>

            {/* 2-column grid of cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <BudgetAlertCard
                  key={cat.name}
                  category={cat.name}
                  alertThreshold={cat.alertThreshold}
                  budgetAmount={cat.budget}
                  id={cat.id}
                  spentAmount={cat.spend}
                />
              ))}
            </div>
          </div>
        </div>
        {/* Total Spending Component */}
        <div className="flex flex-col gap-sm p-xl rounded-md border border-card-200 bg-card-100 shadow-effect-2">
          <h1 className="min-w-[400px] font-nunitosans text-heading2 font-medium text-text-1000">
            Total Spending
          </h1>
          <h1 className="font-nunitosans text-heading font-semibold text-red-600">
            Rs{" "}
            {top5category?.reduce((acc, expense) => acc + expense.amount, 0) ||
              0}
          </h1>
          <PieChartComponent data={pieData} />
          <div className="flex flex-col gap-sm ">
            <h1 className="font-nunitosans text-heading2 font-medium text-text-1000">
              Top 5 Expenses
            </h1>
            <div className="flex flex-col gap-xs">
              {top5category &&
                top5category.map((expense, index) => (
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
                <TransactionItem key={index} {...transaction} action={false} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
