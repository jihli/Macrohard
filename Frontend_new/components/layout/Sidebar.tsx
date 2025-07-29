'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ChartBarIcon,
  CreditCardIcon,
  FlagIcon,
  BuildingLibraryIcon,
  DocumentTextIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const navigation = [
  { name: '仪表板', href: '/', icon: HomeIcon },
  { name: '预算管理', href: '/budget', icon: ChartBarIcon },
  { name: '消费跟踪', href: '/transactions', icon: CreditCardIcon },
  { name: '目标管理', href: '/goals', icon: FlagIcon },
  { name: '投资组合', href: '/investments', icon: BuildingLibraryIcon },
  { name: '税务预测', href: '/tax', icon: DocumentTextIcon },
  { name: '金融新闻', href: '/news', icon: NewspaperIcon },
  { name: 'AI推荐', href: '/ai-recommendations', icon: Cog6ToothIcon },
  { name: '个人设置', href: '/profile', icon: UserIcon },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      className="bg-white shadow-lg border-r border-gray-200 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WM</span>
            </div>
            <span className="text-xl font-bold text-gray-900">财富管理</span>
          </motion.div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">张</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1"
            >
              <p className="text-sm font-medium text-gray-900">张小明</p>
              <p className="text-xs text-gray-500">高级用户</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
} 