# backend/modules/news/controller.py

from flask import Blueprint, jsonify, request, current_app
import requests
import json
from datetime import datetime, timedelta
import random

bp = Blueprint('news', __name__)

@bp.route('', methods=['GET'])
def get_news():
    """
    GET /api/news
    获取最新的金融新闻和市场数据
    """
    try:
        # 获取查询参数
        category = request.args.get('category', 'finance')
        limit = int(request.args.get('limit', 10))
        
        # 限制最大返回数量
        limit = min(limit, 50)
        
        # 1) 获取新闻数据
        news_data = fetch_news_data(category, limit)
        
        # 2) 获取市场数据
        market_data = fetch_market_data()
        
        # 3) 生成投资建议
        recommendations = generate_recommendations(news_data, market_data)
        
        return jsonify({
            "success": True,
            "data": {
                "news": news_data,
                "marketData": market_data,
                "recommendations": recommendations
            },
            "message": "金融新闻获取成功"
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"获取新闻失败: {str(e)}"
        }), 500


def fetch_news_data(category, limit):
    """获取新闻数据"""
    try:
        # 使用 NewsAPI.org (免费开源API)
        # 注意：实际使用时需要注册获取API key
        api_key = "demo"  # 演示用，实际需要真实API key
        base_url = "https://newsapi.org/v2/everything"
        
        # 构建查询参数
        query = get_query_by_category(category)
        
        params = {
            'q': query,
            'language': 'zh',  # 中文新闻
            'sortBy': 'publishedAt',
            'pageSize': limit,
            'apiKey': api_key
        }
        
        # 如果API key是demo，使用模拟数据
        if api_key == "demo":
            return generate_mock_news(category, limit)
        
        response = requests.get(base_url, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        
        if data.get('status') != 'ok':
            # 如果API调用失败，使用模拟数据
            return generate_mock_news(category, limit)
        
        # 转换API响应格式
        news_list = []
        for article in data.get('articles', []):
            news_item = {
                "id": str(len(news_list) + 1),
                "title": article.get('title', ''),
                "summary": article.get('description', '')[:200] + '...' if article.get('description') else '',
                "source": article.get('source', {}).get('name', '未知来源'),
                "time": article.get('publishedAt', ''),
                "category": get_news_category(article.get('title', ''), article.get('description', '')),
                "impact": analyze_sentiment(article.get('title', ''), article.get('description', ''))
            }
            news_list.append(news_item)
        
        return news_list
        
    except Exception as e:
        # 如果API调用失败，返回模拟数据
        return generate_mock_news(category, limit)


def fetch_market_data():
    """获取市场数据"""
    try:
        # 使用 Alpha Vantage API 获取股票数据
        # 注意：实际使用时需要注册获取API key
        api_key = "demo"  # 演示用，实际需要真实API key
        
        if api_key == "demo":
            return generate_mock_market_data()
        
        # 获取主要指数数据
        indices = ['^GSPC', '^DJI', '^IXIC', '000001.SS']  # S&P500, 道琼斯, 纳斯达克, 上证指数
        
        market_data = []
        for index in indices:
            url = f"https://www.alphavantage.co/query"
            params = {
                'function': 'GLOBAL_QUOTE',
                'symbol': index,
                'apikey': api_key
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                quote = data.get('Global Quote', {})
                
                if quote:
                    market_item = {
                        "name": get_index_name(index),
                        "value": quote.get('05. price', '0'),
                        "change": quote.get('10. change percent', '0%'),
                        "trend": "up" if float(quote.get('09. change', 0)) > 0 else "down"
                    }
                    market_data.append(market_item)
        
        return market_data if market_data else generate_mock_market_data()
        
    except Exception as e:
        return generate_mock_market_data()


def generate_mock_news(category, limit):
    """生成模拟新闻数据"""
    news_templates = {
        'finance': [
            {
                "title": "央行宣布降息0.25个百分点，释放流动性信号",
                "summary": "中国人民银行今日宣布下调金融机构存款准备金率0.25个百分点，预计释放长期资金约5000亿元，进一步支持实体经济发展。",
                "source": "财经网",
                "category": "货币政策",
                "impact": "positive"
            },
            {
                "title": "A股三大指数集体上涨，科技股表现亮眼",
                "summary": "今日A股市场表现强劲，上证指数、深证成指、创业板指均实现上涨，其中科技股板块涨幅居前，人工智能概念股表现活跃。",
                "source": "证券时报",
                "category": "股市动态",
                "impact": "positive"
            },
            {
                "title": "人民币汇率企稳回升，外汇储备增加",
                "summary": "近期人民币汇率呈现企稳回升态势，外汇储备连续增长，显示中国经济基本面稳健，国际投资者信心增强。",
                "source": "金融时报",
                "category": "汇率动态",
                "impact": "positive"
            },
            {
                "title": "新能源汽车销量创新高，产业链投资机会显现",
                "summary": "今年新能源汽车销量持续增长，多家车企发布亮眼财报，产业链上下游投资机会逐渐显现，建议关注相关板块。",
                "source": "投资快报",
                "category": "行业分析",
                "impact": "positive"
            },
            {
                "title": "房地产市场调控政策持续优化",
                "summary": "各地陆续出台房地产支持政策，包括降低首付比例、放宽限购等措施，市场预期逐步改善，但投资仍需谨慎。",
                "source": "经济参考报",
                "category": "房地产",
                "impact": "neutral"
            }
        ],
        'crypto': [
            {
                "title": "比特币价格突破关键阻力位，市场情绪转暖",
                "summary": "比特币价格今日突破重要技术阻力位，成交量明显放大，市场情绪转暖，但投资者仍需注意风险控制。",
                "source": "币世界",
                "category": "加密货币",
                "impact": "positive"
            },
            {
                "title": "以太坊2.0升级进展顺利，质押收益稳定",
                "summary": "以太坊2.0升级持续推进，质押参与度不断提高，年化收益率保持在稳定水平，为投资者提供新的投资选择。",
                "source": "金色财经",
                "category": "区块链",
                "impact": "positive"
            }
        ],
        'stock': [
            {
                "title": "科技股领涨美股，纳斯达克指数创新高",
                "summary": "美国科技股表现强劲，纳斯达克综合指数创下历史新高，主要科技公司财报超预期，推动市场上涨。",
                "source": "华尔街日报",
                "category": "美股动态",
                "impact": "positive"
            },
            {
                "title": "中概股集体反弹，投资者信心恢复",
                "summary": "中概股今日集体反弹，多家公司股价涨幅超过10%，显示投资者对中国企业信心逐步恢复。",
                "source": "彭博社",
                "category": "中概股",
                "impact": "positive"
            }
        ]
    }
    
    # 根据分类选择新闻模板
    templates = news_templates.get(category, news_templates['finance'])
    
    # 生成指定数量的新闻
    news_list = []
    for i in range(min(limit, len(templates))):
        template = templates[i]
        news_item = {
            "id": str(i + 1),
            "title": template["title"],
            "summary": template["summary"],
            "source": template["source"],
            "time": (datetime.now() - timedelta(hours=i)).isoformat() + "Z",
            "category": template["category"],
            "impact": template["impact"]
        }
        news_list.append(news_item)
    
    return news_list


def generate_mock_market_data():
    """生成模拟市场数据"""
    return [
        {
            "name": "上证指数",
            "value": "3,245.67",
            "change": "+1.2%",
            "trend": "up"
        },
        {
            "name": "深证成指",
            "value": "10,856.23",
            "change": "+0.8%",
            "trend": "up"
        },
        {
            "name": "创业板指",
            "value": "2,156.89",
            "change": "+2.1%",
            "trend": "up"
        },
        {
            "name": "恒生指数",
            "value": "18,456.78",
            "change": "-0.3%",
            "trend": "down"
        },
        {
            "name": "道琼斯",
            "value": "35,678.90",
            "change": "+0.5%",
            "trend": "up"
        },
        {
            "name": "纳斯达克",
            "value": "14,567.34",
            "change": "+1.8%",
            "trend": "up"
        }
    ]


def generate_recommendations(news_data, market_data):
    """生成投资建议"""
    recommendations = []
    
    # 分析新闻情感
    positive_news = [news for news in news_data if news['impact'] == 'positive']
    negative_news = [news for news in news_data if news['impact'] == 'negative']
    
    # 分析市场趋势
    up_trends = [market for market in market_data if market['trend'] == 'up']
    down_trends = [market for market in market_data if market['trend'] == 'down']
    
    # 根据新闻和市场数据生成建议
    if len(positive_news) > len(negative_news) and len(up_trends) > len(down_trends):
        recommendations.append({
            "title": "关注科技股",
            "description": "政策支持力度加大，市场情绪转暖，建议关注人工智能、芯片、新能源等科技板块",
            "category": "投资建议"
        })
        
        recommendations.append({
            "title": "适度加仓",
            "description": "市场整体向好，可考虑适度增加仓位，但需控制风险，分批建仓",
            "category": "仓位建议"
        })
    
    elif len(negative_news) > len(positive_news):
        recommendations.append({
            "title": "谨慎投资",
            "description": "市场存在不确定性，建议保持谨慎态度，控制仓位，关注风险",
            "category": "风险提示"
        })
    
    # 根据具体新闻内容生成建议
    for news in news_data[:3]:  # 只看前3条重要新闻
        if "央行" in news['title'] and "降息" in news['title']:
            recommendations.append({
                "title": "关注银行股",
                "description": "央行降息利好银行股，可关注相关投资机会",
                "category": "板块推荐"
            })
        
        elif "新能源" in news['title'] or "汽车" in news['title']:
            recommendations.append({
                "title": "布局新能源",
                "description": "新能源汽车发展前景广阔，建议关注相关产业链投资机会",
                "category": "行业推荐"
            })
        
        elif "房地产" in news['title']:
            recommendations.append({
                "title": "房地产投资需谨慎",
                "description": "房地产市场调控政策变化，投资需谨慎，建议关注政策动向",
                "category": "风险提示"
            })
    
    # 如果没有特定建议，提供通用建议
    if not recommendations:
        recommendations.append({
            "title": "分散投资",
            "description": "建议保持投资组合的多样性，分散风险，关注不同行业和资产类别",
            "category": "投资策略"
        })
    
    return recommendations[:5]  # 最多返回5条建议


def get_query_by_category(category):
    """根据分类获取查询关键词"""
    category_queries = {
        'finance': '金融 财经 经济',
        'crypto': '比特币 加密货币 区块链',
        'stock': '股票 股市 投资',
        'policy': '政策 央行 货币政策',
        'real_estate': '房地产 楼市 房价'
    }
    return category_queries.get(category, '金融 财经')


def get_news_category(title, description):
    """根据新闻标题和内容判断分类"""
    text = (title + ' ' + description).lower()
    
    if any(word in text for word in ['央行', '降息', '货币政策']):
        return '货币政策'
    elif any(word in text for word in ['股市', '股票', '指数']):
        return '股市动态'
    elif any(word in text for word in ['房地产', '房价', '楼市']):
        return '房地产'
    elif any(word in text for word in ['比特币', '加密货币']):
        return '加密货币'
    elif any(word in text for word in ['新能源', '汽车']):
        return '行业分析'
    else:
        return '财经新闻'


def analyze_sentiment(title, description):
    """简单的情感分析"""
    text = (title + ' ' + description).lower()
    
    positive_words = ['上涨', '增长', '利好', '突破', '创新高', '支持', '优化', '回升']
    negative_words = ['下跌', '下降', '利空', '跌破', '创新低', '风险', '谨慎', '担忧']
    
    positive_count = sum(1 for word in positive_words if word in text)
    negative_count = sum(1 for word in negative_words if word in text)
    
    if positive_count > negative_count:
        return 'positive'
    elif negative_count > positive_count:
        return 'negative'
    else:
        return 'neutral'


def get_index_name(symbol):
    """获取指数名称"""
    index_names = {
        '^GSPC': '标普500',
        '^DJI': '道琼斯',
        '^IXIC': '纳斯达克',
        '000001.SS': '上证指数'
    }
    return index_names.get(symbol, symbol) 