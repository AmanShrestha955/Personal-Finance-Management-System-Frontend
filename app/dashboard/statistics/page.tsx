"use client";
import ExpenseTrendCard from "@/component/ExpenseTrendCard";
import {
  HealthcareIcon,
  RentHousingIcon,
} from "@/component/icons/CategoryIcons";
import DropDownIcon from "@/component/icons/dropdown";
import IncomeVsExpenses from "@/component/IncomeVsExpencesCard";
import TransactionItem from "@/component/TransactionItem";
import { TimeOptionsDataType } from "@/types/type";
import { Calendar, Download, FileText, Goal, TrendingUp } from "lucide-react";
import { NextPage } from "next";
import { useState } from "react";

// interface Props {}

const Page: NextPage = ({}) => {
  const contributionData = [
    { name: "Savings Rate", percentage: 65 },
    { name: "Spending Control", percentage: 75 },
    { name: "Budget Adherence", percentage: 90 },
  ];
  const percentage = 50;
  const alertThreshold = 70;
  const timeOptions: { text: TimeOptionsDataType }[] = [
    { text: "This Week" },
    { text: "This Month" },
    { text: "Last 3 Months" },
    { text: "Last 6 Months" },
    { text: "This Year" },
  ];
  const [selectedTimeOption, setSelectedTimeOption] = useState({
    text: "This Month",
  });
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const recentTransactionsData = [
    {
      _id: "1",
      title: "hello",
      category: "rent",
      transactionDate: new Date(),
      type: "expense",
      amount: 394,
    },
    {
      _id: "1",
      title: "hello",
      category: "rent",
      transactionDate: new Date(),
      type: "expense",
      amount: 394,
    },
    {
      _id: "1",
      title: "hello",
      category: "rent",
      transactionDate: new Date(),
      type: "expense",
      amount: 394,
    },
    {
      _id: "1",
      title: "hello",
      category: "rent",
      transactionDate: new Date(),
      type: "expense",
      amount: 394,
    },
    {
      _id: "1",
      title: "hello",
      category: "rent",
      transactionDate: new Date(),
      type: "expense",
      amount: 394,
    },
  ];
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
        <button className="py-xs px-md rounded-full bg-secondary-500 text-text-100 text-body cursor-pointer hover:bg-secondary-600 transition-all duration-75">
          Apply Filters
        </button>
      </div>
      <div className="flex flex-col rounded-xl bg-card-100 p-lg gap-lg shadow-effect-2">
        <div className="flex flex-row gap-sm items-center">
          <div className="p-xs rounded-md bg-primary-500">
            <Calendar size={18} color="white" />
          </div>
          <p className="text-body font-nunitosans text-text-1000">
            This Month&apos;s Money Highlights
          </p>
        </div>
        <div className="flex flex-row gap-md">
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Income</h1>
            <h2 className="text-text-1000 text-body">Rs. 45,000</h2>
            <p className="text-green-600 text-[14px]">+5% from last month</p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Income</h1>
            <h2 className="text-text-1000 text-body">Rs. 45,000</h2>
            <p className="text-green-600 text-[14px]">+5% from last month</p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Income</h1>
            <h2 className="text-text-1000 text-body">Rs. 45,000</h2>
            <p className="text-green-600 text-[14px]">+5% from last month</p>
          </div>
          <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
            <h1 className="text-text-800 text-body">Total Income</h1>
            <h2 className="text-text-1000 text-body">Rs. 45,000</h2>
            <p className="text-green-600 text-[14px]">+5% from last month</p>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-md">
        <div className="flex flex-col flex-1 gap-md">
          <div className="flex flex-col gap-lg p-2xl rounded-xl bg-card-100 shadow-effect-2 font-nunitosans">
            <h1 className="text-heading3 font-semibold text-text-1000 leading-[130%]">
              Income vs Expense (Monthly)
            </h1>
            <IncomeVsExpenses
              data={[
                { month: "jan", expences: 890, income: 1000 },
                { month: "jan", expences: 890, income: 1000 },
                { month: "jan", expences: 890, income: 1000 },
                { month: "jan", expences: 890, income: 1000 },
              ]}
            />
          </div>
          <div className="flex flex-col gap-3xl p-lg rounded-xl shadow-effect-2 font-nunitosans">
            <h1 className="text-heading3 font-semibold text-text-1000 leading-[130%]">
              Expense Trend (This Month)
            </h1>
            <ExpenseTrendCard
              data={[
                { month: "jan", expences: 304 },
                { month: "jan", expences: 34 },
                { month: "jan", expences: 400 },
                { month: "jan", expences: 304 },
              ]}
            />
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
              <div className="flex flex-col p-lg rounded-xl shadow-effect-2 bg-card-100 gap-lg min-w-[440px]">
                <div className="flex flex-row gap-sm">
                  {/* icon */}
                  <div className="w-[48px] h-[48px] flex justify-center items-center p-sm rounded-lg bg-primary-600">
                    <RentHousingIcon className="text-white" />
                  </div>
                  <div className="flex flex-col gap-0 items-start font-nunitosans">
                    <p className="text-heading3 text-text-1000">Laptop Fund</p>
                    <p className="text-body text-text-700 leading-[130%]">
                      Rs. 18,500 / Rs. 50,000
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-xs">
                  <div className="flex flex-row justify-between font-nunitosans">
                    <p className="text-body text-text-8000 leading-[130%]">
                      Progress
                    </p>
                    <p className="text-secondary-500 text-body leading-[130%]">
                      37%
                    </p>
                  </div>
                  <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                    <div
                      className={`h-1 rounded-full ${percentage < alertThreshold ? "bg-secondary-400" : percentage < 100 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex flex-col gap-0 p-sm rounded-lg bg-background-100 font-nunitosans">
                  <p className="text-text-1000 text-body leading-[130%]">
                    Remaining Amount
                  </p>
                  <p className="text-text-1000 text-heading3 leading-[130%]">
                    Rs. 31,500
                  </p>
                </div>
                <div className="flex flex-col gap-0 p-sm rounded-lg bg-green-200 font-nunitosans">
                  <p className="text-green-600 text-body leading-[130%]">
                    🎯 At this pace, you&apos;ll reach your goal by
                  </p>
                  <p className="text-green-600 text-body font-bold leading-[130%]">
                    March 2026
                  </p>
                </div>
              </div>
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
              {[1, 2, 3, 4, 5].map((item, index) => (
                <div
                  key={index}
                  className="p-md bg-background-100 rounded-lg flex flex-col gap-sm"
                >
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-sm items-center">
                      {/* icon */}
                      <div className="size-[40px] rounded-md bg-green-600"></div>
                      <div className="flex flex-col">
                        <p className="text-text-1000 text-body leading-[130%]">
                          Groceries
                        </p>
                        <p className="text-text-700 text-body leading-[130%]">
                          Rs. 8,500 / Rs.10,000
                        </p>
                      </div>
                    </div>
                    <h1 className="text-body font-semibold text-text-1000">
                      50%
                    </h1>
                  </div>
                  <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                    <div
                      className={`h-1 rounded-full ${percentage < alertThreshold ? "bg-secondary-400" : percentage < 100 ? "bg-yellow-400" : "bg-red-400"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <h1 className="text-body text-text-700">
                    Rs. 1,500 remaining
                  </h1>
                </div>
              ))}
            </div>
          </div>
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
                  <h1 className="text-heading text-secondary-500 font-semibold">
                    78
                  </h1>
                  <p className="text-body text-text-700">out of 100</p>
                </div>
                <div className="flex flex-row justify-center items-center gap-xs text-secondary-500">
                  <TrendingUp size={18} />
                  <p className="text-heading3">Good</p>
                </div>
                <p className="text-text-700 text-body text-wrap text-center max-w-[360px] px-md">
                  Your financial health is in good shape! Keep up the great
                  work.
                </p>
              </div>
              <div className="flex flex-col gap-md ">
                <p className="text-body text-text-700">Contributing Factors</p>
                {contributionData.map((item, index) => (
                  <div key={index} className="flex flex-col gap-xs">
                    <div className="flex flex-row justify-between">
                      <p>{item.name}</p>
                      <p>{item.percentage}%</p>
                    </div>
                    <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
                      <div
                        className={`h-1 rounded-full ${item.percentage < 70 ? "bg-yellow-400" : item.percentage < 90 ? "bg-secondary-400" : "bg-green-600"}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
