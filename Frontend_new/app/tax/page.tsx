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
              <h1 className="text-3xl font-bold text-gray-900">Tax Prediction</h1>
              <p className="text-gray-600 mt-2">Predict and manage your tax obligations</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 税务概览 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Annual Tax Overview</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Annual Income</p>
                      <p className="text-xl font-bold text-gray-900">¥182,400</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Tax Rate</p>
                      <p className="text-xl font-bold text-blue-600">15%</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Tax Paid</p>
                      <p className="text-xl font-bold text-gray-900">¥18,240</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Estimated Due</p>
                      <p className="text-xl font-bold text-green-600">¥27,360</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Difference</p>
                      <p className="text-xl font-bold text-gray-900">¥9,120</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="text-xl font-bold text-red-600">Payment Due</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 税务减免 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Available Deductions</h2>
                
                <div className="space-y-4">
                  {[
                    { name: 'Mortgage Interest', amount: 12000, status: 'available' },
                    { name: 'Child Education', amount: 8000, status: 'available' },
                    { name: 'Elderly Care', amount: 6000, status: 'available' },
                    { name: 'Continuing Education', amount: 4000, status: 'pending' },
                    { name: 'Medical Expenses', amount: 15000, status: 'unavailable' },
                  ].map((deduction) => (
                    <div key={deduction.name} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{deduction.name}</p>
                        <p className="text-sm text-gray-600">Max deduction ¥{deduction.amount.toLocaleString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        deduction.status === 'available' ? 'bg-green-100 text-green-800' :
                        deduction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {deduction.status === 'available' ? 'Available' :
                         deduction.status === 'pending' ? 'Pending' : 'Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 税务建议 */}
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax Optimization Suggestions</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Increase Retirement Contributions</h3>
                  <p className="text-sm text-gray-600">
                    Consider increasing personal pension contributions for pre-tax deductions, estimated tax savings ¥2,400
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Charitable Donations</h3>
                  <p className="text-sm text-gray-600">
                    Get pre-tax deductions through charitable donations, recommended amount ¥5,000, tax savings ¥750
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Investment Loss Offset</h3>
                  <p className="text-sm text-gray-600">
                    If there are investment losses, they can be used to offset other investment gains, consult a tax expert
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Year-end Bonus Optimization</h3>
                  <p className="text-sm text-gray-600">
                    Properly arrange year-end bonus distribution timing to avoid tax bracket jumps, estimated savings ¥1,200
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