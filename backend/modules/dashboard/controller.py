# backend/modules/dashboard/controller.py

from flask import Blueprint, jsonify, current_app
from sqlalchemy import text
from datetime import date

bp = Blueprint('dashboard', __name__)

@bp.route('', methods=['GET'])
def get_dashboard():
    """
    GET /api/dashboard
    返回仪表板概览数据
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数中获取实际 user_id

    with engine.connect() as conn:
        # 1) 总余额：所有账户 current_balance 之和
        total_balance = conn.execute(
            text("SELECT COALESCE(SUM(current_balance),0) FROM accounts WHERE user_id=:uid"),
            {"uid": user_id}
        ).scalar_one()

        # 2) 月度收入&支出：本月交易
        first_day = date.today().replace(day=1)
        monthly = conn.execute(text("""
            SELECT
              SUM(CASE WHEN t.flow_type='Income' THEN amount ELSE 0 END)   AS income,
              SUM(CASE WHEN t.flow_type='Spending' THEN amount ELSE 0 END) AS expenses
            FROM transactions t
            WHERE t.user_id=:uid AND t.txn_date >= :first_day
        """), {"uid": user_id, "first_day": first_day}).mappings().one()
        monthly_income = float(monthly["income"] or 0)
        monthly_expenses = float(monthly["expenses"] or 0)

        # 3) 预算进度：每个预算的已花金额
        budgets = conn.execute(text("""
            SELECT b.category_id, c.name AS category,
                   b.budget_amount AS budgeted,
                   COALESCE(SUM(t.amount),0) AS spent
            FROM budgets b
            JOIN categories c ON b.category_id=c.category_id
            LEFT JOIN transactions t
              ON t.category_id=b.category_id
              AND t.user_id=b.user_id
              AND t.txn_date BETWEEN b.period_start AND LAST_DAY(b.period_start)
            WHERE b.user_id=:uid
            GROUP BY b.budget_id
        """), {"uid": user_id}).mappings().all()
        budget_progress = [
            {
                "category": row["category"],
                "budgeted": float(row["budgeted"]),
                "spent": float(row["spent"]),
                "percentage": round(row["spent"]/row["budgeted"]*100, 2) if row["budgeted"] else 0
            }
            for row in budgets
        ]

        # 4) 最近交易：最新 5 条
        recent = conn.execute(text("""
            SELECT
              t.transaction_id AS id,
              t.user_id,
              -t.amount       AS amount,
              t.flow_type     AS type,
              c.name          AS category,
              t.description,
              t.txn_date      AS date
            FROM transactions t
            JOIN categories c ON t.category_id=c.category_id
            WHERE t.user_id = :uid
            ORDER BY t.txn_date DESC
            LIMIT 5
        """), {"uid": user_id}).mappings().all()
        recent_transactions = [
            {**row, "tags": [], "location": None}
            for row in recent
        ]

        # 5) 后续账单：本月剩余天数内的支出交易
        today = date.today()
        upcoming = conn.execute(text("""
            SELECT
              t.transaction_id AS id,
              t.user_id,
              -t.amount       AS amount,
              t.flow_type     AS type,
              c.name          AS category,
              t.description,
              t.txn_date      AS date
            FROM transactions t
            JOIN categories c ON t.category_id=c.category_id
            WHERE t.user_id = :uid
              AND t.flow_type = 'Spending'
              AND t.txn_date > :today
              AND t.txn_date <= LAST_DAY(:today)
            ORDER BY t.txn_date
            LIMIT 5
        """), {"uid": user_id, "today": today}).mappings().all()
        upcoming_bills = [dict(row) for row in upcoming]


        investments = conn.execute(text("""
            SELECT
                h.holding_id AS id,
                h.user_id AS userId,
                h.product_name AS name,
                h.asset_type AS type,
                h.quantity AS shares,
                h.unit_cost AS purchasePrice,
                hp.close_price AS currentPrice,
                h.unit_cost * h.quantity AS totalInvested,
                h.quantity * hp.close_price AS currentValue,
                (hp.close_price - h.unit_cost) / h.unit_cost * 100 AS `return`,
                'medium' AS riskLevel,
                8.5 AS expectedReturn,
                '2023-06-01T00:00:00Z' AS purchaseDate
            FROM
                holdings h
            JOIN
                holding_prices hp ON h.holding_id = hp.holding_id
            WHERE
                hp.price_date = (SELECT MAX(price_date) FROM holding_prices WHERE holding_id = h.holding_id)
                AND h.user_id = :uid
        """), {"uid": user_id}).mappings().all()
       
    investments_summary = [
            {
                "id": inv["id"],
                "name": inv["name"],
                "type": inv["type"],
                "shares": float(inv["shares"]),
                "purchasePrice": float(inv["purchasePrice"]),
                "currentPrice": float(inv["currentPrice"]),
                "totalInvested": float(inv["totalInvested"]),
                "currentValue": float(inv["currentValue"]),
                "return": round(inv["return"], 2),
                "riskLevel": inv["riskLevel"],
                "expectedReturn": float(inv["expectedReturn"]),
                "purchaseDate": inv["purchaseDate"]
            }
            for inv in investments
    ]


    # 汇总返回
    return jsonify({
        "success": True,
        "data": {
            "totalBalance": float(total_balance),
            "monthlyIncome": monthly_income,
            "monthlyExpenses": monthly_expenses,
            "savingsRate": round(
                (monthly_income - monthly_expenses) / monthly_income * 100, 2
            ) if monthly_income else 0,
            "budgetProgress": budget_progress,
            "recentTransactions": recent_transactions,
            "upcomingBills": upcoming_bills,
            "investmentSummary": investments_summary,  # 后续扩展
            "goalProgress": []        # 后续扩展
        },
        "message": "仪表板数据获取成功"
    })
