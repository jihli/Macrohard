"use client";

import React from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

const transactions = [
  {
    id: "1",
    description: "星巴克咖啡",
    amount: -45,
    category: "餐饮",
    date: new Date("2024-01-15T10:30:00"),
    type: "expense",
  },
  {
    id: "2",
    description: "工资收入",
    amount: 15000,
    category: "工资",
    date: new Date("2024-01-15T09:00:00"),
    type: "income",
  },
  {
    id: "3",
    description: "地铁交通费",
    amount: -8,
    category: "交通",
    date: new Date("2024-01-15T08:15:00"),
    type: "expense",
  },
  {
    id: "4",
    description: "超市购物",
    amount: -156,
    category: "购物",
    date: new Date("2024-01-14T18:30:00"),
    type: "expense",
  },
  {
    id: "5",
    description: "投资分红",
    amount: 320,
    category: "投资",
    date: new Date("2024-01-14T15:00:00"),
    type: "income",
  },
];

const categoryColors = {
  餐饮: "bg-blue-100 text-blue-800",
  交通: "bg-green-100 text-green-800",
  购物: "bg-yellow-100 text-yellow-800",
  工资: "bg-purple-100 text-purple-800",
  投资: "bg-indigo-100 text-indigo-800",
  娱乐: "bg-pink-100 text-pink-800",
  住房: "bg-gray-100 text-gray-800",
};

export default function RecentTransactions() {
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
                      categoryColors[
                        transaction.category as keyof typeof categoryColors
                      ] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {transaction.category}
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
