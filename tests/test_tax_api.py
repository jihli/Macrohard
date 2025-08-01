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
            CREATE TABLE categories (
                category_id BIGINT PRIMARY KEY,
                name VARCHAR(40) NOT NULL,
                flow_type VARCHAR(20) NOT NULL
            )
        """))
        
        conn.execute(text("""
            CREATE TABLE transactions (
                transaction_id BIGINT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                category_id BIGINT NOT NULL,
                txn_date DATE NOT NULL,
                flow_type VARCHAR(20) NOT NULL,
                amount DECIMAL(12,2) NOT NULL
            )
        """))
        
        # 插入测试数据
        conn.execute(text("INSERT INTO users (user_id, username) VALUES (1, 'testuser')"))
        
        # 插入分类数据
        conn.execute(text("INSERT INTO categories (category_id, name, flow_type) VALUES (1, '工资', 'Income')"))
        conn.execute(text("INSERT INTO categories (category_id, name, flow_type) VALUES (2, '奖金', 'Income')"))
        conn.execute(text("INSERT INTO categories (category_id, name, flow_type) VALUES (3, '税务', 'Spending')"))
        conn.execute(text("INSERT INTO categories (category_id, name, flow_type) VALUES (4, '个人所得税', 'Spending')"))
        
        # 插入收入交易
        conn.execute(text("""
            INSERT INTO transactions (transaction_id, user_id, category_id, txn_date, flow_type, amount)
            VALUES (1, 1, 1, '2024-01-15', 'Income', 15000)
        """))
        
        conn.execute(text("""
            INSERT INTO transactions (transaction_id, user_id, category_id, txn_date, flow_type, amount)
            VALUES (2, 1, 1, '2024-02-15', 'Income', 15000)
        """))
        
        conn.execute(text("""
            INSERT INTO transactions (transaction_id, user_id, category_id, txn_date, flow_type, amount)
            VALUES (3, 1, 2, '2024-03-15', 'Income', 50000)
        """))
        
        # 插入税务支出
        conn.execute(text("""
            INSERT INTO transactions (transaction_id, user_id, category_id, txn_date, flow_type, amount)
            VALUES (4, 1, 3, '2024-01-20', 'Spending', 2000)
        """))
        
        conn.execute(text("""
            INSERT INTO transactions (transaction_id, user_id, category_id, txn_date, flow_type, amount)
            VALUES (5, 1, 4, '2024-02-20', 'Spending', 3000)
        """))
    
    # 3) 创建 Flask 应用
    app = create_app({'DB_ENGINE': engine})
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_get_tax_data_success(client):
    """测试成功获取税务数据"""
    response = client.get('/api/tax')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'data' in data
    assert 'message' in data
    
    tax_data = data['data']
    
    # 检查基本字段
    assert 'annualIncome' in tax_data
    assert 'estimatedTaxRate' in tax_data
    assert 'paidTax' in tax_data
    assert 'estimatedTax' in tax_data
    assert 'difference' in tax_data
    assert 'status' in tax_data
    assert 'deductions' in tax_data
    assert 'recommendations' in tax_data
    
    # 检查数据类型
    assert isinstance(tax_data['annualIncome'], (int, float))
    assert isinstance(tax_data['estimatedTaxRate'], (int, float))
    assert isinstance(tax_data['paidTax'], (int, float))
    assert isinstance(tax_data['estimatedTax'], (int, float))
    assert isinstance(tax_data['difference'], (int, float))
    assert isinstance(tax_data['status'], str)
    assert isinstance(tax_data['deductions'], list)
    assert isinstance(tax_data['recommendations'], list)

def test_get_tax_data_calculations(client):
    """测试税务计算逻辑"""
    response = client.get('/api/tax')
    assert response.status_code == 200
    
    data = response.get_json()
    tax_data = data['data']
    
    # 检查年度收入计算（应该包含所有收入交易）
    expected_income = 15000 + 15000 + 50000  # 80000
    assert tax_data['annualIncome'] == expected_income
    
    # 检查已缴税款计算（应该包含所有税务支出）
    expected_paid_tax = 2000 + 3000  # 5000
    assert tax_data['paidTax'] == expected_paid_tax
    
    # 检查状态计算
    if tax_data['difference'] > 0:
        assert tax_data['status'] == 'underpaid'
    elif tax_data['difference'] < 0:
        assert tax_data['status'] == 'overpaid'
    else:
        assert tax_data['status'] == 'balanced'

def test_get_tax_data_deductions(client):
    """测试抵扣项目数据"""
    response = client.get('/api/tax')
    assert response.status_code == 200
    
    data = response.get_json()
    deductions = data['data']['deductions']
    
    # 检查抵扣项目结构
    assert len(deductions) > 0
    
    for deduction in deductions:
        assert 'name' in deduction
        assert 'amount' in deduction
        assert 'status' in deduction
        assert isinstance(deduction['name'], str)
        assert isinstance(deduction['amount'], (int, float))
        assert deduction['status'] in ['available', 'pending', 'unavailable']

def test_get_tax_data_recommendations(client):
    """测试税务建议数据"""
    response = client.get('/api/tax')
    assert response.status_code == 200
    
    data = response.get_json()
    recommendations = data['data']['recommendations']
    
    # 检查建议结构
    for recommendation in recommendations:
        assert 'title' in recommendation
        assert 'description' in recommendation
        assert 'savings' in recommendation
        assert 'priority' in recommendation
        assert isinstance(recommendation['title'], str)
        assert isinstance(recommendation['description'], str)
        assert isinstance(recommendation['savings'], (int, float))
        assert recommendation['priority'] in ['low', 'medium', 'high']

def test_get_tax_data_empty_income(client):
    """测试无收入时的税务数据"""
    # 清空收入数据
    with client.application.config['DB_ENGINE'].begin() as conn:
        conn.execute(text("DELETE FROM transactions WHERE flow_type = 'Income'"))
    
    response = client.get('/api/tax')
    assert response.status_code == 200
    
    data = response.get_json()
    tax_data = data['data']
    
    # 检查无收入时的计算
    assert tax_data['annualIncome'] == 0
    assert tax_data['estimatedTax'] == 0
    assert tax_data['difference'] == -tax_data['paidTax']  # 应该是负数（多缴税）
    assert tax_data['status'] == 'overpaid'

def test_tax_rate_calculation():
    """测试税率计算函数"""
    from backend.modules.tax.controller import calculate_tax_rate
    
    # 测试不同收入水平的税率
    assert calculate_tax_rate(30000) == 3    # 3%
    assert calculate_tax_rate(100000) == 10  # 10%
    assert calculate_tax_rate(200000) == 20  # 20%
    assert calculate_tax_rate(500000) == 30  # 30%
    assert calculate_tax_rate(1000000) == 45 # 45% 