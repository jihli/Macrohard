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
              <h1 className="text-3xl font-bold text-gray-900">Financial News</h1>
              <p className="text-gray-600 mt-2">Get the latest financial market updates and investment opportunities</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 热门新闻 */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Hot News</h2>
                
                <div className="space-y-6">
                  {[
                    {
                      id: '1',
                      title: 'Central Bank Announces 0.25% Interest Rate Cut, Signaling Liquidity Release',
                      summary: 'The People\'s Bank of China announced today a reduction in the reserve requirement ratio by 0.25 percentage points, expected to release approximately 500 billion yuan in long-term funds...',
                      source: 'Finance Network',
                      time: '2 hours ago',
                      category: 'Monetary Policy',
                      impact: 'positive',
                    },
                    {
                      id: '2',
                      title: 'A-Share Major Indices Rise Collectively, Tech Stocks Lead Gains',
                      summary: 'Today\'s A-share market performed strongly, with all three major indices rising collectively. The Growth Enterprise Market Index rose by more than 2%, with tech stocks performing prominently...',
                      source: 'Securities Times',
                      time: '4 hours ago',
                      category: 'Stock Market',
                      impact: 'positive',
                    },
                    {
                      id: '3',
                      title: 'Real Estate Control Policies Continue, First-Tier City Prices Stable with Slight Decline',
                      summary: 'Latest data shows that first-tier city real estate prices are showing a stable trend with slight declines, and the effects of control policies are gradually becoming apparent...',
                      source: 'Economic Reference',
                      time: '6 hours ago',
                      category: 'Real Estate',
                      impact: 'neutral',
                    },
                    {
                      id: '4',
                      title: 'New Energy Vehicle Sales Hit Record High, Supply Chain Investment Opportunities Emerge',
                      summary: 'In the first 11 months of this year, new energy vehicle sales increased by 35% year-on-year, and supply chain-related investment opportunities are worth attention...',
                      source: 'Yicai',
                      time: '8 hours ago',
                      category: 'New Energy',
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
                        <span className="text-xs text-gray-500">Source: {news.source}</span>
                        <button className="text-blue-600 text-sm hover:text-blue-700">
                          Read More
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 市场数据 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Data</h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'Shanghai Composite', value: '3,245.67', change: '+1.2%', trend: 'up' },
                    { name: 'Shenzhen Component', value: '10,234.56', change: '+0.8%', trend: 'up' },
                    { name: 'ChiNext Index', value: '2,156.78', change: '+2.1%', trend: 'up' },
                    { name: 'US Dollar Index', value: '102.45', change: '-0.3%', trend: 'down' },
                    { name: 'Gold Price', value: '1,987.50', change: '+0.5%', trend: 'up' },
                    { name: 'Oil Price', value: '78.90', change: '-1.2%', trend: 'down' },
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
                  <h3 className="font-semibold text-gray-900 mb-3">Investment Advice</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Focus on Tech Stocks</p>
                      <p className="text-xs text-gray-600">Policy support is increasing, recommend focusing on AI, chip and other sectors</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Bond Allocation</p>
                      <p className="text-xs text-gray-600">Under interest rate cut expectations, recommend moderately increasing bond allocation ratio</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-900 font-medium">Gold Investment</p>
                      <p className="text-xs text-gray-600">Risk-averse sentiment is rising, highlighting the allocation value of gold</p>
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