import pytest
from backend.app import create_app
from backend.utils.db import create_test_engine
from sqlalchemy import text
from datetime import date, timedelta

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
            CREATE TABLE goals (
                goal_id BIGINT PRIMARY KEY,
                user_id BIGINT NOT NULL,
                goal_name VARCHAR(100) NOT NULL,
                target_amount DECIMAL(12,2) NOT NULL,
                current_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
                deadline DATE,
                priority VARCHAR(20) NOT NULL,
                goal_type VARCHAR(50) NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE
            )
        """))
        
        # 插入测试数据
        conn.execute(text("INSERT INTO users (user_id, username) VALUES (1, 'testuser')"))
        
        # 插入测试目标数据
        today = date.today()
        future_date = today + timedelta(days=180)
        
        conn.execute(text("""
            INSERT INTO goals (goal_id, user_id, goal_name, target_amount, current_amount, deadline, priority, goal_type, is_active)
            VALUES (1, 1, '紧急备用金', 50000, 35000, :deadline, 'HIGH', 'emergency', TRUE)
        """), {"deadline": future_date})
        
        conn.execute(text("""
            INSERT INTO goals (goal_id, user_id, goal_name, target_amount, current_amount, deadline, priority, goal_type, is_active)
            VALUES (2, 1, '欧洲旅行基金', 30000, 18000, :deadline, 'MEDIUM', 'travel', TRUE)
        """), {"deadline": future_date + timedelta(days=90)})
        
        conn.execute(text("""
            INSERT INTO goals (goal_id, user_id, goal_name, target_amount, current_amount, deadline, priority, goal_type, is_active)
            VALUES (3, 1, '购房首付', 200000, 80000, :deadline, 'HIGH', 'savings', TRUE)
        """), {"deadline": future_date + timedelta(days=365)})
    
    # 3) 创建 Flask 应用
    app = create_app({'DB_ENGINE': engine})
    app.config['TESTING'] = True
    
    with app.test_client() as client:
        yield client

def test_get_goals_success(client):
    """测试成功获取目标列表"""
    response = client.get('/api/goals')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert 'data' in data
    assert 'message' in data
    
    goals_data = data['data']
    assert 'goals' in goals_data
    assert 'statistics' in goals_data
    
    # 检查目标列表
    goals = goals_data['goals']
    assert len(goals) == 3  # 应该有3个目标
    
    # 检查第一个目标
    first_goal = goals[0]
    assert 'id' in first_goal
    assert 'name' in first_goal
    assert 'targetAmount' in first_goal
    assert 'currentAmount' in first_goal
    assert 'deadline' in first_goal
    assert 'priority' in first_goal
    assert 'type' in first_goal
    assert 'isActive' in first_goal
    assert 'percentage' in first_goal
    assert 'remainingAmount' in first_goal
    assert 'daysRemaining' in first_goal
    
    # 检查统计信息
    statistics = goals_data['statistics']
    assert statistics['totalGoals'] == 3
    assert statistics['activeGoals'] == 3
    assert statistics['totalTargetAmount'] == 280000
    assert statistics['totalCurrentAmount'] == 133000
    assert statistics['averageProgress'] > 0

def test_get_goals_calculations(client):
    """测试目标计算逻辑"""
    response = client.get('/api/goals')
    assert response.status_code == 200
    
    data = response.get_json()
    goals = data['data']['goals']
    
    # 检查紧急备用金的计算
    emergency_goal = next((g for g in goals if g['name'] == '紧急备用金'), None)
    assert emergency_goal is not None
    assert emergency_goal['targetAmount'] == 50000
    assert emergency_goal['currentAmount'] == 35000
    assert emergency_goal['percentage'] == 70.0
    assert emergency_goal['remainingAmount'] == 15000
    assert emergency_goal['daysRemaining'] >= 0

def test_create_goal_success(client):
    """测试成功创建目标"""
    goal_data = {
        "name": "购房首付",
        "targetAmount": 200000,
        "deadline": "2025-12-31T00:00:00Z",
        "priority": "high",
        "type": "savings"
    }
    
    response = client.post('/api/goals', 
                          json=goal_data,
                          content_type='application/json')
    
    assert response.status_code == 201
    
    data = response.get_json()
    assert data['success'] is True
    assert 'id' in data['data']
    assert data['message'] == '目标创建成功'

def test_create_goal_missing_fields(client):
    """测试缺少必需字段时创建目标失败"""
    # 缺少 name 字段
    goal_data = {
        "targetAmount": 200000,
        "deadline": "2025-12-31T00:00:00Z",
        "priority": "high",
        "type": "savings"
    }
    
    response = client.post('/api/goals', 
                          json=goal_data,
                          content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '缺少必需字段' in data['error']

def test_create_goal_invalid_date(client):
    """测试无效日期格式时创建目标失败"""
    goal_data = {
        "name": "测试目标",
        "targetAmount": 200000,
        "deadline": "invalid-date",
        "priority": "high",
        "type": "savings"
    }
    
    response = client.post('/api/goals', 
                          json=goal_data,
                          content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '日期格式错误' in data['error']

def test_update_goal_progress_success(client):
    """测试成功更新目标进度"""
    progress_data = {
        "currentAmount": 85000
    }
    
    response = client.put('/api/goals/1/progress', 
                         json=progress_data,
                         content_type='application/json')
    
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['id'] == 1
    assert data['data']['currentAmount'] == 85000
    assert data['data']['percentage'] > 0
    assert data['message'] == '目标进度更新成功'

def test_update_goal_progress_missing_field(client):
    """测试缺少字段时更新目标进度失败"""
    progress_data = {}
    
    response = client.put('/api/goals/1/progress', 
                         json=progress_data,
                         content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '缺少必需字段' in data['error']

def test_update_goal_progress_negative_amount(client):
    """测试负数金额时更新目标进度失败"""
    progress_data = {
        "currentAmount": -1000
    }
    
    response = client.put('/api/goals/1/progress', 
                         json=progress_data,
                         content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '当前金额不能为负数' in data['error']

def test_update_goal_progress_exceed_target(client):
    """测试超过目标金额时更新目标进度失败"""
    progress_data = {
        "currentAmount": 100000  # 超过目标金额50000
    }
    
    response = client.put('/api/goals/1/progress', 
                         json=progress_data,
                         content_type='application/json')
    
    assert response.status_code == 400
    
    data = response.get_json()
    assert data['success'] is False
    assert '当前金额不能超过目标金额' in data['error']

def test_update_goal_progress_not_found(client):
    """测试更新不存在的目标进度失败"""
    progress_data = {
        "currentAmount": 10000
    }
    
    response = client.put('/api/goals/999/progress', 
                         json=progress_data,
                         content_type='application/json')
    
    assert response.status_code == 404
    
    data = response.get_json()
    assert data['success'] is False
    assert '目标不存在' in data['error']

def test_delete_goal_success(client):
    """测试成功删除目标"""
    response = client.delete('/api/goals/1')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['success'] is True
    assert data['message'] == '目标删除成功'

def test_delete_goal_not_found(client):
    """测试删除不存在的目标失败"""
    response = client.delete('/api/goals/999')
    assert response.status_code == 404
    
    data = response.get_json()
    assert data['success'] is False
    assert '目标不存在' in data['error'] 