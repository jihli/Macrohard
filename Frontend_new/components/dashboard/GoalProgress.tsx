'use client';

import React from 'react';
import { format, differenceInDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useApi } from '@/hooks/useApi';
import { dashboardApi } from '@/lib/api';
import type { DashboardData } from '@/types';

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const typeColors = {
  emergency: 'bg-red-500',
  travel: 'bg-blue-500',
  house: 'bg-purple-500',
  car: 'bg-green-500',
  education: 'bg-indigo-500',
  retirement: 'bg-orange-500',
};

const goalIcons: Record<string, string> = {
  emergency: '🛡️',
  travel: '✈️',
  house: '🏠',
  car: '🚗',
  education: '📚',
  retirement: '��',
  other: '🎯',
};

export default function GoalProgress() {
  const {
    data: dashboardData,
    loading,
    error,
  } = useApi(dashboardApi.getDashboardData);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load goal data</p>
        </div>
      </div>
    );
  }

  const goals = dashboardData.goalProgress.map((goalProgress) => ({
    ...goalProgress.goal,
    icon: goalIcons[goalProgress.goal.type] || '🎯',
  }));
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Savings Goals</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Add Goal
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = differenceInDays(goal.deadline, new Date());
          const isOverdue = daysRemaining < 0;

          return (
            <div
              key={goal.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{goal.icon}</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {goal.name}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          priorityColors[
                            goal.priority as keyof typeof priorityColors
                          ]
                        }`}
                      >
                        {goal.priority === 'high'
                          ? 'High Priority'
                          : goal.priority === 'medium'
                          ? 'Medium Priority'
                          : 'Low Priority'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {isOverdue
                          ? 'Overdue'
                          : `${daysRemaining} days remaining`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ¥{goal.currentAmount.toLocaleString()} / ¥
                    {goal.targetAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Target Date:{' '}
                    {format(goal.deadline, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-medium text-gray-900">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* 剩余金额 */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  Need ¥
                  {(goal.targetAmount - goal.currentAmount).toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                    Update Progress
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Statistics */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">¥98,000</p>
            <p className="text-xs text-gray-600">Saved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">¥280,000</p>
            <p className="text-xs text-gray-600">Total Goal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
