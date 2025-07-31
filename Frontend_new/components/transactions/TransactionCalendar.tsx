'use client'

import React, { useState, useMemo } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Transaction } from '@/types'

interface TransactionCalendarProps {
  transactions: Transaction[]
  onDateSelect: (date: Date) => void
  selectedDate?: Date
}

export default function TransactionCalendar({ 
  transactions, 
  onDateSelect, 
  selectedDate 
}: TransactionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 获取当前月份的第一天和最后一天
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  
  // 获取日历开始日期（包括上个月的日期）
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay())
  
  // 生成日历网格
  const calendarDays = useMemo(() => {
    const days = []
    const currentDate = new Date(startDate)
    
    // 生成42天（6周）的日历网格
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }, [startDate])

  // 按日期分组交易
  const transactionsByDate = useMemo(() => {
    const grouped: Record<string, Transaction[]> = {}
    
    transactions.forEach(transaction => {
      const dateKey = transaction.date.toISOString().split('T')[0]
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(transaction)
    })
    
    return grouped
  }, [transactions])

  // 获取指定日期的交易数量
  const getTransactionCount = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    return transactionsByDate[dateKey]?.length || 0
  }

  // 获取指定日期的交易总金额
  const getTransactionAmount = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0]
    const dayTransactions = transactionsByDate[dateKey] || []
    return dayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0)
  }

  // 判断是否为今天
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 判断是否为当前月份
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear()
  }

  // 判断是否为选中日期
  const isSelectedDate = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  // 判断是否为同一天
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString()
  }

  // 判断是否为同一月
  const isSameMonth = (date1: Date, date2: Date) => {
    return date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear()
  }

  // 获取交易总金额（用于显示收入/支出）
  const getTransactionTotal = (date: Date) => {
    return getTransactionAmount(date)
  }

  // 月份导航
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth)
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]
  
  const dayNames = [
    '日', '一', '二', '三', '四', '五', '六'
  ]
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Transactions Calendar</h2>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
          </button>
          <h3 className="text-lg font-medium">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            This Month
          </button>
          <button
            onClick={() => onDateSelect(new Date())}
            className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Clear Filter
          </button>
        </div>
      </div>
      
      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {dayNames.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`relative rounded-lg p-2 hover:bg-gray-100 transition-colors cursor-pointer ${
              isToday(day) ? 'bg-blue-100 text-blue-800' : ''
            } ${
              isCurrentMonth(day) ? 'text-gray-800' : 'text-gray-400'
            } ${
              isSelectedDate(day) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onDateSelect(day)}
          >
            <div className="text-center text-sm font-medium">{day.getDate()}</div>
            <div className="flex justify-center mt-1">
              {getTransactionCount(day) > 0 && (
                <div className="flex items-center space-x-1">
                  {getTransactionTotal(day) > 0 ? (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  {getTransactionCount(day) > 1 && (
                    <span className="text-xs text-gray-500">+{getTransactionCount(day) - 1}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 图例 */}
      <div className="mt-6 flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Income</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Expense</span>
        </div>
      </div>
    </div>
  )
}