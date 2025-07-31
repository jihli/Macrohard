'use client';

import React from 'react';
import AIRecommendations from './AIRecommendations';
import BudgetProgress from './BudgetProgress';
import RecentTransactions from './RecentTransactions';
import OverviewCards from './OverviewCards';
import GoalProgress from './GoalProgress';
import InvestmentSummary from './InvestmentSummary';
import FinancialNews from './FinancialNews';
import UnifiedWelcomeCard from './UnifiedWelcomeCard';
import LineCharts from './LineCharts';
import InvestmentRadarChart from './InvestmentRadarChart';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Overview Cards */}
      <OverviewCards />

      {/* AI Recommendations Section - Moved to Top */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            AI Smart Recommendations
          </h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">AI Assistant Online</span>
          </div>
        </div>

        {/* AI Assistant Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">
                AI Smart Assistant
              </h3>
              <p className="text-sm text-blue-700">
                Provides personalized financial advice and investment
                opportunities based on your financial situation and investment
                preferences.
              </p>
            </div>
          </div>
        </div>

        <AIRecommendations />
      </div>

      {/* Budget Progress */}
      <BudgetProgress />

      {/* Recent Transactions */}
      <RecentTransactions />

      {/* Other Components */}
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
       <LineCharts />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GoalProgress />
        <InvestmentSummary />
      </div>

      <FinancialNews />
      {/* <UnifiedWelcomeCard /> */}
     
    </div>
  );
};

export default Dashboard;
