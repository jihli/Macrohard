'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import InvestmentRadarChart from '@/components/dashboard/InvestmentRadarChart'

export default function InvestmentsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
              <p className="text-gray-600 mt-2">Manage your investment portfolio and asset allocation</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 投资概览 */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Investment Overview</h2>
                
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      name: 'CSI 300 ETF',
                      type: 'ETF',
                      amount: 25000,
                      shares: 1000,
                      currentPrice: 27.1,
                      purchasePrice: 25,
                      return: 8.5,
                      riskLevel: 'medium',
                    },
                    {
                      id: '2',
                      name: 'Bond Fund A',
                      type: 'Fund',
                      amount: 18000,
                      shares: 9000,
                      currentPrice: 2.08,
                      purchasePrice: 2,
                      return: 4.2,
                      riskLevel: 'low',
                    },
                    {
                      id: '3',
                      name: 'Tech Stock Portfolio',
                      type: 'Stock',
                      amount: 15000,
                      shares: 500,
                      currentPrice: 32.5,
                      purchasePrice: 29,
                      return: 12.1,
                      riskLevel: 'high',
                    },
                  ].map((investment) => (
                    <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{investment.name}</h3>
                          <p className="text-sm text-gray-600">
                            {investment.type} • {investment.shares} shares
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          investment.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                          investment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {investment.riskLevel === 'high' ? 'High Risk' :
                           investment.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Investment Amount</p>
                          <p className="font-medium">¥{investment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Price</p>
                          <p className="font-medium">¥{investment.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Return Rate</p>
                          <p className={`font-medium ${
                            investment.return > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {investment.return > 0 ? '+' : ''}{investment.return}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Current Value</p>
                          <p className="font-medium">
                            ¥{(investment.shares * investment.currentPrice).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Asset Allocation</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Stocks', percentage: 43, color: 'bg-blue-500' },
                      { name: 'Bonds', percentage: 31, color: 'bg-green-500' },
                      { name: 'Funds', percentage: 26, color: 'bg-purple-500' },
                    ].map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{asset.name}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${asset.color}`}
                              style={{ width: `${asset.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{asset.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 雷达图 */}
              <div className="lg:col-span-1">
                <InvestmentRadarChart 
                  riskLevel="medium"
                  currentAllocation={[
                    { type: 'Stocks', percentage: 43 },
                    { type: 'Bonds', percentage: 31 },
                    { type: 'ETF', percentage: 15 },
                    { type: 'Funds', percentage: 11 },
                    { type: 'Cryptocurrency', percentage: 0 },
                    { type: 'Real Estate', percentage: 0 },
                    { type: 'Others', percentage: 0 },
                  ]}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 