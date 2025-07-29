'use client'

import React from 'react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            智能财富管理应用
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            专业的个人财富管理平台，帮助您实时追踪、分析和优化个人收支与投资组合
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              开始使用
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              了解更多
            </button>
          </div>
        </div>

        {/* 功能特性 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">预算管理</h3>
            <p className="text-gray-600 text-sm">
              智能预算规划，实时跟踪支出，自动优化建议
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">消费跟踪</h3>
            <p className="text-gray-600 text-sm">
              自动分类交易记录，支持多种导入方式
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">目标管理</h3>
            <p className="text-gray-600 text-sm">
              设置储蓄目标，实时跟踪进度，智能提醒
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">投资建议</h3>
            <p className="text-gray-600 text-sm">
              AI驱动的投资组合建议，个性化配置
            </p>
          </div>
        </div>

        {/* 数据可视化展示 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            数据可视化展示
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">预算进度</h3>
              <div className="space-y-4">
                {['餐饮', '交通', '购物', '娱乐', '住房'].map((category, index) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-16">{category}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${70 + index * 5}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12">
                      {70 + index * 5}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">投资组合</h3>
              <div className="space-y-3">
                {[
                  { name: '沪深300ETF', value: 25000, return: '+8.5%' },
                  { name: '债券基金A', value: 18000, return: '+4.2%' },
                  { name: '科技股组合', value: 15000, return: '+12.1%' },
                ].map((investment) => (
                  <div key={investment.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{investment.name}</p>
                      <p className="text-xs text-gray-500">¥{investment.value.toLocaleString()}</p>
                    </div>
                    <span className="text-sm font-medium text-green-600">{investment.return}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 技术栈 */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            技术栈
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Next.js 14', desc: 'React框架' },
              { name: 'TypeScript', desc: '类型安全' },
              { name: 'Tailwind CSS', desc: '样式框架' },
              { name: 'Recharts', desc: '图表库' },
              { name: 'Framer Motion', desc: '动画库' },
              { name: 'React Hook Form', desc: '表单处理' },
              { name: 'date-fns', desc: '日期处理' },
              { name: 'Heroicons', desc: '图标库' },
            ].map((tech) => (
              <div key={tech.name} className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 开始使用 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            准备开始您的财富管理之旅？
          </h2>
          <p className="text-gray-600 mb-6">
            立即体验智能财富管理，让您的财务目标更清晰
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            立即开始
          </button>
        </div>
      </div>
    </div>
  )
} 