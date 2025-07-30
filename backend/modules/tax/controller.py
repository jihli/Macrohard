# backend/modules/tax/controller.py

from flask import Blueprint, jsonify, current_app
from sqlalchemy import text
from datetime import date, datetime

bp = Blueprint('tax', __name__)

@bp.route('', methods=['GET'])
def get_tax_data():
    """
    GET /api/tax
    获取用户的税务预测数据
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id
    current_year = date.today().year

    with engine.connect() as conn:
        # 1) 计算年度总收入
        annual_income = conn.execute(text("""
            SELECT COALESCE(SUM(amount), 0) as total_income
            FROM transactions 
            WHERE user_id = :uid 
              AND flow_type = 'Income'
              AND YEAR(txn_date) = :year
        """), {"uid": user_id, "year": current_year}).scalar_one()
        
        annual_income = float(annual_income)

        # 2) 计算已缴税款（从支出中筛选税务相关交易）
        paid_tax = conn.execute(text("""
            SELECT COALESCE(SUM(amount), 0) as paid_tax
            FROM transactions t
            JOIN categories c ON t.category_id = c.category_id
            WHERE t.user_id = :uid 
              AND t.flow_type = 'Spending'
              AND YEAR(t.txn_date) = :year
              AND c.name IN ('税务', '个人所得税', '企业所得税')
        """), {"uid": user_id, "year": current_year}).scalar_one()
        
        paid_tax = float(paid_tax)

        # 3) 计算可抵扣项目
        deductions = calculate_deductions(conn, user_id, current_year)
        total_deductions = sum(d['amount'] for d in deductions if d['status'] == 'available')

        # 4) 计算应纳税所得额和预估税款
        taxable_income = max(0, annual_income - total_deductions)
        estimated_tax_rate = calculate_tax_rate(taxable_income)
        estimated_tax = taxable_income * (estimated_tax_rate / 100)
        
        # 5) 计算差额和状态
        difference = estimated_tax - paid_tax
        status = "underpaid" if difference > 0 else "overpaid" if difference < 0 else "balanced"

        # 6) 生成税务优化建议
        recommendations = generate_tax_recommendations(
            annual_income, 
            taxable_income, 
            total_deductions, 
            difference
        )

    return jsonify({
        "success": True,
        "data": {
            "annualIncome": round(annual_income, 2),
            "estimatedTaxRate": round(estimated_tax_rate, 1),
            "paidTax": round(paid_tax, 2),
            "estimatedTax": round(estimated_tax, 2),
            "difference": round(difference, 2),
            "status": status,
            "deductions": deductions,
            "recommendations": recommendations
        },
        "message": "税务数据获取成功"
    })


def calculate_deductions(conn, user_id, year):
    """计算可抵扣项目"""
    # 这里使用模拟数据，实际项目中应该从数据库获取
    # 可以根据用户的交易记录和配置来计算
    
    deductions = [
        {
            "name": "住房贷款利息",
            "amount": 12000,
            "status": "available"
        },
        {
            "name": "子女教育",
            "amount": 8000,
            "status": "available"
        },
        {
            "name": "赡养老人",
            "amount": 6000,
            "status": "available"
        },
        {
            "name": "继续教育",
            "amount": 4000,
            "status": "pending"
        },
        {
            "name": "大病医疗",
            "amount": 15000,
            "status": "unavailable"
        }
    ]
    
    return deductions


def calculate_tax_rate(taxable_income):
    """根据应纳税所得额计算税率"""
    # 简化的中国个人所得税税率计算
    if taxable_income <= 36000:
        return 3
    elif taxable_income <= 144000:
        return 10
    elif taxable_income <= 300000:
        return 20
    elif taxable_income <= 420000:
        return 25
    elif taxable_income <= 660000:
        return 30
    elif taxable_income <= 960000:
        return 35
    else:
        return 45


def generate_tax_recommendations(annual_income, taxable_income, total_deductions, difference):
    """生成税务优化建议"""
    recommendations = []
    
    # 建议1: 增加退休金缴纳
    if annual_income > 100000 and total_deductions < 20000:
        retirement_savings = min(12000, annual_income * 0.1)  # 最多12万
        tax_savings = retirement_savings * 0.2  # 假设20%税率
        recommendations.append({
            "title": "增加退休金缴纳",
            "description": f"考虑增加个人养老金缴纳，可享受税前扣除，预计可节省税款 ¥{tax_savings:.0f}",
            "savings": round(tax_savings, 0),
            "priority": "high"
        })
    
    # 建议2: 慈善捐赠
    if difference > 5000:
        donation_amount = min(5000, difference)
        tax_savings = donation_amount * 0.15  # 假设15%税率
        recommendations.append({
            "title": "慈善捐赠",
            "description": f"通过慈善捐赠获得税前扣除，建议捐赠金额 ¥{donation_amount:.0f}，可节省税款 ¥{tax_savings:.0f}",
            "savings": round(tax_savings, 0),
            "priority": "medium"
        })
    
    # 建议3: 投资损失抵扣
    if taxable_income > 50000:
        recommendations.append({
            "title": "投资损失抵扣",
            "description": "如有投资损失，可用于抵扣其他投资收益，建议咨询税务专家",
            "savings": 0,
            "priority": "low"
        })
    
    # 建议4: 年终奖优化
    if annual_income > 150000:
        recommendations.append({
            "title": "年终奖优化",
            "description": "合理安排年终奖发放时间，避免税率跳档，预计可节省税款 ¥1,200",
            "savings": 1200,
            "priority": "medium"
        })
    
    return recommendations 