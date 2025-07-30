"use client";

import React, { useState, useEffect } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// 投资类型配置
const investmentTypes = [
  {
    key: "stock",
    name: "Stocks",
    color: "#3B82F6",
    description: "High risk, high return, suitable for long-term investment",
  },
  {
    key: "bond",
    name: "Bonds",
    color: "#10B981",
    description: "Low risk, stable return, suitable for conservative investors",
  },
  {
    key: "etf",
    name: "ETFs",
    color: "#8B5CF6",
    description: "Diversified investment, tracks index performance",
  },
  {
    key: "mutual-fund",
    name: "Mutual Funds",
    color: "#F59E0B",
    description: "Professionally managed, diversified investment",
  },
  {
    key: "crypto",
    name: "Cryptocurrencies",
    color: "#EF4444",
    description: "Extremely high risk, high volatility",
  },
  {
    key: "real-estate",
    name: "Real Estate",
    color: "#06B6D4",
    description: "Physical asset, inflation-resistant",
  },
  {
    key: "other",
    name: "Other",
    color: "#6B7280",
    description: "Alternative investments, such as gold, art, etc.",
  },
];

// 根据用户风险偏好调整理想配置
const getIdealAllocation = (riskLevel: "low" | "medium" | "high") => {
  const allocations = {
    low: [
      { type: "股票", ideal: 15, description: "保守配置，主要投资蓝筹股" },
      { type: "债券", ideal: 40, description: "核心配置，提供稳定收益" },
      { type: "ETF", ideal: 20, description: "分散风险，跟踪大盘指数" },
      { type: "基金", ideal: 15, description: "专业管理，适度分散" },
      { type: "加密货币", ideal: 2, description: "极小配置，仅作为尝试" },
      { type: "房地产", ideal: 5, description: "REITs或房地产基金" },
      { type: "其他", ideal: 3, description: "黄金等避险资产" },
    ],
    medium: [
      { type: "股票", ideal: 30, description: "平衡配置，混合成长和价值股" },
      { type: "债券", ideal: 25, description: "稳定收益，降低组合波动" },
      { type: "ETF", ideal: 25, description: "核心配置，跟踪各类指数" },
      { type: "基金", ideal: 10, description: "专业管理，适度配置" },
      { type: "加密货币", ideal: 5, description: "小比例配置，把握机会" },
      { type: "房地产", ideal: 3, description: "REITs配置" },
      { type: "其他", ideal: 2, description: "另类投资" },
    ],
    high: [
      { type: "股票", ideal: 45, description: "积极配置，重点投资成长股" },
      { type: "债券", ideal: 15, description: "最小配置，仅用于流动性" },
      { type: "ETF", ideal: 20, description: "核心配置，跟踪成长指数" },
      { type: "基金", ideal: 10, description: "专业管理，适度配置" },
      { type: "加密货币", ideal: 8, description: "较高配置，把握高收益机会" },
      { type: "房地产", ideal: 1, description: "最小配置" },
      { type: "其他", ideal: 1, description: "另类投资" },
    ],
  };

  return allocations[riskLevel] || allocations.medium;
};

interface InvestmentRadarChartProps {
  riskLevel?: "low" | "medium" | "high";
  currentAllocation?: Array<{ type: string; percentage: number }>;
}

export default function InvestmentRadarChart({
  riskLevel = "medium",
  currentAllocation,
}: InvestmentRadarChartProps) {
  // 获取理想配置
  const idealAllocation = getIdealAllocation(riskLevel);

  // 使用 state 来管理图表数据，避免服务端和客户端渲染不一致
  const [chartData, setChartData] = useState<
    Array<{
      type: string;
      current: number;
      ideal: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    // 只在客户端生成随机数据
    const data = investmentTypes.map((type) => {
      const current =
        currentAllocation?.find((item) => item.type === type.name)
          ?.percentage || Math.floor(Math.random() * 30) + 5;
      const ideal =
        idealAllocation.find((item) => item.type === type.name)?.ideal || 15;

      return {
        type: type.name,
        current,
        ideal,
        color: type.color,
      };
    });

    setChartData(data);
  }, [currentAllocation, riskLevel]);

  // 如果还没有数据，显示加载状态
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              资产配置对比
            </h3>
            <p className="text-sm text-gray-600">当前配置 vs 理想配置</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-500">加载中...</div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const current = payload[0].value;
      const ideal = payload[1].value;
      const difference = current - ideal;
      const item = chartData.find((d) => d.type === label);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-medium text-gray-900">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              当前:{" "}
              <span className="font-medium text-blue-600">{current}%</span>
            </p>
            <p className="text-sm text-gray-600">
              理想: <span className="font-medium text-green-600">{ideal}%</span>
            </p>
            <p
              className={`text-sm font-medium ${
                difference > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {difference > 0
                ? `Exceeding by ${difference}%`
                : `Insufficient by ${Math.abs(difference)}%`}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">资产配置对比</h3>
          <p className="text-sm text-gray-600">当前配置 vs 理想配置</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">当前配置</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">理想配置</span>
          </div>
        </div>
      </div>

      {/* 风险等级指示器 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">风险等级</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              riskLevel === "high"
                ? "bg-red-100 text-red-800"
                : riskLevel === "medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {riskLevel === "high"
              ? "高风险"
              : riskLevel === "medium"
              ? "中风险"
              : "低风险"}
          </span>
        </div>
      </div>

      {/* 雷达图 */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="type"
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 50]}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="当前配置"
              dataKey="current"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="理想配置"
              dataKey="ideal"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 配置建议 */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-3">配置建议</h4>
          <div className="space-y-2">
            {chartData
              .filter((item) => Math.abs(item.current - item.ideal) > 5)
              .map((item) => {
                const difference = item.current - item.ideal;
                return (
                  <div key={item.type} className="text-xs text-blue-800">
                    <span className="font-medium">{item.type}:</span>
                    {difference > 0
                      ? ` 建议减少 ${difference}% 的配置`
                      : ` 建议增加 ${Math.abs(difference)}% 的配置`}
                  </div>
                );
              })}
            {chartData.filter(
              (item) => Math.abs(item.current - item.ideal) <= 5
            ).length === chartData.length && (
              <div className="text-xs text-green-800">
                ✅ 您的资产配置与理想配置基本匹配，继续保持！
              </div>
            )}
          </div>
        </div>

        {/* 投资策略建议 */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            投资策略建议
          </h4>
          <div className="text-xs text-green-800 space-y-1">
            {riskLevel === "low" && (
              <>
                <p>• 重点关注债券和ETF，确保稳定收益</p>
                <p>• 股票配置以蓝筹股为主，避免高风险投资</p>
                <p>• 定期再平衡，保持风险水平</p>
              </>
            )}
            {riskLevel === "medium" && (
              <>
                <p>• 平衡配置股票和债券，适度分散风险</p>
                <p>• 增加ETF配置，跟踪市场表现</p>
                <p>• 考虑定投策略，平滑市场波动</p>
              </>
            )}
            {riskLevel === "high" && (
              <>
                <p>• 重点配置股票和成长型ETF</p>
                <p>• 适度配置加密货币等高风险资产</p>
                <p>• 密切关注市场动态，及时调整</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
