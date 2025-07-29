from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from datetime import date
from calendar import monthrange

bp = Blueprint('budget', __name__)

@bp.route('', methods=['GET'])
def get_budget():
    """
    GET /api/budget
    返回用户的预算设置和进度数据
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    # 计算本月第一天和最后一天
    first_day = date.today().replace(day=1)
    _, days_in_month = monthrange(first_day.year, first_day.month)
    last_day = first_day.replace(day=days_in_month)

    with engine.connect() as conn:
        # 查询本月预算项目
        budgets = conn.execute(text(
            """
            SELECT b.budget_id, b.category_id, c.name AS category, b.budget_amount AS budgeted
            FROM budgets b
            JOIN categories c ON b.category_id = c.category_id
            WHERE b.user_id = :uid AND b.period_start = :first_day
            """
        ), {"uid": user_id, "first_day": first_day}).mappings().all()

        total_budget = 0.0
        total_spent = 0.0
        categories_list = []

        for row in budgets:
            budgeted = float(row['budgeted'])
            # 计算当月已花金额
            spent = conn.execute(text(
                """
                SELECT COALESCE(SUM(amount),0)
                FROM transactions
                WHERE user_id = :uid
                  AND category_id = :cid
                  AND txn_date BETWEEN :first_day AND :last_day
                """
            ), {
                "uid": user_id,
                "cid": row['category_id'],
                "first_day": first_day,
                "last_day": last_day
            }).scalar_one()
            spent = float(spent)

            remaining = budgeted - spent
            pct = round((spent / budgeted * 100), 2) if budgeted else 0.0

            categories_list.append({
                "category": row['category'],
                "budgeted": budgeted,
                "spent": spent,
                "percentage": pct,
                "remaining": remaining
            })
            total_budget += budgeted
            total_spent += spent

        total_remaining = total_budget - total_spent
        overall_pct = round((total_spent / total_budget * 100), 2) if total_budget else 0.0

    return jsonify({
        "success": True,
        "data": {
            "monthlyBudget": round(total_budget, 2),
            "categories": categories_list,
            "totalSpent": round(total_spent, 2),
            "totalRemaining": round(total_remaining, 2),
            "overallPercentage": overall_pct
        },
        "message": "预算数据获取成功"
    })


@bp.route('', methods=['PUT'])
def update_budget():
    """
    PUT /api/budget
    更新用户的预算设置
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id
    payload = request.get_json()
    first_day = date.today().replace(day=1)

    with engine.begin() as conn:
        for item in payload.get('categories', []):
            # 获取分类 ID
            cid = conn.execute(text(
                "SELECT category_id FROM categories WHERE name = :name"
            ), {'name': item['category']}).scalar_one_or_none()
            if not cid:
                continue

            # 更新已有预算
            res = conn.execute(text(
                "UPDATE budgets SET budget_amount = :amt"
                " WHERE user_id = :uid"
                " AND category_id = :cid"
                " AND period_start = :first_day"
            ), {
                'amt': item['budgeted'],
                'uid': user_id,
                'cid': cid,
                'first_day': first_day
            })
            # 如果未更新，插入新记录
            if res.rowcount == 0:
                conn.execute(text(
                    "INSERT INTO budgets"
                    " (user_id, category_id, period_start, budget_amount)"
                    " VALUES (:uid, :cid, :first_day, :amt)"
                ), {
                    'uid': user_id,
                    'cid': cid,
                    'first_day': first_day,
                    'amt': item['budgeted']
                })

    return jsonify({
        "success": True,
        "message": "预算设置更新成功"
    })
