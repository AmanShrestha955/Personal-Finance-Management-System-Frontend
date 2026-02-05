"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  LabelList,
  Tooltip,
} from "recharts";

export default function PieChartComponent({
  data,
}: {
  data: { name: string; value: number; colors: string }[];
}) {
  data = data.length
    ? data
    : [{ name: "No Data", value: 1, colors: "#d5d7dB" }];
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            shape="rounded"
          >
            <Tooltip />
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.colors} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
