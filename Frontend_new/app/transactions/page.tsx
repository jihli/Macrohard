'use client'

import React, { useState, useMemo } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import TransactionCalendar from '@/components/transactions/TransactionCalendar'
import TransactionList from '@/components/transactions/TransactionList'
import { Transaction } from '@/types'

export default function TransactionsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // 模拟交易数据
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      userId: 'user1',
      amount: -45,
      type: 'expense',
      category: 'food',
      description: '星巴克咖啡',
      date: new Date('2024-01-15'),
      tags: ['咖啡', '早餐'],
      location: '星巴克',
    },
    {
      id: '2',
      userId: 'user1',
      amount: 15000,
      type: 'income',
      category: 'salary',
      description: '工资收入',
      date: new Date('2024-01-15'),
      tags: ['工资', '月薪'],
    },
    {
      id: '3',
      userId: 'user1',
      amount: -8,
      type: 'expense',
      category: 'transport',
      description: '地铁交通费',
      date: new Date('2024-01-15'),
      tags: ['交通', '地铁'],
      location: '地铁',
    },
    {
      id: '4',
      userId: 'user1',
      amount: -120,
      type: 'expense',
      category: 'shopping',
      description: '超市购物',
      date: new Date('2024-01-14'),
      tags: ['购物', '日用品'],
      location: '沃尔玛',
    },
    {
      id: '5',
      userId: 'user1',
      amount: -60,
      type: 'expense',
      category: 'entertainment',
      description: '电影票',
      date: new Date('2024-01-13'),
      tags: ['娱乐', '电影'],
      location: '万达影城',
    },
    {
      id: '6',
      userId: 'user1',
      amount: -200,
      type: 'expense',
      category: 'health',
      description: '医院检查',
      date: new Date('2024-01-12'),
      tags: ['医疗', '检查'],
      location: '人民医院',
    },
    {
      id: '7',
      userId: 'user1',
      amount: 5000,
      type: 'income',
      category: 'bonus',
      description: '年终奖金',
      date: new Date('2024-01-10'),
      tags: ['奖金', '年终'],
    },
    {
      id: '8',
      userId: 'user1',
      amount: -300,
      type: 'expense',
      category: 'housing',
      description: '房租',
      date: new Date('2024-01-05'),
      tags: ['住房', '房租'],
    },
    {
      id: '9',
      userId: 'user1',
      amount: -50,
      type: 'expense',
      category: 'utilities',
      description: '水电费',
      date: new Date('2024-01-05'),
      tags: ['水电', '账单'],
    },
    {
      id: '10',
      userId: 'user1',
      amount: 1000,
      type: 'income',
      category: 'freelance',
      description: '兼职收入',
      date: new Date('2024-01-08'),
      tags: ['兼职', '副业'],
    },
    // 添加一些未来日期的交易
    {
      id: '11',
      userId: 'user1',
      amount: -150,
      type: 'expense',
      category: 'shopping',
      description: '网购商品',
      date: new Date('2024-02-01'),
      tags: ['网购', '数码'],
    },
    {
      id: '12',
      userId: 'user1',
      amount: 15000,
      type: 'income',
      category: 'salary',
      description: '工资收入',
      date: new Date('2024-02-01'),
      tags: ['工资', '月薪'],
    },
    {
      id: '13',
      userId: 'user1',
      amount: -80,
      type: 'expense',
      category: 'entertainment',
      description: 'KTV消费',
      date: new Date('2024-02-03'),
      tags: ['娱乐', 'KTV'],
      location: '钱柜KTV',
    },
  ]

  // 根据选中日期过滤交易
  const filteredTransactions = useMemo(() => {
    if (!selectedDate) {
      return mockTransactions
    }
    
    return mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate.toDateString() === selectedDate.toDateString()
    })
  }, [selectedDate, mockTransactions])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleClearFilter = () => {
    setSelectedDate(undefined)
  }

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
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 日历组件 */}
              <div className="lg:col-span-1">
                <TransactionCalendar
                  transactions={mockTransactions}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDate}
                />
              </div>
              
              {/* 交易列表 */}
              <div className="lg:col-span-2">
                <TransactionList
                  transactions={filteredTransactions}
                  selectedDate={selectedDate}
                  onClearFilter={handleClearFilter}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 