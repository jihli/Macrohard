'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function NewsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">金融新闻</h1>
              <p className="text-gray-600 mt-2">获取最新的金融市场动态和投资机会</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 热门新闻 */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">热门新闻</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      id: '1',
                      title: '央行宣布降息0.25个百分点，释放流动性信号',
                      summary: '中国人民银行今日宣布下调金融机构存款准备金率0.25个百分点，预计释放长期资金约5000亿元...',
                      source: '财经网',
                      time: '2小时前',
                      category: '货币政策',
                      impact: 'positive',
                    },
                    {
                      id: '2',
                      title: 'A股三大指数集体上涨，科技股领涨',
                      summary: '今日A股市场表现强劲，三大指数集体上涨。其中，创业板指涨幅超过2%，科技股表现突出...',
                      source: '证券时报',
                      time: '4小时前',
                      category: '股市动态',
                      impact: 'positive',
                    },
                    {
                      id: '3',
                      title: '房地产调控政策持续，一线城市房价稳中有降',
                      summary: '最新数据显示，一线城市房价呈现稳中有降趋势，调控政策效果逐步显现...',
                      source: '经济参考报',
                      time: '6小时前',
                      category: '房地产',
                      impact: 'neutral',
                    },
                    {
                      id: '4',
                      title: '新能源汽车销量创新高，产业链投资机会显现',
                      summary: '今年前11个月，新能源汽车销量同比增长35%，产业链相关投资机会值得关注...',
                      source: '第一财经',
                      time: '8小时前',
                      category: '新能源',
                      impact: 'positive',
                    },
                  ].map((news) => (
                    <div key={news.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          news.impact === 'positive' ? 'bg-green-100 text-green-800' :
                          news.impact === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {news.category}
                        </span>
                        <span className="text-xs text-gray-500">{news.time}</span>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{news.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{news.summary}</p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">来源: {news.source}</span>
                        <button className="text-blue-600 text-sm hover:text-blue-700">
                          阅读全文
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 市场数据 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">市场数据</h2>
                
                <div className="space-y-4">
                  {[
                    { name: '上证指数', value: '3,245.67', change: '+1.2%', trend: 'up' },
                    { name: '深证成指', value: '10,234.56', change: '+0.8%', trend: 'up' },
                    { name: '创业板指', value: '2,156.78', change: '+2.1%', trend: 'up' },
                    { name: '美元指数', value: '102.45', change: '-0.3%', trend: 'down' },
                    { name: '黄金价格', value: '1,987.50', change: '+0.5%', trend: 'up' },
                    { name: '原油价格', value: '78.90', change: '-1.2%', trend: 'down' },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">{item.value}</p>
                      </div>
                      <span className={`font-semibold ${
                        item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.change}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">投资建议</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">关注科技股</p>
                      <p className="text-xs text-gray-600">政策支持力度加大，建议关注人工智能、芯片等板块</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">债券配置</p>
                      <p className="text-xs text-gray-600">降息预期下，建议适当增加债券配置比例</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">黄金投资</p>
                      <p className="text-xs text-gray-600">避险情绪升温，黄金配置价值凸显</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 