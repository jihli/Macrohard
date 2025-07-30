import pytest
from backend.app import create_app
from backend.utils.db import create_test_engine
from sqlalchemy import text

@pytest.fixture
def client(tmp_path):
    # 1) 创建 SQLite 临时数据库
    engine = create_test_engine(tmp_path)
    
    # 2) 创建测试数据
    with engine.begin() as conn:
        # 创建测试表
        conn.execute(text("""
            CREATE TABLE users (
                user_id BIGINT PRIMARY KEY,
                username VARCHAR(50) NOT NULL
            )
        """))
        
        conn.execute(text("""
            CREATE TABLE accounts (
                account_id BIGINT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                account_name VARCHAR(60) NOT NULL,
                account_type VARCHAR(20) NOT NULL
            )
        """))
        
        conn.execute(text("""
            CREATE TABLE holdings (
                holding_id BIGINT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                account_id BIGINT NOT NULL,
                product_name VARCHAR(80),
                asset_type VARCHAR(20) NOT NULL,
                quantity DECIMAL(18,6) NOT NULL,
                unit_cost DECIMAL(12,4) NOT NULL
            )
        """))
        
        conn.execute(text("""
            CREATE TABLE holding_prices (
                holding_id BIGINT NOT NULL,
                price_date DATE NOT NULL,
                close_price DECIMAL(12,4) NOT NULL,
                PRIMARY KEY (holding_id, price_date)
            )
        """))
        
        # 插入测试数据
        conn.execute(text("INSERT INTO users (user_id, username) VALUES (1, 'testuser')"))
        conn.execute(text("INSERT INTO accounts (account_id, user_id, account_name, account_type) VALUES (1, 1, '投资账户', 'Investment')"))
        
        # 插入测试投资数据
        conn.execute(text("""
            INSERT INTO holdings (holding_id, user_id, account_id, product_name, asset_type, quantity, unit_cost)
            VALUES (1, 1, 1, '沪深300ETF', 'ETF', 1000, 25.0)
        """))
        
        conn.execute(text("""
            INSERT INTO holdings (holding_id, user_id, account_id, product_name, asset_type, quantity, unit_cost)
            VALUES (2, 1, 1, '债券基金A', 'FUND', 9000, 2.0)
        """))
        
        # 插入价格数据
        conn.execute(text("""
            INSERT INTO holding_prices (holding_id, price_date, close_price)
            VALUES (1, '2024-01-15', 27.1)
        """))
        
        conn.execute(text("""
            INSERT INTO holding_prices (holding_id, price_date, close_price)
            VALUES (2, '2024-01-15', 2.08)
        """))
    
    # 3) 创建 Flask 应用
    app = create_app({'DB_ENGINE': engine})
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_get_investments_empty(client):
    """测试获取空投资组合"""
    response = client.get('/api/investments')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'portfolio' in data['data']
    assert 'summary' in data['data']
    assert 'assetAllocation' in data['data']
    
    # 检查汇总数据
    summary = data['data']['summary']
    assert summary['totalValue'] >= 0
    assert summary['totalInvested'] >= 0

def test_get_investments_with_data(client):
    """测试获取有数据的投资组合"""
    response = client.get('/api/investments')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    
    portfolio = data['data']['portfolio']
    assert len(portfolio) == 2  # 应该有2个投资
    
    # 检查第一个投资（沪深300ETF）
    etf_investment = next((item for item in portfolio if item['name'] == '沪深300ETF'), None)
    assert etf_investment is not None
    assert etf_investment['type'] == 'etf'
    assert etf_investment['shares'] == 1000
    assert etf_investment['purchasePrice'] == 25.0
    assert etf_investment['currentPrice'] == 27.1
    assert etf_investment['currentValue'] == 27100.0
    
    # 检查汇总数据
    summary = data['data']['summary']
    assert summary['totalValue'] > 0
    assert summary['totalInvested'] > 0
    
    # 检查资产配置
    asset_allocation = data['data']['assetAllocation']
    assert len(asset_allocation) > 0

def test_create_investment_success(client):
    """测试成功添加投资"""
    investment_data = {
        "name": "科技股组合",
        "type": "stock",
        "amount": 15000,
        "shares": 500,
        "purchasePrice": 29,
        "riskLevel": "high",
        "expectedReturn": 12.0
    }
    
    response = client.post('/api/investments', 
                          json=investment_data,
                          content_type='application/json')
    
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['success'] is True
    assert 'id' in data['data']
    assert data['message'] == '投资记录添加成功'

def test_create_investment_missing_fields(client):
    """测试缺少必需字段时添加投资失败"""
    # 缺少 name 字段
    investment_data = {
        "type": "stock",
        "amount": 15000,
        "shares": 500,
        "purchasePrice": 29
    }
    
    response = client.post('/api/investments', 
                          json=investment_data,
                          content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '缺少必需字段' in data['error']

def test_create_investment_invalid_data(client):
    """测试无效数据时添加投资失败"""
    # 无效的数值
    investment_data = {
        "name": "测试投资",
        "type": "stock",
        "amount": "invalid",
        "shares": 500,
        "purchasePrice": 29
    }
    
    response = client.post('/api/investments', 
                          json=investment_data,
                          content_type='application/json')
    
    assert response.status_code == 500  # 应该返回500错误 