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

const investmentData = [
  { date: 'Jan', value: 45000, return: 5.2 },
  { date: 'Feb', value: 46500, return: 3.3 },
  { date: 'Mar', value: 47800, return: 2.8 },
  { date: 'Apr', value: 49200, return: 2.9 },
  { date: 'May', value: 50800, return: 3.3 },
  { date: 'Jun', value: 52500, return: 3.3 },
];

const topInvestments = [
  {
    name: 'CSI 300 ETF',
    type: 'Equity',
    value: 25000,
    return: 8.5,
    change: '+2.3%',
  },
  {
    name: 'Bond Fund A',
    type: 'Bond',
    value: 18000,
    return: 4.2,
    change: '+0.8%',
  },
  {
    name: 'Tech Stock Portfolio',
    type: 'Equity',
    value: 15000,
    return: 12.1,
    change: '+3.1%',
  },
];

export default function InvestmentSummary() {
  const totalValue = 58000;
  const totalReturn = 16.7;
  const monthlyReturn = 2.8;

  return (
    <div className="space-y-6">
      {/* 主要投资概览 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Investment Portfolio
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Manage Investments
          </button>
        </div>

        {/* 投资概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Assets</p>
            <p className="text-2xl font-bold">¥{totalValue.toLocaleString()}</p>
            <p className="text-sm opacity-90">
              +¥{monthlyReturn.toFixed(1)}k This Month
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Total Return</p>
            <p className="text-2xl font-bold">+{totalReturn}%</p>
            <p className="text-sm opacity-90">+¥8.2k This Year</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
            <p className="text-sm opacity-90">Risk Rating</p>
            <p className="text-2xl font-bold">Moderate</p>
            <p className="text-sm opacity-90">Balanced Allocation</p>
          </div>
        </div>

        {/* 收益趋势图 */}
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

        {/* 投资明细 */}
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

      {/* 雷达图 - 资产配置对比 */}
      <InvestmentRadarChart
        riskLevel="medium"
        currentAllocation={[
          { type: '股票', percentage: 43 },
          { type: '债券', percentage: 31 },
          { type: 'ETF', percentage: 15 },
          { type: '基金', percentage: 11 },
          { type: '加密货币', percentage: 0 },
          { type: '房地产', percentage: 0 },
          { type: '其他', percentage: 0 },
        ]}
      />
    </div>
  );
}
