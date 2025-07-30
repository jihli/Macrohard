"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useApi } from "@/hooks/useApi";
import { dashboardApi } from "@/lib/api";
import type { DashboardData } from "@/types";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#6B7280",
];

const categoryLabels: Record<string, string> = {
  food: "餐饮",
  transport: "交通",
  shopping: "购物",
  entertainment: "娱乐",
  housing: "住房",
  utilities: "水电",
  health: "医疗",
  education: "教育",
  insurance: "保险",
  other: "其他",
};

export default function BudgetProgress() {
  const { data: dashboardData, loading, error } = useApi(dashboardApi.getDashboardData);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load budget data</p>
        </div>
      </div>
    );
  }

  const budgetData = dashboardData.budgetProgress.map((item, index) => ({
    name: categoryLabels[item.category] || item.category,
    value: item.spent,
    budget: item.budgeted,
    color: COLORS[index % COLORS.length],
  }));

  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalSpent = budgetData.reduce((sum, item) => sum + item.value, 0);
  const remainingBudget = totalBudget - totalSpent;
  const progressPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">预算进度</h3>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">总预算</p>
            <p className="text-lg font-semibold text-gray-900">
              ¥{totalBudget.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">已支出</p>
            <p className="text-lg font-semibold text-gray-900">
              ¥{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">剩余</p>
            <p
              className={`text-lg font-semibold ${
                remainingBudget >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ¥{remainingBudget.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">总体进度</span>
          <span className="text-sm font-medium text-gray-700">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progressPercentage > 100 ? "bg-red-500" : "bg-blue-500"
            }`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* 饼图 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgetData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {budgetData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `¥${value.toLocaleString()}`,
                  "支出",
                ]}
                labelFormatter={(label) => `${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 详细列表 */}
        <div className="space-y-3">
          {budgetData.map((item, index) => {
            const percentage = (item.value / item.budget) * 100;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      ¥{item.value.toLocaleString()} / ¥
                      {item.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-medium ${
                      percentage > 100 ? "text-red-600" : "text-gray-900"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </p>
                  <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                    <div
                      className={`h-1 rounded-full ${
                        percentage > 100 ? "bg-red-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
