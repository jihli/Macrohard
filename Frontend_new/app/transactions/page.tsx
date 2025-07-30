'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import TransactionCalendar from '@/components/transactions/TransactionCalendar'
import TransactionList from '@/components/transactions/TransactionList'
import { Transaction } from '@/types'
import { transactionsApi } from '@/lib/api'

export default function TransactionsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 从API获取交易数据
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await transactionsApi.getTransactions()
        console.log(data);
        // 转换API数据格式以匹配Transaction类型
        const transformedTransactions: Transaction[] = data.transactions.map((item: any) => ({
          id: item.id.toString(),
          userId: item.user_id?.toString() || 'unknown',
          amount: parseFloat(item.amount),
          type: item.amount >= 0 ? 'income' : 'expense',
          category: item.category || 'other',
          description: item.description || '',
          date: new Date(item.date),
          tags: item.tags ? (Array.isArray(item.tags) ? item.tags : item.tags.split(',')) : [],
          location: item.location || undefined,
          receipt: item.receipt || undefined,
        }))
        
        setTransactions(transformedTransactions)
      } catch (err) {
        console.error('Failed to fetch transactions:', err)
        setError('Failed to load transactions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // 根据选中日期过滤交易
  const filteredTransactions = useMemo(() => {
    if (!selectedDate) {
      return transactions
    }
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate.toDateString() === selectedDate.toDateString()
    })
  }, [selectedDate, transactions])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handleClearFilter = () => {
    setSelectedDate(undefined)
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading transactions...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
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
                  transactions={transactions}
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