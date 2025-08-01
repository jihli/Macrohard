"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";
import { useApi } from "@/hooks/useApi";
import { dashboardApi } from "@/lib/api";
import type { DashboardData } from "@/types";

export default function OverviewCards() {
  const { data: dashboardData, loading, error } = useApi(dashboardApi.getDashboardData);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-white/20 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="text-center">
          <p className="text-red-200">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Assets",
      value: `¥${dashboardData.totalBalance.toLocaleString()}`,
      change: "+12.5%", // This would come from API in a real implementation
      changeType: "positive" as const,
      icon: BanknotesIcon,
      color: "bg-gradient-to-r from-green-500 to-emerald-600",
    },
    {
      title: "Monthly Income",
      value: `¥${dashboardData.monthlyIncome.toLocaleString()}`,
      change: "+8.2%", // This would come from API in a real implementation
      changeType: "positive" as const,
      icon: ArrowTrendingUpIcon,
      color: "bg-gradient-to-r from-blue-500 to-cyan-600",
    },
    {
      title: "Monthly Expenses",
      value: `¥${dashboardData.monthlyExpenses.toLocaleString()}`,
      change: "-3.1%", // This would come from API in a real implementation
      changeType: "negative" as const,
      icon: ArrowTrendingDownIcon,
      color: "bg-gradient-to-r from-orange-500 to-red-600",
    },
    {
      title: "Savings Rate",
      value: `${dashboardData.savingsRate.toFixed(1)}%`,
      change: "+2.8%", // This would come from API in a real implementation
      changeType: "positive" as const,
      icon: FlagIcon,
      color: "bg-gradient-to-r from-purple-500 to-pink-600",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
    >
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, Zhang Xiaoming!
        </h1>
        <p className="text-blue-100">
          Today is{" "}
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      {/* Overview Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-100 mb-1">
                  {card.title}
                </p>
                <p className="text-xl font-bold text-white mb-2">
                  {card.value}
                </p>
                <div className="flex items-center space-x-1">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === "positive"
                        ? "text-green-300"
                        : "text-red-300"
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-blue-200">vs Last Month</span>
                </div>
              </div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}
              >
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
