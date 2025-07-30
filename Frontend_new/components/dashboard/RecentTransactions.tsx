"use client";

import React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { useApi } from "@/hooks/useApi";
import { dashboardApi } from "@/lib/api";
import type { DashboardData } from "@/types";

const categoryColors = {
  food: "bg-blue-100 text-blue-800",
  transport: "bg-green-100 text-green-800",
  shopping: "bg-yellow-100 text-yellow-800",
  salary: "bg-purple-100 text-purple-800",
  investment: "bg-indigo-100 text-indigo-800",
  entertainment: "bg-pink-100 text-pink-800",
  housing: "bg-gray-100 text-gray-800",
  utilities: "bg-orange-100 text-orange-800",
  health: "bg-red-100 text-red-800",
  education: "bg-teal-100 text-teal-800",
  insurance: "bg-cyan-100 text-cyan-800",
  bonus: "bg-emerald-100 text-emerald-800",
  freelance: "bg-violet-100 text-violet-800",
  dividend: "bg-rose-100 text-rose-800",
  interest: "bg-amber-100 text-amber-800",
  other: "bg-gray-100 text-gray-800",
};

const categoryLabels: Record<string, string> = {
  food: "餐饮",
  transport: "交通",
  shopping: "购物",
  salary: "工资",
  investment: "投资",
  entertainment: "娱乐",
  housing: "住房",
  utilities: "水电",
  health: "医疗",
  education: "教育",
  insurance: "保险",
  bonus: "奖金",
  freelance: "兼职",
  dividend: "分红",
  interest: "利息",
  other: "其他",
};

export default function RecentTransactions() {
  const { data: dashboardData, loading, error } = useApi(dashboardApi.getDashboardData);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load recent transactions</p>
        </div>
      </div>
    );
  }

  const transactions = dashboardData.recentTransactions.slice(0, 5);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">最近交易</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          查看全部
        </button>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "income"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {transaction.type === "income" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      categoryColors[transaction.category] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {categoryLabels[transaction.category] || transaction.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {format(transaction.date, "MM月dd日 HH:mm", {
                      locale: zhCN,
                    })}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-semibold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : ""}¥
                {Math.abs(transaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          + 添加新交易
        </button>
      </div>
    </div>
  );
}
