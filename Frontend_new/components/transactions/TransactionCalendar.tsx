'use client'

import React, { useState, useMemo } from 'react'
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

  // 获取日期样式
  const getDateStyles = (date: Date) => {
    const baseStyles = "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer"
    
    if (isSelectedDate(date)) {
      return `${baseStyles} bg-blue-600 text-white`
    }
    
    if (isToday(date)) {
      return `${baseStyles} bg-blue-100 text-blue-700 hover:bg-blue-200`
    }
    
    if (!isCurrentMonth(date)) {
      return `${baseStyles} text-gray-400 hover:bg-gray-100`
    }
    
    return `${baseStyles} text-gray-700 hover:bg-gray-100`
  }

  // 获取交易指示器样式
  const getTransactionIndicator = (date: Date) => {
    const count = getTransactionCount(date)
    const amount = getTransactionAmount(date)
    
    if (count === 0) return null
    
    const isPositive = amount > 0
    const indicatorColor = isPositive ? 'bg-green-500' : 'bg-red-500'
    
    return (
      <div className="flex items-center justify-center mt-1">
        <div className={`w-2 h-2 rounded-full ${indicatorColor}`} />
        {count > 1 && (
          <span className="text-xs text-gray-500 ml-1">+{count - 1}</span>
        )}
      </div>
    )
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

  const dayNames = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">交易日历</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <div key={index} className="relative">
            <div
              className={getDateStyles(date)}
              onClick={() => onDateSelect(date)}
            >
              {date.getDate()}
            </div>
            {getTransactionIndicator(date)}
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>收入</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>支出</span>
        </div>
      </div>
    </div>
  )
} 