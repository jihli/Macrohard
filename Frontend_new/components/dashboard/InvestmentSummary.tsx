"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import InvestmentRadarChart from "./InvestmentRadarChart";
import { useApi } from "@/hooks/useApi";
import { dashboardApi } from "@/lib/api";
import type { DashboardData } from "@/types";

// Mock investment data for chart - in real implementation this would come from API
const investmentData = [
  { date: "1月", value: 45000, return: 5.2 },
  { date: "2月", value: 46500, return: 3.3 },
  { date: "3月", value: 47800, return: 2.8 },
  { date: "4月", value: 49200, return: 2.9 },
  { date: "5月", value: 50800, return: 3.3 },
  { date: "6月", value: 52500, return: 3.3 },
];

const investmentTypeLabels: Record<string, string> = {
  stock: "股票型",
  bond: "债券型",
  etf: "ETF",
  'mutual-fund': "基金",
  crypto: "加密货币",
  'real-estate': "房地产",
  other: "其他",
};

export default function InvestmentSummary() {
  const { data: dashboardData, loading, error } = useApi(dashboardApi.getDashboardData);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-red-600">Failed to load investment data</p>
          </div>
        </div>
      </div>
    );
  }

  const { investmentSummary } = dashboardData;
  const totalValue = investmentSummary.totalValue;
  const totalReturn = investmentSummary.totalReturn;
  const monthlyReturn = investmentSummary.returnPercentage;

  const topInvestments = investmentSummary.topPerformers.map(investment => {
    const currentPrice = investment.currentPrice || 0;
    const purchasePrice = investment.purchasePrice || 0;
    const changePercentage = purchasePrice > 0 ? ((currentPrice - purchasePrice) / purchasePrice * 100) : 0;
    
    return {
      name: investment.name,
      type: investmentTypeLabels[investment.type] || investment.type,
      value: investment.amount,
      return: investment.expectedReturn,
      change: `+${changePercentage.toFixed(1)}%`,
    };
  });

  return (
    <div className="space-y-6">
      {/* 主要投资概览 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">投资组合</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            管理投资
          </button>
        </div>

        {/* 投资概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">总资产</p>
            <p className="text-2xl font-bold">¥{totalValue.toLocaleString()}</p>
            <p className="text-sm opacity-90">
              +¥{monthlyReturn.toFixed(1)}k 本月
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">总收益</p>
            <p className="text-2xl font-bold">+{totalReturn}%</p>
            <p className="text-sm opacity-90">+¥8.2k 本年</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">风险评分</p>
            <p className="text-2xl font-bold">中等</p>
            <p className="text-sm opacity-90">平衡型配置</p>
          </div>
        </div>

        {/* 收益趋势图 */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">收益趋势</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    "资产价值",
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

        {/* 投资明细 */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">投资明细</h4>
          <div className="space-y-3">
            {topInvestments.map((investment, index) => (
              <div
                key={investment.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {investment.name}
                    </p>
                    <p className="text-xs text-gray-500">{investment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ¥{investment.value.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-green-600 font-medium">
                      +{investment.return}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {investment.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 雷达图 - 资产配置对比 */}
      <InvestmentRadarChart
        riskLevel="medium"
        currentAllocation={[
          { type: "股票", percentage: 43 },
          { type: "债券", percentage: 31 },
          { type: "ETF", percentage: 15 },
          { type: "基金", percentage: 11 },
          { type: "加密货币", percentage: 0 },
          { type: "房地产", percentage: 0 },
          { type: "其他", percentage: 0 },
        ]}
      />
    </div>
  );
}
