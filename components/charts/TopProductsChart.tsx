"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopProductsChartProps {
  data: { name: string; quantity: number; revenue: number }[];
}

export default function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Selling Products</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11 }}
              width={120}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                name === "revenue" ? `₹${Number(value).toLocaleString("en-IN")}` : value,
                name === "revenue" ? "Revenue" : "Qty Sold",
              ]}
            />
            <Bar dataKey="revenue" fill="#e11d48" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
