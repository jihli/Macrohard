import React from 'react';

interface UnifiedWelcomeCardProps {
  userName?: string;
  currentDate?: string;
  totalAssets?: number;
  assetsChange?: number;
  monthlyIncome?: number;
  incomeChange?: number;
  monthlyExpenses?: number;
  expensesChange?: number;
  savingsRate?: number;
  savingsChange?: number;
}

const UnifiedWelcomeCard: React.FC<UnifiedWelcomeCardProps> = ({
  userName = 'Xiaoming Zhang',
  currentDate = 'Tuesday, July 29, 2025',
  totalAssets = 125680,
  assetsChange = 12.5,
  monthlyIncome = 15200,
  incomeChange = 8.2,
  monthlyExpenses = 8450,
  expensesChange = -3.1,
  savingsRate = 44.2,
  savingsChange = 2.8,
}) => {
  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}%`;
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {userName}!
        </h1>
        <p className="text-gray-600">Today is {currentDate}</p>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assets */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Total Assets</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalAssets)}
          </p>
          <p className={`text-sm font-medium ${getChangeColor(assetsChange)}`}>
            {formatPercentage(assetsChange)} vs Last Month
          </p>
        </div>

        {/* Monthly Income */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Monthly Income</h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(monthlyIncome)}
          </p>
          <p className={`text-sm font-medium ${getChangeColor(incomeChange)}`}>
            {formatPercentage(incomeChange)} vs Last Month
          </p>
        </div>

        {/* Monthly Expenses */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">
            Monthly Expenses
          </h3>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(monthlyExpenses)}
          </p>
          <p
            className={`text-sm font-medium ${getChangeColor(expensesChange)}`}
          >
            {formatPercentage(expensesChange)} vs Last Month
          </p>
        </div>

        {/* Savings Rate */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600">Savings Rate</h3>
          <p className="text-2xl font-bold text-gray-900">{savingsRate}%</p>
          <p className={`text-sm font-medium ${getChangeColor(savingsChange)}`}>
            {formatPercentage(savingsChange)} vs Last Month
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedWelcomeCard;
