'use client'

import React from 'react'
import { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  selectedDate?: Date
  onClearFilter: () => void
}

export default function TransactionList({ 
  transactions, 
  selectedDate, 
  onClearFilter 
}: TransactionListProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: '🍽️',
      transport: '🚗',
      shopping: '🛍️',
      entertainment: '🎬',
      health: '🏥',
      education: '📚',
      housing: '🏠',
      utilities: '⚡',
      insurance: '🛡️',
      investment: '📈',
      salary: '💰',
      bonus: '🎁',
      freelance: '💼',
      dividend: '📊',
      interest: '🏦',
      other: '📝'
    }
    return icons[category] || '📝'
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      food: '餐饮',
      transport: '交通',
      shopping: '购物',
      entertainment: '娱乐',
      health: '医疗',
      education: '教育',
      housing: '住房',
      utilities: '水电',
      insurance: '保险',
      investment: '投资',
      salary: '工资',
      bonus: '奖金',
      freelance: '兼职',
      dividend: '分红',
      interest: '利息',
      other: '其他'
    }
    return names[category] || '其他'
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {selectedDate ? `没有找到 ${formatDate(selectedDate)} 的交易记录` : '没有交易记录'}
          </h3>
          <p className="text-gray-500 mb-4">
            {selectedDate ? '尝试选择其他日期或清除筛选条件' : '开始添加您的第一笔交易记录'}
          </p>
          {selectedDate && (
            <button
              onClick={onClearFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              清除筛选
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedDate ? `${formatDate(selectedDate)} 的交易` : '所有交易'}
          </h2>
          <p className="text-gray-600 mt-1">
            共 {transactions.length} 笔交易
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedDate && (
            <button
              onClick={onClearFilter}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              清除筛选
            </button>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            添加交易
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">
                {getCategoryIcon(transaction.category)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span>{getCategoryName(transaction.category)}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                  {transaction.location && (
                    <>
                      <span>•</span>
                      <span>{transaction.location}</span>
                    </>
                  )}
                </div>
                {transaction.tags && transaction.tags.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    {transaction.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`font-semibold text-lg ${
                transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.amount > 0 ? '+' : ''}{formatAmount(transaction.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 统计信息 */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">总收入</p>
            <p className="text-lg font-semibold text-green-600">
              {formatAmount(transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">总支出</p>
            <p className="text-lg font-semibold text-red-600">
              {formatAmount(Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">净收入</p>
            <p className={`text-lg font-semibold ${
              transactions.reduce((sum, t) => sum + t.amount, 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatAmount(transactions.reduce((sum, t) => sum + t.amount, 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 