'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import InvestmentRadarChart from './InvestmentRadarChart';
import { useApi } from '@/hooks/useApi';
import { dashboardApi } from '@/lib/api';
import type { DashboardData } from '@/types';

// Mock investment data for chart - in real implementation this would come from API
const investmentData = [
  { date: 'Jan', value: 45000, return: 5.2 },
  { date: 'Feb', value: 46500, return: 3.3 },
  { date: 'Mar', value: 47800, return: 2.8 },
  { date: 'Apr', value: 49200, return: 2.9 },
  { date: 'May', value: 50800, return: 3.3 },
  { date: 'Jun', value: 52500, return: 3.3 },
];

const investmentTypeLabels: Record<string, string> = {
  stock: 'Stock',
  bond: 'Bond',
  etf: 'ETF',
  'mutual-fund': 'Mutual Fund',
  crypto: 'Cryptocurrency',
  'real-estate': 'Real Estate',
  other: 'Other',
};

export default function InvestmentSummary() {
  const {
    data: dashboardData,
    loading,
    error,
  } = useApi(dashboardApi.getDashboardData);

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

  const topInvestments = investmentSummary.topPerformers.map((investment) => {
    const currentPrice = investment.currentPrice || 0;
    const purchasePrice = investment.purchasePrice || 0;
    const changePercentage =
      purchasePrice > 0
        ? ((currentPrice - purchasePrice) / purchasePrice) * 100
        : 0;

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
      {/* Investment Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Investment Portfolio
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Manage Investments
          </button>
        </div>

        {/* Investment Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Assets</p>
            <p className="text-2xl font-bold">¥{totalValue.toLocaleString()}</p>
            <p className="text-sm opacity-90">
              +¥{monthlyReturn.toFixed(1)}k this month
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Return</p>
            <p className="text-2xl font-bold">+{totalReturn}%</p>
            <p className="text-sm opacity-90">+¥8.2k this year</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Risk Score</p>
            <p className="text-2xl font-bold">Medium</p>
            <p className="text-sm opacity-90">Balanced allocation</p>
          </div>
        </div>

        {/* Return Trend */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Return Trend
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `¥${value.toLocaleString()}`,
                    'Asset Value',
                  ]}
                  labelFormatter={(label) => `${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Investment Details */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">
            Investment Details
          </h4>
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

      {/* Radar Chart - Asset Allocation Comparison */}
      <InvestmentRadarChart
        riskLevel="medium"
        currentAllocation={[
          { type: 'Stocks', percentage: 43 },
          { type: 'Bonds', percentage: 31 },
          { type: 'ETFs', percentage: 15 },
          { type: 'Mutual Funds', percentage: 11 },
          { type: 'Cryptocurrencies', percentage: 0 },
          { type: 'Real Estate', percentage: 0 },
          { type: 'Other', percentage: 0 },
        ]}
      />
    </div>
  );
}
