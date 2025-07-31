'use client'

import React from 'react'

const recommendations = [
  {
    id: '1',
    type: 'saving',
    title: 'Optimize Dining Expenses',
    description: 'Based on your spending patterns, we recommend adjusting your dining budget from ¥1500 to ¥1200, saving ¥300 per month.',
    priority: 'high',
    estimatedImpact: 300,
    actionItems: ['Reduce takeout frequency', 'Create weekly grocery plan', 'Look for coupons'],
    icon: '🍽️',
  },
  {
    id: '2',
    type: 'investment',
    title: 'Increase Investment Allocation',
    description: 'Your savings rate is high. Consider allocating some funds to equity funds for better long-term returns.',
    priority: 'medium',
    estimatedImpact: 1200,
    actionItems: ['Research equity funds', 'Diversify investment risks', 'Regular fixed-amount investing'],
    icon: '📈',
  },
  {
    id: '3',
    type: 'budget',
    title: 'Adjust Budget Allocation',
    description: 'Entertainment spending exceeds budget by 20%. Consider reallocating budget or finding more economical entertainment options.',
    priority: 'medium',
    estimatedImpact: 200,
    actionItems: ['Find free entertainment activities', 'Set entertainment budget', 'Use discount coupons'],
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
       <h3 className="text-lg font-semibold text-gray-900">AI Smart Recommendations</h3>
       <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
         Refresh Recommendations
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
                   {recommendation.type === 'saving' && 'Saving'}
                   {recommendation.type === 'investment' && 'Investment'}
                   {recommendation.type === 'budget' && 'Budget'}
                   {recommendation.type === 'tax' && 'Tax'}
                 </span>
                 <span
                   className={`px-2 py-1 text-xs font-medium rounded-full ${
                     priorityColors[recommendation.priority as keyof typeof priorityColors]
                   }`}
                 >
                   {recommendation.priority === 'high' ? 'High Priority' : recommendation.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
                 </span>
               </div>
               <p className="text-xs text-gray-600 mb-3">{recommendation.description}</p>
              
               {/* Expected Impact */}
               <div className="flex items-center space-x-4 mb-3">
                 <div className="flex items-center space-x-1">
                   <span className="text-xs text-gray-500">Expected Impact:</span>
                   <span className="text-xs font-medium text-green-600">
                     +¥{recommendation.estimatedImpact.toLocaleString()}/month
                   </span>
                 </div>
               </div>

               {/* Action Items */}
               <div className="mb-3">
                 <p className="text-xs text-gray-500 mb-2">Recommended Actions:</p>
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

               {/* Action Buttons */}
               <div className="flex space-x-2">
                 <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                   Accept Recommendation
                 </button>
                 <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                   Remind Later
                 </button>
                 <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                   Ignore
                 </button>
               </div>
             </div>
           </div>
         </div>
       ))}
     </div>

     {/* AI Status */}
     <div className="mt-6 pt-4 border-t border-gray-200">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
           <span className="text-xs text-gray-600">AI Analysis Engine Running Normally</span>
         </div>
         <span className="text-xs text-gray-500">Real-time analysis based on your data</span>
       </div>
     </div>
   </div>
 )
}

