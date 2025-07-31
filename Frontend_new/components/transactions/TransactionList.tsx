"use client";

import React from "react";
import Link from "next/link";
import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  selectedDate?: Date;
  onClearFilter: () => void;
}

export default function TransactionList({
  transactions,
  selectedDate,
  onClearFilter,
}: TransactionListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: "🍽️",
      transport: "🚗",
      shopping: "🛍️",
      entertainment: "🎬",
      health: "🏥",
      education: "📚",
      housing: "🏠",
      utilities: "⚡",
      insurance: "🛡️",
      investment: "📈",
      salary: "💰",
      bonus: "🎁",
      freelance: "💼",
      dividend: "📊",
      interest: "🏦",
      other: "📝",
    };
    return icons[category] || "📝";
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      food: "Food",
      transport: "Transportation",
      shopping: "Shopping",
      entertainment: "Entertainment",
      health: "Healthcare",
      education: "Education",
      housing: "Housing",
      utilities: "Utilities",
      insurance: "Insurance",
      investment: "Investment",
      salary: "Salary",
      bonus: "Bonus",
      freelance: "Freelance",
      dividend: "Dividend",
      interest: "Interest",
      other: "Other",
    };
    return names[category] || "Other";
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDate
              ? `No transactions found for ${formatDate(selectedDate)}`
              : "No transaction records"}
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedDate
              ? "Try selecting other dates or clear the filter"
              : "Start adding your first transaction record"}
          </p>
          {selectedDate && (
            <button
              onClick={onClearFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Transaction List
        </h2>
        <div className="flex items-center space-x-2">
          {selectedDate && (
            <button
              onClick={onClearFilter}
              className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              清除筛选
            </button>
          )}
          <Link
            href="/transactions/new"
            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Transaction
          </Link>
        </div>
      </div>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getCategoryIcon(transaction.category)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {transaction.description}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span>{getCategoryName(transaction.category)}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                  {transaction.location && (
                    <>
                      <span>•</span>
                      <span>{transaction.location}</span>
                    </>
                  )}
                </div>
                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {transaction.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span
                className={`font-semibold text-lg ${
                  transaction.amount > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.amount > 0 ? "+" : ""}
                {formatAmount(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Income</p>
            <p className="text-lg font-semibold text-green-600">
              {formatAmount(
                transactions
                  .filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              {formatAmount(
                Math.abs(
                  transactions
                    .filter((t) => t.amount < 0)
                    .reduce((sum, t) => sum + t.amount, 0)
                )
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Net Income</p>
            <p
              className={`text-lg font-semibold ${
                transactions.reduce((sum, t) => sum + t.amount, 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
