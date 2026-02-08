"use client";
import { IncomeVsExpensesItem } from "@/utils/statisticsApi";
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
export default function IncomeVsExpenses({
  data,
}: {
  data: IncomeVsExpensesItem[];
}) {
  return (
    <ResponsiveContainer width="100%" height={390} className={`z-20`}>
      <BarChart data={data}>
        {data.some((item) => "day" in item) && (
          <XAxis dataKey="day" stroke="black" fontSize={16} />
        )}
        {data.some((item) => "week" in item) && (
          <XAxis dataKey="week" stroke="black" fontSize={16} />
        )}
        {data.some((item) => "month" in item) && (
          <XAxis dataKey="month" stroke="black" fontSize={16} />
        )}
        <YAxis stroke="black" fontSize={16} className="font-nunitosans" />
        <Tooltip />
        <Legend />
        {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
        <Bar dataKey="expences" fill="#ed5747" barSize={24} />
        <Bar dataKey="income" fill="green" barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
