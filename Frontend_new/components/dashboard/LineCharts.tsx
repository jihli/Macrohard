"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TotalAssetsTrendChartProps {
  data: {
    date: string;
    value: number;
  }[];
}

// Mock data for total assets trend
const data = [
  { date: "2024-01", value: 100000 },
  { date: "2024-02", value: 110000 },
  { date: "2024-03", value: 115000 },
  { date: "2024-04", value: 120000 },
  { date: "2024-05", value: 125000 },
  { date: "2024-06", value: 130000 },
];

export default function LineCharts() {
  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">总资产走势</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [
                `¥${value.toLocaleString()}`,
                "总资产",
              ]}
              labelFormatter={(label) => `${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
