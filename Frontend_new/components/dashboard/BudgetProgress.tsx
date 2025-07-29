"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const budgetData = [
  { name: "餐饮", value: 1200, budget: 1500, color: "#3B82F6" },
  { name: "交通", value: 800, budget: 1000, color: "#10B981" },
  { name: "购物", value: 600, budget: 800, color: "#F59E0B" },
  { name: "娱乐", value: 400, budget: 500, color: "#EF4444" },
  { name: "住房", value: 3000, budget: 3500, color: "#8B5CF6" },
  { name: "其他", value: 450, budget: 700, color: "#6B7280" },
];

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#6B7280",
];

export default function BudgetProgress() {
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
