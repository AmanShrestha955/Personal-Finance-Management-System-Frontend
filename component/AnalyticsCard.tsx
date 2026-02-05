"use client";
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import DropDown from "./DropDown";
import { useState } from "react";
import { ExpenseTimelineItem } from "@/utils/homeApi";
export default function AnalyticsCard({
  data,
}: {
  data: ExpenseTimelineItem[];
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
        {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
        <Bar dataKey="amount" fill="green" barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
