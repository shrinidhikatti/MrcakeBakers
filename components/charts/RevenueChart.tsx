"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(val) =>
                new Date(val).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
              }
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
              labelFormatter={(label: any) =>
                new Date(label).toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#e11d48"
              strokeWidth={2}
              dot={{ fill: "#e11d48", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
