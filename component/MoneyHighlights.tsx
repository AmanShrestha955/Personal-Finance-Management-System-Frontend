import { Calendar } from "lucide-react";

type MoneyHighlightsProps = {
  period: string;
  totalIncome: string;
  totalIncomeColor: "red" | "green";
  totalIncomeChange: string;
  totalExpenses: string;
  totalExpensesColor: "red" | "green";
  totalExpensesChange: string;
  totalSavings: string;
  totalSavingsColor: "red" | "green";
  totalSavingsChange: string;
  transactions: number;
};
const MoneyHighlights = ({
  period,
  totalIncome,
  totalIncomeColor,
  totalIncomeChange,
  totalExpenses,
  totalExpensesColor,
  totalExpensesChange,
  totalSavings,
  totalSavingsColor,
  totalSavingsChange,
  transactions,
}: MoneyHighlightsProps) => {
  return (
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
          <h2 className="text-text-1000 text-body">{totalIncome}</h2>
          <p
            className={`${totalIncomeColor === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
          >
            {totalIncomeChange} from last month
          </p>
        </div>
        <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
          <h1 className="text-text-800 text-body">Total Expenses</h1>
          <h2 className="text-text-1000 text-body">{totalExpenses}</h2>
          <p
            className={`${totalExpensesColor === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
          >
            {totalExpensesChange} from last month
          </p>
        </div>
        <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
          <h1 className="text-text-800 text-body">Total Saving</h1>
          <h2 className="text-text-1000 text-body">{totalSavings}</h2>
          <p
            className={`${totalSavingsColor === "green" ? "text-green-600" : "text-red-600"} text-[14px]`}
          >
            {totalSavingsChange} of income
          </p>
        </div>
        <div className="flex flex-1 flex-col p-md rounded-lg bg-background-100 gap-xxs font-nunitosans">
          <h1 className="text-text-800 text-body">Transaction</h1>
          <h2 className="text-text-1000 text-body">{transactions}</h2>
          <p className="text-text-600 text-[14px]">{period}</p>
        </div>
      </div>
    </div>
  );
};

export default MoneyHighlights;
