"use client";

import React from "react";

const news = [
  {
    id: "1",
    title: "央行宣布降息0.25个百分点，利好股市和债市",
    source: "财经网",
    publishedAt: "2小时前",
    category: "market",
    sentiment: "positive",
    summary:
      "中国人民银行今日宣布下调金融机构存款准备金率0.25个百分点，释放长期资金约5000亿元...",
  },
  {
    id: "2",
    title: "A股三大指数集体上涨，科技股领涨",
    source: "证券时报",
    publishedAt: "4小时前",
    category: "stocks",
    sentiment: "positive",
    summary: "今日A股市场表现强劲，三大指数集体上涨，其中创业板指涨幅超过2%...",
  },
  {
    id: "3",
    title: "房地产市场调控政策持续，房价趋于稳定",
    source: "经济参考报",
    publishedAt: "6小时前",
    category: "real-estate",
    sentiment: "neutral",
    summary: "最新数据显示，全国主要城市房价环比涨幅收窄，市场预期趋于理性...",
  },
  {
    id: "4",
    title: "美联储官员暗示可能暂停加息",
    source: "华尔街日报",
    publishedAt: "8小时前",
    category: "economy",
    sentiment: "positive",
    summary:
      "多位美联储官员在最新讲话中暗示，考虑到通胀压力缓解，可能暂停加息周期...",
  },
];

const categoryColors = {
  market: "bg-blue-100 text-blue-800",
  stocks: "bg-green-100 text-green-800",
  economy: "bg-purple-100 text-purple-800",
  crypto: "bg-orange-100 text-orange-800",
  "real-estate": "bg-indigo-100 text-indigo-800",
  bonds: "bg-gray-100 text-gray-800",
};

const sentimentColors = {
  positive: "text-green-600",
  negative: "text-red-600",
  neutral: "text-gray-600",
};

export default function FinancialNews() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">金融新闻</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          更多新闻
        </button>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {item.summary}
                </p>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      categoryColors[
                        item.category as keyof typeof categoryColors
                      ]
                    }`}
                  >
                    {item.category === "market" && "Market"}
                    {item.category === "stocks" && "Stocks"}
                    {item.category === "economy" && "Economy"}
                    {item.category === "crypto" && "Cryptocurrency"}
                    {item.category === "real-estate" && "Real Estate"}
                    {item.category === "bonds" && "Bonds"}
                  </span>
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-500">
                    {item.publishedAt}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <span
                  className={`text-xs font-medium ${
                    sentimentColors[
                      item.sentiment as keyof typeof sentimentColors
                    ]
                  }`}
                >
                  {item.sentiment === "positive" && "📈"}
                  {item.sentiment === "negative" && "📉"}
                  {item.sentiment === "neutral" && "➡️"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Read More
              </button>
              <div className="flex space-x-2">
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  收藏
                </button>
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  分享
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* News Subscription */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Subscribe to Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Market Trends",
            "Stock Analysis",
            "Economic Policies",
            "Real Estate",
            "Investment",
          ].map((topic) => (
            <button
              key={topic}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
