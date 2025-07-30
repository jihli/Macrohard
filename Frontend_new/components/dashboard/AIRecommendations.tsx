'use client';

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { aiRecommendationsApi } from '@/lib/api';

const typeColors = {
  saving: 'bg-green-100 text-green-800',
  investment: 'bg-blue-100 text-blue-800',
  budget: 'bg-purple-100 text-purple-800',
  tax: 'bg-orange-100 text-orange-800',
};

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

const typeLabels: Record<string, string> = {
  saving: 'Saving',
  investment: 'Investment',
  budget: 'Budget',
  tax: 'Tax',
};

const priorityLabels: Record<string, string> = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

export default function AIRecommendations() {
  const {
    data: recommendationsData,
    loading,
    error,
  } = useApi(aiRecommendationsApi.getRecommendations);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !recommendationsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load AI recommendations</p>
        </div>
      </div>
    );
  }

  const recommendations = [
    ...(recommendationsData.investmentRecommendations || []).map(
      (rec: any) => ({
        id: rec.id,
        type: 'investment' as const,
        title: rec.title,
        description: rec.description,
        priority:
          rec.confidence > 80
            ? ('high' as const)
            : rec.confidence > 60
            ? ('medium' as const)
            : ('low' as const),
        estimatedImpact: rec.impact === 'positive' ? 1200 : 0,
        actionItems: [rec.action],
        icon: '📈',
      })
    ),
    ...(recommendationsData.budgetRecommendations || []).map((rec: any) => ({
      id: `budget-${rec.category}`,
      type: 'budget' as const,
      title: `Optimize ${rec.category} Expenses`,
      description: rec.reason,
      priority: 'medium' as const,
      estimatedImpact: rec.savings,
      actionItems: ['Create Budget Plan', 'Find Better Deals'],
      icon: '🎯',
    })),
  ];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          AI Recommendations
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {recommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3 mb-3">
              <div className="text-2xl">{recommendation.icon}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {recommendation.title}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      typeColors[recommendation.type as keyof typeof typeColors]
                    }`}
                  >
                    {recommendation.type === 'saving' && 'Saving'}
                    {recommendation.type === 'investment' && 'Investment'}
                    {recommendation.type === 'budget' && 'Budget'}
                    {recommendation.type === 'tax' && 'Tax'}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      priorityColors[
                        recommendation.priority as keyof typeof priorityColors
                      ]
                    }`}
                  >
                    {recommendation.priority === 'high'
                      ? 'High Priority'
                      : recommendation.priority === 'medium'
                      ? 'Medium Priority'
                      : 'Low Priority'}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  {recommendation.description}
                </p>

                {/* 预期影响 */}
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">
                      Expected Impact:
                    </span>
                    <span className="text-xs font-medium text-green-600">
                      +¥{recommendation.estimatedImpact.toLocaleString()}/month
                    </span>
                  </div>
                </div>

                {/* 行动项目 */}
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">
                    Recommended Actions:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recommendation.actionItems.map(
                      (item: string, index: number) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                    Accept Suggestion
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    Remind Later
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    Ignore
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI状态 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">
              AI analysis engine running normally
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Real-time analysis based on your data
          </span>
        </div>
      </div>
    </div>
  );
}
