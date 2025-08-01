# tests/test_budget_api.py

import pytest
from sqlalchemy import create_engine, text
from datetime import date

from backend.app import create_app

@pytest.fixture
def client(tmp_path):
    # 1) 创建 SQLite 临时数据库
    db_file = tmp_path / "test.db"
    engine = create_engine(f"sqlite:///{db_file}", future=True)

    # 2) 手动建表：每条 CREATE TABLE 单独 execute
    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE categories (
                category_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                name          TEXT    NOT NULL UNIQUE,
                flow_type     TEXT    NOT NULL
            )
        """))
        conn.execute(text("""
            CREATE TABLE budgets (
                budget_id       INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id         INTEGER NOT NULL,
                category_id     INTEGER NOT NULL,
                period_start    DATE    NOT NULL,
                budget_amount   REAL    NOT NULL,
                alert_threshold REAL    DEFAULT 1.0,
                budget_name     TEXT,
                created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))
        conn.execute(text("""
            CREATE TABLE transactions (
                transaction_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id         INTEGER NOT NULL,
                account_id      INTEGER NOT NULL,
                category_id     INTEGER NOT NULL,
                txn_date        DATE    NOT NULL,
                flow_type       TEXT    NOT NULL,
                amount          REAL    NOT NULL,
                description     TEXT,
                created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """))

    # 3) 插入测试需要的分类数据
    with engine.begin() as conn:
        conn.execute(text(
            "INSERT INTO categories(name, flow_type) VALUES (:n, :f)"
        ), [
            {"n": "food", "f": "Spending"},
            {"n": "transport", "f": "Spending"}
        ])

    # 4) 创建 Flask 应用，注入测试 engine
    app = create_app({
        "DB_ENGINE": engine,
        "TESTING": True
    })
    with app.test_client() as c:
        yield c

def test_get_budget_empty(client):
    """未设预算时，GET /api/budget 应返回全 0/空"""
    rv = client.get("/api/budget")
    assert rv.status_code == 200
    data = rv.get_json()
    assert data["success"] is True
    assert data["data"]["monthlyBudget"] == 0
    assert data["data"]["categories"] == []
    assert data["data"]["totalSpent"] == 0
    assert data["data"]["totalRemaining"] == 0
    assert data["data"]["overallPercentage"] == 0

def test_update_and_get_budget(client):
    """PUT 后，再 GET 核对预算和支出计算"""
    # 当月第一天
    today = date.today().replace(day=1).isoformat()

    # 1) 更新预算
    payload = {
        "categories": [
            {"category": "food", "budgeted": 1000},
            {"category": "transport", "budgeted": 500}
        ]
    }
    rv2 = client.put("/api/budget", json=payload)
    assert rv2.status_code == 200
    assert rv2.get_json()["success"] is True

    # 2) 插入两笔支出：food 200, transport 100
    engine = client.application.config["DB_ENGINE"]
    with engine.begin() as conn:
        conn.execute(text("""
            INSERT INTO transactions
              (user_id, account_id, category_id, txn_date, flow_type, amount)
            VALUES
              (1, 1, (SELECT category_id FROM categories WHERE name='food'),
               :d, 'Spending', 200),
              (1, 1, (SELECT category_id FROM categories WHERE name='transport'),
               :d, 'Spending', 100)
        """), {"d": today})

    # 3) 再次 GET，并断言计算结果
    rv3 = client.get("/api/budget")
    data3 = rv3.get_json()["data"]

    assert data3["monthlyBudget"] == 1500
    cats = {c["category"]: c for c in data3["categories"]}
    assert cats["food"]["spent"] == 200
    assert cats["food"]["remaining"] == 800
    assert cats["transport"]["spent"] == 100
    assert cats["transport"]["remaining"] == 400
    assert data3["totalSpent"] == 300
    assert data3["totalRemaining"] == 1200
    assert data3["overallPercentage"] == 20.0
