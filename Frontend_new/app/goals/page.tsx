'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function GoalsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Goal Management</h1>
              <p className="text-gray-600 mt-2">Set and track your financial goals</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 当前目标 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Current Goals</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add Goal
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      name: 'Emergency Fund',
                      targetAmount: 50000,
                      currentAmount: 35000,
                      percentage: 70,
                      deadline: '2024-06-30',
                      priority: 'high',
                    },
                    {
                      id: '2',
                      name: 'Europe Travel Fund',
                      targetAmount: 30000,
                      currentAmount: 18000,
                      percentage: 60,
                      deadline: '2024-09-15',
                      priority: 'medium',
                    },
                    {
                      id: '3',
                      name: 'House Down Payment',
                      targetAmount: 200000,
                      currentAmount: 80000,
                      percentage: 40,
                      deadline: '2025-12-31',
                      priority: 'high',
                    },
                  ].map((goal) => (
                    <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{goal.name}</h3>
                          <p className="text-sm text-gray-600">
                            ¥{goal.currentAmount.toLocaleString()} / ¥{goal.targetAmount.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          goal.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {goal.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{goal.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${goal.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Deadline: {goal.deadline}</span>
                        <span>Remaining: ¥{(goal.targetAmount - goal.currentAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 目标统计 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Goal Statistics</h2>
                
                <div className="space-y-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">3</p>
                    <p className="text-sm text-gray-600">Active Goals</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">¥133,000</p>
                    <p className="text-sm text-gray-600">Total Target Amount</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">¥133,000</p>
                    <p className="text-sm text-gray-600">Saved Amount</p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">56.8%</p>
                    <p className="text-sm text-gray-600">Average Completion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 