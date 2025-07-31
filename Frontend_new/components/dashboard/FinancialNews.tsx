'use client';

import React from 'react';
import { useApi } from '@/hooks/useApi';
import { newsApi } from '@/lib/api';

const categoryColors = {
  market: 'bg-blue-100 text-blue-800',
  stocks: 'bg-green-100 text-green-800',
  economy: 'bg-purple-100 text-purple-800',
  crypto: 'bg-orange-100 text-orange-800',
  'real-estate': 'bg-indigo-100 text-indigo-800',
  bonds: 'bg-gray-100 text-gray-800',
};

const sentimentColors = {
  positive: 'text-green-600',
  negative: 'text-red-600',
  neutral: 'text-gray-600',
};

const categoryLabels: Record<string, string> = {
  market: 'Market',
  stocks: 'Stocks',
  economy: 'Economy',
  crypto: 'Cryptocurrency',
  'real-estate': 'Real Estate',
  bonds: 'Bonds',
};

export default function FinancialNews() {
  const {
    data: newsData,
    loading,
    error,
  } = useApi(() => newsApi.getNews({ limit: 4 }));

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load financial news</p>
        </div>
      </div>
    );
  }

  const news = newsData.news || [];
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Financial News</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          More News
        </button>
      </div>
      {/* News Subscription */}
      <div className="m-6 p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Subscribe to Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Market Trends',
            'Stock Analysis',
            'Economic Policies',
            'Real Estate',
            'Investment',
          ].map((topic) => (
            <button
              key={topic}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        {news.map((item: any) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {item.summary || item.content}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      categoryColors[
                        item.category as keyof typeof categoryColors
                      ] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {categoryLabels[
                      item.category as keyof typeof categoryLabels
                    ] || item.category}
                  </span>
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-500">
                    {item.publishedAt || item.time}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <span
                  className={`text-xs font-medium ${
                    sentimentColors[
                      item.sentiment as keyof typeof sentimentColors
                    ] || 'text-gray-600'
                  }`}
                >
                  {item.sentiment === 'positive' && '📈'}
                  {item.sentiment === 'negative' && '📉'}
                  {item.sentiment === 'neutral' && '➡️'}
                  {!item.sentiment && '➡️'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Read More
              </button>
              <div className="flex space-x-2">
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  Bookmark
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}
