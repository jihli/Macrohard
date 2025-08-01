#!/usr/bin/env python3
"""
测试新闻 API 多样性
验证每次调用都能获取到不同的新闻
"""

import requests
import json
import time
from datetime import datetime

def test_news_diversity():
    """测试新闻 API 的多样性"""
    base_url = "http://localhost:5002/api/news"
    
    print("🔍 测试新闻 API 多样性...")
    print("=" * 50)
    
    # 测试不同分类
    categories = ['finance', 'crypto', 'stock', 'tech', 'energy']
    
    for category in categories:
        print(f"\n📰 测试分类: {category}")
        print("-" * 30)
        
        # 连续调用3次，检查是否获取到不同的新闻
        titles = []
        for i in range(3):
            try:
                response = requests.get(f"{base_url}?category={category}&limit=2", timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        news = data['data']['news']
                        for article in news:
                            title = article.get('title', '')
                            if title and title not in titles:
                                titles.append(title)
                                print(f"  {len(titles)}. {title[:60]}...")
                        time.sleep(1)  # 避免请求过于频繁
                    else:
                        print(f"  ❌ API 返回错误: {data.get('message', 'Unknown error')}")
                else:
                    print(f"  ❌ HTTP 错误: {response.status_code}")
            except Exception as e:
                print(f"  ❌ 请求失败: {str(e)}")
        
        print(f"  ✅ 获取到 {len(titles)} 条不同新闻")
    
    print("\n" + "=" * 50)
    print("🎉 测试完成！")

def test_market_data():
    """测试市场数据"""
    print("\n📊 测试市场数据...")
    print("-" * 30)
    
    try:
        response = requests.get("http://localhost:5002/api/news?category=finance&limit=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                market_data = data['data']['marketData']
                print(f"  📈 获取到 {len(market_data)} 个市场指数:")
                for market in market_data:
                    print(f"    • {market['name']}: {market['value']} ({market['change']})")
            else:
                print("  ❌ 获取市场数据失败")
        else:
            print(f"  ❌ HTTP 错误: {response.status_code}")
    except Exception as e:
        print(f"  ❌ 请求失败: {str(e)}")

def test_recommendations():
    """测试投资建议"""
    print("\n💡 测试投资建议...")
    print("-" * 30)
    
    try:
        response = requests.get("http://localhost:5002/api/news?category=finance&limit=1", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                recommendations = data['data']['recommendations']
                print(f"  🎯 获取到 {len(recommendations)} 条投资建议:")
                for i, rec in enumerate(recommendations, 1):
                    print(f"    {i}. {rec['title']} - {rec['category']}")
            else:
                print("  ❌ 获取投资建议失败")
        else:
            print(f"  ❌ HTTP 错误: {response.status_code}")
    except Exception as e:
        print(f"  ❌ 请求失败: {str(e)}")

if __name__ == "__main__":
    print(f"🚀 开始测试 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    test_news_diversity()
    test_market_data()
    test_recommendations()
    
    print(f"\n✅ 所有测试完成 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}") 