'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function AIRecommendationsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">AI Recommendations</h1>
              <p className="text-gray-600 mt-2">Personalized advice based on your financial situation</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 投资建议 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Portfolio Suggestions</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      title: 'Increase Tech Stock Allocation',
                      description: 'Based on your risk tolerance and market trends, recommend increasing tech stock allocation from 15% to 25%',
                      confidence: 85,
                      impact: 'positive',
                      action: 'Adjust Now',
                    },
                    {
                      id: '2',
                      title: 'Bond Fund Optimization',
                      description: 'Current bond fund yields are low, consider switching to higher-yield bond fund products',
                      confidence: 78,
                      impact: 'positive',
                      action: 'View Details',
                    },
                    {
                      id: '3',
                      title: 'Gold Allocation Recommendation',
                      description: 'Given global economic uncertainty, recommend adding 5% gold allocation as a hedge asset',
                      confidence: 72,
                      impact: 'neutral',
                      action: 'Learn More',
                    },
                  ].map((recommendation) => (
                    <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recommendation.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          recommendation.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recommendation.confidence}% Confidence
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${recommendation.confidence}%` }}
                          ></div>
                        </div>
                        <button className="text-blue-600 text-sm hover:text-blue-700 font-medium">
                          {recommendation.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预算优化 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Optimization Suggestions</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      category: 'Dining Expenses',
                      current: 1200,
                      suggested: 1000,
                      savings: 200,
                      reason: 'Dining expenses exceed budget by 20%, recommend reducing takeout frequency',
                    },
                    {
                      id: '2',
                      category: 'Entertainment Expenses',
                      current: 400,
                      suggested: 350,
                      savings: 50,
                      reason: 'Entertainment expenses are reasonable, can moderately increase savings',
                    },
                    {
                      id: '3',
                      category: 'Transportation Expenses',
                      current: 800,
                      suggested: 750,
                      savings: 50,
                      reason: 'Consider carpooling or public transportation to save on transportation costs',
                    },
                  ].map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{item.category}</h3>
                        <span className="text-sm text-green-600 font-medium">
                          Can save ¥{item.savings}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Current: ¥{item.current}</span>
                        <span>Suggested: ¥{item.suggested}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-3">{item.reason}</p>
                      
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Apply Suggestion
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 智能提醒 */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Smart Reminders</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">📅</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Bill Reminder</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your rent bill is due in 3 days, please pay ¥2,500 on time
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">🎯</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Goal Reminder</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    3 months remaining for "Europe Travel Fund" goal, recommend increasing savings
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-sm">📈</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">Investment Opportunity</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    New investment opportunity detected, recommend following new energy sector
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 