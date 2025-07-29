'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function AIRecommendationsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">AI推荐</h1>
              <p className="text-gray-600 mt-2">基于您的财务状况提供个性化建议</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 投资建议 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">投资组合建议</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      title: '增加科技股配置',
                      description: '基于您的风险承受能力和市场趋势，建议将科技股配置比例从15%提升至25%',
                      confidence: 85,
                      impact: 'positive',
                      action: '立即调整',
                    },
                    {
                      id: '2',
                      title: '债券基金优化',
                      description: '当前债券基金收益率偏低，建议考虑转换至收益更高的债券基金产品',
                      confidence: 78,
                      impact: 'positive',
                      action: '查看详情',
                    },
                    {
                      id: '3',
                      title: '黄金配置建议',
                      description: '考虑到全球经济不确定性，建议增加5%的黄金配置作为避险资产',
                      confidence: 72,
                      impact: 'neutral',
                      action: '了解更多',
                    },
                  ].map((recommendation) => (
                    <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{recommendation.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recommendation.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          recommendation.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {recommendation.confidence}% 置信度
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{recommendation.description}</p>
                      
                      <div className="flex justify-between items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${recommendation.confidence}%` }}
                          ></div>
                        </div>
                        <button className="text-blue-600 text-sm hover:text-blue-700 font-medium">
                          {recommendation.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预算优化 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">预算优化建议</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      category: '餐饮支出',
                      current: 1200,
                      suggested: 1000,
                      savings: 200,
                      reason: '餐饮支出超出预算20%，建议减少外卖频率',
                    },
                    {
                      id: '2',
                      category: '娱乐支出',
                      current: 400,
                      suggested: 350,
                      savings: 50,
                      reason: '娱乐支出合理，可适当增加储蓄',
                    },
                    {
                      id: '3',
                      category: '交通支出',
                      current: 800,
                      suggested: 750,
                      savings: 50,
                      reason: '考虑拼车或公共交通，可节省交通费用',
                    },
                  ].map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{item.category}</h3>
                        <span className="text-sm text-green-600 font-medium">
                          可节省 ¥{item.savings}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>当前: ¥{item.current}</span>
                        <span>建议: ¥{item.suggested}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-3">{item.reason}</p>
                      
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        应用建议
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 智能提醒 */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">智能提醒</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm">📅</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">账单提醒</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    您的房租账单将在3天后到期，请及时支付 ¥2,500
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 text-sm">🎯</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">目标提醒</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    距离"欧洲旅行基金"目标还有3个月，建议增加储蓄
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 text-sm">📈</span>
                    </div>
                    <h3 className="font-semibold text-gray-900">投资机会</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    检测到新的投资机会，建议关注新能源板块
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 