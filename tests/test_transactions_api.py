# tests/test_transactions_api.py

import pytest
from pathlib import Path
from sqlalchemy import create_engine, text
from backend.app import create_app

@pytest.fixture
def client(tmp_path):
    # 1) 准备 SQLite 测试库
    db_file = tmp_path / "test.db"
    engine = create_engine(f"sqlite:///{db_file}", future=True)

    # 2) 建表：categories & transactions
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE categories (
              category_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL UNIQUE,
              flow_type TEXT NOT NULL
            )
        """))
        conn.execute(text("""
            CREATE TABLE transactions (
              transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
              user_id INTEGER NOT NULL,
              account_id INTEGER NOT NULL,
              category_id INTEGER NOT NULL,
              txn_date DATE NOT NULL,
              flow_type TEXT NOT NULL,
              amount REAL NOT NULL,
              description TEXT,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))

    # 3) 插入样例类别
    with engine.begin() as conn:
        conn.execute(text(
            "INSERT INTO categories(name, flow_type) VALUES(:n, :f)"
        ), [
            {"n": "food", "f": "Spending"},
            {"n": "salary", "f": "Income"}
        ])

    # 4) 创建 APP 注入测试 engine
    app = create_app({"DB_ENGINE": engine, "TESTING": True})
    with app.test_client() as c:
        yield c

def test_get_empty(client):
    """初始化后，无任何交易时，返回空列表"""
    rv = client.get("/api/transactions")
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["success"] is True
    assert data["data"]["transactions"] == []
    assert data["data"]["pagination"]["total"] == 0
    assert data["data"]["pagination"]["page"] == 1

def test_crud_transactions(client):
    """完整测试：POST→GET→PUT→DELETE"""
    # 1) 新增一条支出
    payload = {
      "amount": -120,
      "type": "expense",
      "category": "food",
      "description": "超市购物",
      "date": "2025-07-20T14:30:00Z",
      "tags": ["购物", "日用品"],
      "location": "超市"
    }
    rv1 = client.post("/api/transactions", json=payload)
    assert rv1.status_code == 201
    tx_id = rv1.get_json()["data"]["id"]

    # 2) GET 应能看到刚插入的一条
    rv2 = client.get("/api/transactions")
    lst = rv2.get_json()["data"]["transactions"]
    assert len(lst) == 1
    tx = lst[0]
    assert tx["id"] == tx_id
    assert tx["amount"] == -120
    assert tx["category"] == "food"

    # 3) 更新为收入类型
    rv3 = client.put(f"/api/transactions/{tx_id}", json={
        "amount": 300,
        "type": "income",
        "description": "工资收入"
    })
    assert rv3.status_code == 200
    assert rv3.get_json()["success"]

    # 4) GET 验证修改后
    rv4 = client.get("/api/transactions")
    tx2 = rv4.get_json()["data"]["transactions"][0]
    assert tx2["amount"] == 300
    assert tx2["type"] == "income"
    assert tx2["description"] == "工资收入"

    # 5) 删除
    rv5 = client.delete(f"/api/transactions/{tx_id}")
    assert rv5.status_code == 200

    # 6) 确认已删除
    rv6 = client.get("/api/transactions")
    assert rv6.get_json()["data"]["transactions"] == []
