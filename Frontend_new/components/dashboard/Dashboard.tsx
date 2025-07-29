'use client'

import React from 'react'
import { motion } from 'framer-motion'
import OverviewCards from './OverviewCards'
import BudgetProgress from './BudgetProgress'
import RecentTransactions from './RecentTransactions'
import InvestmentSummary from './InvestmentSummary'
import GoalProgress from './GoalProgress'
import FinancialNews from './FinancialNews'
import AIRecommendations from './AIRecommendations'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">欢迎回来，张小明！</h1>
        <p className="text-blue-100">
          今天是 {new Date().toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </p>
      </motion.div>

      {/* 概览卡片 */}
      <OverviewCards />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧列 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 预算进度 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BudgetProgress />
          </motion.div>

          {/* 投资摘要 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <InvestmentSummary />
          </motion.div>

          {/* 目标进度 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GoalProgress />
          </motion.div>
        </div>

        {/* 右侧列 */}
        <div className="space-y-6">
          {/* 最近交易 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <RecentTransactions />
          </motion.div>

          {/* AI推荐 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIRecommendations />
          </motion.div>

          {/* 金融新闻 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FinancialNews />
          </motion.div>
        </div>
      </div>
    </div>
  )
} 