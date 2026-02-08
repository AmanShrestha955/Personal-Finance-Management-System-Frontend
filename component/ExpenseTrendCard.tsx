"use client";
import { ExpenseTimelineItem } from "@/utils/homeApi";
import {
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Line,
} from "recharts";

export default function ExpenseTrendCard({
  data,
}: {
  data: ExpenseTimelineItem[];
}) {
  return (
    <ResponsiveContainer width="100%" height={390} className={`z-20`}>
      <LineChart data={data}>
        {data.some((item) => "day" in item) && (
          <XAxis dataKey="day" stroke="black" fontSize={16} label={"day"} />
        )}
        {data.some((item) => "week" in item) && (
          <XAxis dataKey="week" stroke="black" fontSize={16} label={"week"} />
        )}
        {data.some((item) => "month" in item) && (
          <XAxis dataKey="month" stroke="black" fontSize={16} label={"month"} />
        )}
        <YAxis
          stroke="black"
          fontSize={16}
          className="font-nunitosans"
          padding={{ top: 20 }}
        />
        <Tooltip />
        <Legend />
        {/* <CartesianGrid stroke="#ccc" strokeDasharray="4 4" /> */}
        <Line
          dataKey="amount"
          stroke="#007A8C"
          type={"monotone"}
          strokeWidth={3}
          dot={{ r: 4 }}
        />
        {/* <Bar dataKey="income" fill="green" barSize={24} /> */}
      </LineChart>
    </ResponsiveContainer>
  );
}
