'use client';

import React, { useState, useEffect } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

// Investment type configuration
const investmentTypes = [
  {
    key: 'stock',
    name: 'Stocks',
    color: '#3B82F6',
    description: 'High risk, high return, suitable for long-term investment',
  },
  {
    key: 'bond',
    name: 'Bonds',
    color: '#10B981',
    description: 'Low risk, stable return, suitable for conservative investors',
  },
  {
    key: 'etf',
    name: 'ETFs',
    color: '#8B5CF6',
    description: 'Diversified investment, tracks index performance',
  },
  {
    key: 'mutual-fund',
    name: 'Mutual Funds',
    color: '#F59E0B',
    description: 'Professionally managed, diversified investment',
  },
  {
    key: 'crypto',
    name: 'Cryptocurrencies',
    color: '#EF4444',
    description: 'Extremely high risk, high volatility',
  },
  {
    key: 'real-estate',
    name: 'Real Estate',
    color: '#06B6D4',
    description: 'Physical asset, inflation-resistant',
  },
  {
    key: 'other',
    name: 'Other',
    color: '#6B7280',
    description: 'Alternative investments, such as gold, art, etc.',
  },
];

// Adjust ideal allocation based on user risk preference
const getIdealAllocation = (riskLevel: 'low' | 'medium' | 'high') => {
  const allocations = {
    low: [
      {
        type: 'Stocks',
        ideal: 15,
        description:
          'Conservative allocation, primarily investing in blue-chip stocks',
      },
      {
        type: 'Bonds',
        ideal: 40,
        description: 'Core allocation, providing stable returns',
      },
      {
        type: 'ETF',
        ideal: 20,
        description: 'Risk diversification, tracking major market indices',
      },
      {
        type: 'Mutual Funds',
        ideal: 15,
        description: 'Professionally managed, moderately diversified',
      },
      {
        type: 'Cryptocurrency',
        ideal: 2,
        description: 'Minimal allocation, just for experimentation',
      },
      {
        type: 'Real Estate',
        ideal: 5,
        description: 'REITs or real estate funds',
      },
      { type: 'Other', ideal: 3, description: 'Safe haven assets like gold' },
    ],
    medium: [
      {
        type: 'Stocks',
        ideal: 30,
        description: 'Balanced allocation, mixing growth and value stocks',
      },
      {
        type: 'Bonds',
        ideal: 25,
        description: 'Stable returns, reducing portfolio volatility',
      },
      {
        type: 'ETF',
        ideal: 25,
        description: 'Core allocation, tracking various indices',
      },
      {
        type: 'Mutual Funds',
        ideal: 10,
        description: 'Professionally managed, moderate allocation',
      },
      {
        type: 'Cryptocurrency',
        ideal: 5,
        description: 'Small allocation, seizing opportunities',
      },
      { type: 'Real Estate', ideal: 3, description: 'REITs allocation' },
      { type: 'Other', ideal: 2, description: 'Alternative investments' },
    ],
    high: [
      {
        type: 'Stocks',
        ideal: 45,
        description: 'Aggressive allocation, focusing on growth stocks',
      },
      {
        type: 'Bonds',
        ideal: 15,
        description: 'Minimal allocation, only for liquidity',
      },
      {
        type: 'ETF',
        ideal: 20,
        description: 'Core allocation, tracking growth indices',
      },
      {
        type: 'Mutual Funds',
        ideal: 10,
        description: 'Professionally managed, moderate allocation',
      },
      {
        type: 'Cryptocurrency',
        ideal: 8,
        description: 'Higher allocation, capturing high-yield opportunities',
      },
      { type: 'Real Estate', ideal: 1, description: 'Minimal allocation' },
      { type: 'Other', ideal: 1, description: 'Alternative investments' },
    ],
  };

  return allocations[riskLevel] || allocations.medium;
};

interface InvestmentRadarChartProps {
  riskLevel?: 'low' | 'medium' | 'high';
  currentAllocation?: Array<{ type: string; percentage: number }>;
}

export default function InvestmentRadarChart({
  riskLevel = 'medium',
  currentAllocation,
}: InvestmentRadarChartProps) {
  // Get ideal allocation
  const idealAllocation = getIdealAllocation(riskLevel);

  // Use state to manage chart data, avoiding inconsistency between server and client rendering
  const [chartData, setChartData] = useState<
    Array<{
      type: string;
      current: number;
      ideal: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    // Only generate random data on the client side
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

  // If there's no data yet, show loading state
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Asset Allocation Comparison
            </h3>
            <p className="text-sm text-gray-600">Current vs Ideal Allocation</p>
          </div>
        </div>
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
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
              Now: <span className="font-medium text-blue-600">{current}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Ideal:{' '}
              <span className="font-medium text-green-600">{ideal}%</span>
            </p>
            <p
              className={`text-sm font-medium ${
                difference > 0 ? 'text-red-600' : 'text-green-600'
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
          <h3 className="text-lg font-semibold text-gray-900">
            Asset Allocation Comparison
          </h3>
          <p className="text-sm text-gray-600">Current vs Ideal Allocation</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Current Allocation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Ideal Allocation</span>
          </div>
        </div>
      </div>

      {/* Risk Level Indicator */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Risk Level</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              riskLevel === 'high'
                ? 'bg-red-100 text-red-800'
                : riskLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {riskLevel === 'high'
              ? 'High Risk'
              : riskLevel === 'medium'
              ? 'Medium Risk'
              : 'Low Risk'}
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#E5E7EB" />
            <PolarAngleAxis
              dataKey="type"
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 50]}
              tick={{ fontSize: 10, fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Radar
              name="Current Allocation"
              dataKey="current"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name="Ideal Allocation"
              dataKey="ideal"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Allocation Recommendations */}
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-3">
            Allocation Recommendations
          </h4>
          <div className="space-y-2">
            {chartData
              .filter((item) => Math.abs(item.current - item.ideal) > 5)
              .map((item) => {
                const difference = item.current - item.ideal;
                return (
                  <div key={item.type} className="text-xs text-blue-800">
                    <span className="font-medium">{item.type}:</span>
                    {difference > 0
                      ? ` Consider reducing allocation by ${difference}%`
                      : ` Consider increasing allocation by ${Math.abs(
                          difference
                        )}%`}
                  </div>
                );
              })}
            {chartData.filter(
              (item) => Math.abs(item.current - item.ideal) <= 5
            ).length === chartData.length && (
              <div className="text-xs text-green-800">
                ✅ Your asset allocation closely matches the ideal allocation.
                Keep up the good work!
              </div>
            )}
          </div>
        </div>

        {/* Investment Strategy Recommendations */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">
            Investment Strategy Recommendations
          </h4>
          <div className="text-xs text-green-800 space-y-1">
            {riskLevel === 'low' && (
              <>
                <p>• Focus on bonds and ETFs for stable returns</p>
                <p>
                  • Allocate primarily to blue-chip stocks, avoiding high-risk
                  investments
                </p>
                <p>• Periodically rebalance to maintain risk level</p>
              </>
            )}
            {riskLevel === 'medium' && (
              <>
                <p>
                  • Balance stock and bond allocation for moderate risk
                  diversification
                </p>
                <p>• Increase ETF allocation to track market performance</p>
                <p>
                  • Consider dollar-cost averaging to smooth market volatility
                </p>
              </>
            )}
            {riskLevel === 'high' && (
              <>
                <p>• Focus on stocks and growth-oriented ETFs</p>
                <p>
                  • Moderately allocate to high-risk assets like
                  cryptocurrencies
                </p>
                <p>• Closely monitor market trends and adjust accordingly</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
