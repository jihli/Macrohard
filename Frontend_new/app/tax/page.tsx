'use client'

import React from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function TaxPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">税务预测</h1>
              <p className="text-gray-600 mt-2">预测和管理您的税务义务</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 税务概览 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">年度税务概览</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">年收入</p>
                      <p className="text-xl font-bold text-gray-900">¥182,400</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">预估税率</p>
                      <p className="text-xl font-bold text-blue-600">15%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">已缴税款</p>
                      <p className="text-xl font-bold text-gray-900">¥18,240</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">预估应缴</p>
                      <p className="text-xl font-bold text-green-600">¥27,360</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">差额</p>
                      <p className="text-xl font-bold text-gray-900">¥9,120</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">状态</p>
                      <p className="text-xl font-bold text-red-600">需补缴</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 税务减免 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">可申请减免</h2>
                
                <div className="space-y-4">
                  {[
                    { name: '住房贷款利息', amount: 12000, status: 'available' },
                    { name: '子女教育', amount: 8000, status: 'available' },
                    { name: '赡养老人', amount: 6000, status: 'available' },
                    { name: '继续教育', amount: 4000, status: 'pending' },
                    { name: '大病医疗', amount: 15000, status: 'unavailable' },
                  ].map((deduction) => (
                    <div key={deduction.name} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deduction.name}</p>
                        <p className="text-sm text-gray-600">最高减免 ¥{deduction.amount.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deduction.status === 'available' ? 'bg-green-100 text-green-800' :
                        deduction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deduction.status === 'available' ? '可申请' :
                         deduction.status === 'pending' ? '待确认' : '不可申请'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 税务建议 */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">税务优化建议</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">增加退休金缴纳</h3>
                  <p className="text-sm text-gray-600">
                    考虑增加个人养老金缴纳，可享受税前扣除，预计可节省税款 ¥2,400
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">慈善捐赠</h3>
                  <p className="text-sm text-gray-600">
                    通过慈善捐赠获得税前扣除，建议捐赠金额 ¥5,000，可节省税款 ¥750
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">投资损失抵扣</h3>
                  <p className="text-sm text-gray-600">
                    如有投资损失，可用于抵扣其他投资收益，建议咨询税务专家
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">年终奖优化</h3>
                  <p className="text-sm text-gray-600">
                    合理安排年终奖发放时间，避免税率跳档，预计可节省税款 ¥1,200
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