import pytest
from backend.app import create_app
from backend.utils.db import create_test_engine
from sqlalchemy import text

@pytest.fixture
def client(tmp_path):
    # 1) 创建 SQLite 临时数据库
    engine = create_test_engine(tmp_path)
    
    # 2) 创建测试数据（新闻API不需要数据库，但保持一致性）
    with engine.begin() as conn:
        # 创建测试表
        conn.execute(text("""
            CREATE TABLE users (
                user_id BIGINT PRIMARY KEY,
                username VARCHAR(50) NOT NULL
            )
        """))
        
        # 插入测试数据
        conn.execute(text("INSERT INTO users (user_id, username) VALUES (1, 'testuser')"))
    
    # 3) 创建 Flask 应用
    app = create_app({'DB_ENGINE': engine})
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_get_news_success(client):
    """测试成功获取新闻数据"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'data' in data
    assert 'message' in data
    
    news_data = data['data']
    assert 'news' in news_data
    assert 'marketData' in news_data
    assert 'recommendations' in news_data
    
    # 检查新闻列表
    news = news_data['news']
    assert isinstance(news, list)
    assert len(news) > 0
    
    # 检查第一条新闻的结构
    first_news = news[0]
    assert 'id' in first_news
    assert 'title' in first_news
    assert 'summary' in first_news
    assert 'source' in first_news
    assert 'time' in first_news
    assert 'category' in first_news
    assert 'impact' in first_news
    assert first_news['impact'] in ['positive', 'negative', 'neutral']
    
    # 检查市场数据
    market_data = news_data['marketData']
    assert isinstance(market_data, list)
    assert len(market_data) > 0
    
    # 检查第一条市场数据的结构
    first_market = market_data[0]
    assert 'name' in first_market
    assert 'value' in first_market
    assert 'change' in first_market
    assert 'trend' in first_market
    assert first_market['trend'] in ['up', 'down']
    
    # 检查投资建议
    recommendations = news_data['recommendations']
    assert isinstance(recommendations, list)
    
    if len(recommendations) > 0:
        first_rec = recommendations[0]
        assert 'title' in first_rec
        assert 'description' in first_rec
        assert 'category' in first_rec

def test_get_news_with_category(client):
    """测试按分类获取新闻"""
    # 测试金融新闻
    response = client.get('/api/news?category=finance')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    news = data['data']['news']
    assert len(news) > 0
    
    # 测试加密货币新闻
    response = client.get('/api/news?category=crypto')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    news = data['data']['news']
    assert len(news) > 0
    
    # 测试股票新闻
    response = client.get('/api/news?category=stock')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    news = data['data']['news']
    assert len(news) > 0

def test_get_news_with_limit(client):
    """测试限制返回数量"""
    # 测试默认数量
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    default_news = data['data']['news']
    default_count = len(default_news)
    
    # 测试限制数量为3
    response = client.get('/api/news?limit=3')
    assert response.status_code == 200
    
    data = response.get_json()
    limited_news = data['data']['news']
    assert len(limited_news) <= 3
    
    # 测试限制数量为1
    response = client.get('/api/news?limit=1')
    assert response.status_code == 200
    
    data = response.get_json()
    limited_news = data['data']['news']
    assert len(limited_news) <= 1

def test_get_news_with_category_and_limit(client):
    """测试同时使用分类和数量限制"""
    response = client.get('/api/news?category=finance&limit=2')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    news = data['data']['news']
    assert len(news) <= 2

def test_get_news_invalid_limit(client):
    """测试无效的数量限制"""
    # 测试负数
    response = client.get('/api/news?limit=-1')
    assert response.status_code == 200  # 应该返回默认数据
    
    # 测试非数字
    response = client.get('/api/news?limit=abc')
    assert response.status_code == 500  # 应该返回错误

def test_get_news_market_data_structure(client):
    """测试市场数据结构"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    market_data = data['data']['marketData']
    
    # 检查是否包含主要指数
    index_names = [market['name'] for market in market_data]
    
    # 应该包含一些主要指数
    assert len(market_data) >= 3
    
    for market in market_data:
        assert isinstance(market['name'], str)
        assert isinstance(market['value'], str)
        assert isinstance(market['change'], str)
        assert market['trend'] in ['up', 'down']
        
        # 检查数值格式
        assert '%' in market['change']  # 应该包含百分比符号

def test_get_news_recommendations_logic(client):
    """测试投资建议逻辑"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    recommendations = data['data']['recommendations']
    
    # 建议数量应该合理
    assert len(recommendations) <= 5  # 最多5条建议
    
    for rec in recommendations:
        assert isinstance(rec['title'], str)
        assert isinstance(rec['description'], str)
        assert isinstance(rec['category'], str)
        assert len(rec['title']) > 0
        assert len(rec['description']) > 0

def test_get_news_sentiment_analysis(client):
    """测试情感分析功能"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    news = data['data']['news']
    
    # 检查情感分析结果
    impacts = [item['impact'] for item in news]
    valid_impacts = ['positive', 'negative', 'neutral']
    
    for impact in impacts:
        assert impact in valid_impacts

def test_get_news_category_classification(client):
    """测试新闻分类功能"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    news = data['data']['news']
    
    # 检查新闻分类
    categories = [item['category'] for item in news]
    
    # 应该包含各种分类
    assert len(set(categories)) > 0  # 至少有一种分类
    
    valid_categories = [
        '货币政策', '股市动态', '房地产', '加密货币', 
        '行业分析', '财经新闻', '美股动态', '中概股', '区块链'
    ]
    
    for category in categories:
        assert category in valid_categories

def test_get_news_time_format(client):
    """测试时间格式"""
    response = client.get('/api/news')
    assert response.status_code == 200
    
    data = response.get_json()
    news = data['data']['news']
    
    # 检查时间格式
    for item in news:
        time_str = item['time']
        assert 'T' in time_str  # ISO 8601格式
        assert time_str.endswith('Z')  # UTC时间

def test_get_news_error_handling(client):
    """测试错误处理"""
    # 模拟网络错误或其他异常情况
    # 由于我们使用模拟数据，这个测试主要是确保API不会崩溃
    
    response = client.get('/api/news?category=nonexistent')
    assert response.status_code == 200  # 应该返回默认数据而不是错误
    
    data = response.get_json()
    assert data['success'] is True
    assert len(data['data']['news']) > 0 