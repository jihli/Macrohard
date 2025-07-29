'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'

const cards = [
  {
    title: '总资产',
    value: '¥125,680',
    change: '+12.5%',
    changeType: 'positive',
    icon: BanknotesIcon,
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
  },
  {
    title: '本月收入',
    value: '¥15,200',
    change: '+8.2%',
    changeType: 'positive',
    icon: ArrowTrendingUpIcon,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
  },
  {
    title: '本月支出',
    value: '¥8,450',
    change: '-3.1%',
    changeType: 'negative',
    icon: ArrowTrendingDownIcon,
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
  },
  {
    title: '储蓄率',
    value: '44.2%',
    change: '+2.8%',
    changeType: 'positive',
    icon: FlagIcon,
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
  },
]

export default function OverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900 mb-2">
                {card.value}
              </p>
              <div className="flex items-center space-x-1">
                <span
                  className={`text-sm font-medium ${
                    card.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
                <span className="text-sm text-gray-500">vs 上月</span>
              </div>
            </div>
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${card.color}`}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
} 