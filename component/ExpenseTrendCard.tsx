"use client";
import {
  Bar,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Line,
  CartesianGrid,
} from "recharts";

type ExpenseTrend = {
  week?: string;
  month?: string;
  day?: string;
  expences: number;
  //   income: number;
};
export default function ExpenseTrendCard({ data }: { data: ExpenseTrend[] }) {
  return (
    <ResponsiveContainer width="100%" height={390} className={`z-20`}>
      <LineChart data={data}>
        {data.some((item) => "day" in item) && (
          <XAxis dataKey="day" stroke="black" fontSize={16} />
        )}
        {data.some((item) => "week" in item) && (
          <XAxis dataKey="week" stroke="black" fontSize={16} />
        )}
        {data.some((item) => "month" in item) && (
          <XAxis dataKey="month" stroke="black" fontSize={16} />
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
          dataKey="expences"
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
