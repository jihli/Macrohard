'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { useApi } from '@/hooks/useApi'
import { budgetApi } from '@/lib/api'
import { ApiBudgetData, ApiBudgetCategory } from '@/types'

export default function BudgetPage() {
  const [newBudget, setNewBudget] = useState<string>('');
  const { data: budgetData, loading, error, refetch } = useApi<ApiBudgetData>(
    budgetApi.getBudgetData
  );
  const handleUpdateBudget = async () => {
    if (!budgetData || !newBudget) return;
    
    try {
      // 计算各分类的新预算分配（这里简化处理，实际应用中可能需要更复杂的逻辑）
      const updatedCategories = budgetData.categories.map(cat => ({
        ...cat,
        budgeted: (cat.budgeted / budgetData.monthlyBudget) * parseFloat(newBudget)
      }));
      
      await budgetApi.updateBudget({
        categories: updatedCategories
      });
      
      // 刷新数据
      refetch();
      alert('预算更新成功！');
    } catch (error) {
      alert('预算更新失败，请重试');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-gray-600">加载中...</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">加载失败: {error}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">预算管理</h1>
              <p className="text-gray-600 mt-2">管理您的月度预算和支出分类</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 预算概览 */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">预算概览</h2>
                <div className="space-y-4">
                  {budgetData?.categories?.map((item) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.category}</span>
                          <span className="text-sm text-gray-600">
                            ¥{item.spent?.toFixed(2)} / ¥{item.budgeted?.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.percentage > 90 ? 'bg-red-500' : 
                              item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预算设置 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">预算设置</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      月度总预算
                    </label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="输入预算金额"
                      value={newBudget || budgetData?.monthlyBudget?.toString() || ''}
                      onChange={(e) => setNewBudget(e.target.value)}
                    />
                  </div>
                  {budgetData && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>总支出: ¥{budgetData.totalSpent?.toFixed(2)}</div>
                      <div>剩余预算: ¥{budgetData.totalRemaining?.toFixed(2)}</div>
                      <div>完成度: {budgetData.overallPercentage?.toFixed(1)}%</div>
                    </div>
                  )}
                  <button 
                    onClick={handleUpdateBudget}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    更新预算
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 