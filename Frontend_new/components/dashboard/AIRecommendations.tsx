'use client'

import React from 'react'

const recommendations = [
 {
   id: '1',
   type: 'saving',
   title: '优化餐饮支出',
   description: '根据您的消费模式，建议将餐饮预算从1500元调整至1200元，每月可节省300元。',
   priority: 'high',
   estimatedImpact: 300,
   actionItems: ['减少外卖频率', '制定每周买菜计划', '寻找优惠券'],
   icon: '🍽️',
 },
 {
   id: '2',
   type: 'investment',
   title: '增加投资配置',
   description: '当前储蓄率较高，建议将部分资金配置到股票型基金，提高长期收益。',
   priority: 'medium',
   estimatedImpact: 1200,
   actionItems: ['研究股票型基金', '分散投资风险', '定期定额投资'],
   icon: '📈',
 },
 {
   id: '3',
   type: 'budget',
   title: '调整预算分配',
   description: '娱乐支出超出预算20%，建议重新分配预算或寻找更经济的娱乐方式。',
   priority: 'medium',
   estimatedImpact: 200,
   actionItems: ['寻找免费娱乐活动', '制定娱乐预算', '使用优惠券'],
   icon: '🎯',
 },
]

const typeColors = {
 saving: 'bg-green-100 text-green-800',
 investment: 'bg-blue-100 text-blue-800',
 budget: 'bg-purple-100 text-purple-800',
 tax: 'bg-orange-100 text-orange-800',
}

const priorityColors = {
 high: 'bg-red-100 text-red-800',
 medium: 'bg-yellow-100 text-yellow-800',
 low: 'bg-green-100 text-green-800',
}

export default function AIRecommendations() {
 return (
   <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
     <div className="flex items-center justify-between mb-6">
       <h3 className="text-lg font-semibold text-gray-900">AI智能推荐</h3>
       <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
         刷新推荐
       </button>
     </div>

     <div className="space-y-4">
       {recommendations.map((recommendation) => (
         <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4">
           <div className="flex items-start space-x-3 mb-3">
             <div className="text-2xl">{recommendation.icon}</div>
             <div className="flex-1">
               <div className="flex items-center space-x-2 mb-2">
                 <h4 className="text-sm font-medium text-gray-900">{recommendation.title}</h4>
                 <span
                   className={`px-2 py-1 text-xs font-medium rounded-full ${
                     typeColors[recommendation.type as keyof typeof typeColors]
                   }`}
                 >
                   {recommendation.type === 'saving' && '节流'}
                   {recommendation.type === 'investment' && '投资'}
                   {recommendation.type === 'budget' && '预算'}
                   {recommendation.type === 'tax' && '税务'}
                 </span>
                 <span
                   className={`px-2 py-1 text-xs font-medium rounded-full ${
                     priorityColors[recommendation.priority as keyof typeof priorityColors]
                   }`}
                 >
                   {recommendation.priority === 'high' ? '高优先级' : recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
                 </span>
               </div>
               <p className="text-xs text-gray-600 mb-3">{recommendation.description}</p>
              
               {/* 预期影响 */}
               <div className="flex items-center space-x-4 mb-3">
                 <div className="flex items-center space-x-1">
                   <span className="text-xs text-gray-500">预期影响:</span>
                   <span className="text-xs font-medium text-green-600">
                     +¥{recommendation.estimatedImpact.toLocaleString()}/月
                   </span>
                 </div>
               </div>

               {/* 行动项目 */}
               <div className="mb-3">
                 <p className="text-xs text-gray-500 mb-2">建议行动:</p>
                 <div className="flex flex-wrap gap-1">
                   {recommendation.actionItems.map((item, index) => (
                     <span
                       key={index}
                       className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                     >
                       {item}
                     </span>
                   ))}
                 </div>
               </div>

               {/* 操作按钮 */}
               <div className="flex space-x-2">
                 <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                   采纳建议
                 </button>
                 <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                   稍后提醒
                 </button>
                 <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                   忽略
                 </button>
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>

     {/* AI状态 */}
     <div className="mt-6 pt-4 border-t border-gray-200">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
           <span className="text-xs text-gray-600">AI分析引擎运行正常</span>
         </div>
         <span className="text-xs text-gray-500">基于您的数据实时分析</span>
       </div>
     </div>
   </div>
 )
}

