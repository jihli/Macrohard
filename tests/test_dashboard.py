# tests/test_dashboard.py

import pytest
from backend.app import create_app  # 假设 app.py 中有工厂函数
from sqlalchemy import text

@pytest.fixture
def client(tmp_path):
    app = create_app({
        'TESTING': True,
        'DB_ENGINE': create_test_engine(tmp_path)  # 见下文
    })
    with app.test_client() as c:
        with app.app_context():
            # 初始化测试数据库
            init_sql = (path_to_project / 'Database/init_wealth.sql').read_text()
            app.config['DB_ENGINE'].execute(text(init_sql))
        yield c

def test_dashboard_empty(client):
    rv = client.get('/api/dashboard')
    data = rv.get_json()
    assert rv.status_code == 200
    assert data['success'] is True
    assert data['data']['totalBalance'] == 0
    assert data['data']['monthlyIncome'] == 0
    assert data['data']['monthlyExpenses'] == 0

# —根据需要再写更多测试，如插入几笔交易后检查返回值—
