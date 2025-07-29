'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function TransactionsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">消费跟踪</h1>
              <p className="text-gray-600 mt-2">查看和管理您的所有交易记录</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">最近交易</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  添加交易
                </button>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    id: '1',
                    description: '星巴克咖啡',
                    amount: -45,
                    category: '餐饮',
                    date: '2024-01-15',
                    location: '星巴克',
                  },
                  {
                    id: '2',
                    description: '工资收入',
                    amount: 15000,
                    category: '工资',
                    date: '2024-01-15',
                  },
                  {
                    id: '3',
                    description: '地铁交通费',
                    amount: -8,
                    category: '交通',
                    date: '2024-01-15',
                    location: '地铁',
                  },
                  {
                    id: '4',
                    description: '超市购物',
                    amount: -120,
                    category: '购物',
                    date: '2024-01-14',
                    location: '沃尔玛',
                  },
                  {
                    id: '5',
                    description: '电影票',
                    amount: -60,
                    category: '娱乐',
                    date: '2024-01-13',
                    location: '万达影城',
                  },
                ].map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <span className={`text-sm font-medium ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}¥{Math.abs(transaction.amount)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">
                          {transaction.category} • {transaction.date}
                          {transaction.location && ` • ${transaction.location}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}¥{transaction.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 