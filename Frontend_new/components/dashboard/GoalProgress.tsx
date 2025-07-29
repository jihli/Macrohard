'use client'

import React from 'react'
import { format, differenceInDays } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const goals = [
  {
    id: '1',
    name: '紧急备用金',
    targetAmount: 50000,
    currentAmount: 35000,
    deadline: new Date('2024-06-30'),
    type: 'emergency',
    priority: 'high',
    icon: '🛡️',
  },
  {
    id: '2',
    name: '欧洲旅行基金',
    targetAmount: 30000,
    currentAmount: 18000,
    deadline: new Date('2024-09-15'),
    type: 'travel',
    priority: 'medium',
    icon: '✈️',
  },
  {
    id: '3',
    name: '购房首付',
    targetAmount: 200000,
    currentAmount: 45000,
    deadline: new Date('2025-12-31'),
    type: 'house',
    priority: 'high',
    icon: '🏠',
  },
]

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}

const typeColors = {
  emergency: 'bg-red-500',
  travel: 'bg-blue-500',
  house: 'bg-purple-500',
  car: 'bg-green-500',
  education: 'bg-indigo-500',
  retirement: 'bg-orange-500',
}

export default function GoalProgress() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">储蓄目标</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          添加目标
        </button>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          const daysRemaining = differenceInDays(goal.deadline, new Date())
          const isOverdue = daysRemaining < 0

          return (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{goal.icon}</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{goal.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          priorityColors[goal.priority as keyof typeof priorityColors]
                        }`}
                      >
                        {goal.priority === 'high' ? '高优先级' : goal.priority === 'medium' ? '中优先级' : '低优先级'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {isOverdue ? '已逾期' : `${daysRemaining}天剩余`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ¥{goal.currentAmount.toLocaleString()} / ¥{goal.targetAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    目标日期: {format(goal.deadline, 'yyyy年MM月dd日', { locale: zhCN })}
                  </p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">进度</span>
                  <span className="text-xs font-medium text-gray-900">{progress.toFixed(1)}%</span>
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
                  还需 ¥{(goal.targetAmount - goal.currentAmount).toLocaleString()}
                </span>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                    更新进度
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 目标统计 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-600">进行中</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">¥98,000</p>
            <p className="text-xs text-gray-600">已储蓄</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">¥280,000</p>
            <p className="text-xs text-gray-600">总目标</p>
          </div>
        </div>
      </div>
    </div>
  )
} 