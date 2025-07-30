# backend/modules/investments/controller.py

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from datetime import datetime

bp = Blueprint('investments', __name__)

@bp.route('', methods=['GET'])
def get_investments():
    """
    GET /api/investments
    获取用户的投资组合数据
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    with engine.connect() as conn:
        # 1) 获取所有投资持仓
        holdings = conn.execute(text("""
            SELECT 
                h.holding_id AS id,
                h.user_id AS userId,
                h.product_name AS name,
                h.asset_type AS type,
                h.quantity AS shares,
                h.unit_cost AS purchasePrice,
                h.quantity * h.unit_cost AS amount,
                h.quantity * h.unit_cost AS currentValue,
                h.quantity * h.unit_cost AS purchaseValue
            FROM holdings h
            WHERE h.user_id = :uid
        """), {"uid": user_id}).mappings().all()

        portfolio = []
        total_invested = 0
        total_current_value = 0
        total_gain = 0

        for holding in holdings:
            # 获取最新价格（如果有的话）
            latest_price = conn.execute(text("""
                SELECT close_price 
                FROM holding_prices 
                WHERE holding_id = :hid 
                ORDER BY price_date DESC 
                LIMIT 1
            """), {"hid": holding['id']}).scalar_one_or_none()

            purchase_price = float(holding['purchasePrice'])
            current_price = float(latest_price) if latest_price else purchase_price
            shares = float(holding['shares'])
            
            purchase_value = purchase_price * shares
            current_value = current_price * shares
            gain = current_value - purchase_value
            return_pct = (gain / purchase_value * 100) if purchase_value > 0 else 0

            # 根据资产类型确定风险等级
            risk_level = get_risk_level(holding['type'])
            expected_return = get_expected_return(holding['type'])

            portfolio_item = {
                "id": str(holding['id']),
                "userId": str(holding['userId']),
                "name": holding['name'],
                "type": holding['type'].lower(),
                "amount": float(holding['amount']),
                "shares": shares,
                "purchasePrice": purchase_price,
                "currentPrice": current_price,
                "purchaseDate": "2023-06-01T00:00:00Z",  # TODO: 从数据库获取实际购买日期
                "riskLevel": risk_level,
                "expectedReturn": expected_return,
                "return": round(return_pct, 1),
                "currentValue": round(current_value, 2)
            }
            
            portfolio.append(portfolio_item)
            total_invested += purchase_value
            total_current_value += current_value
            total_gain += gain

        # 2) 计算汇总数据
        total_return_pct = (total_gain / total_invested * 100) if total_invested > 0 else 0
        
        summary = {
            "totalValue": round(total_current_value, 2),
            "totalReturn": round(total_gain, 2),
            "returnPercentage": round(total_return_pct, 1),
            "totalInvested": round(total_invested, 2),
            "totalGain": round(total_gain, 2)
        }

        # 3) 计算资产配置
        asset_allocation = calculate_asset_allocation(portfolio, total_current_value)

    return jsonify({
        "success": True,
        "data": {
            "portfolio": portfolio,
            "summary": summary,
            "assetAllocation": asset_allocation
        },
        "message": "投资组合数据获取成功"
    })


@bp.route('', methods=['POST'])
def create_investment():
    """
    POST /api/investments
    添加新的投资记录
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id
    account_id = 1  # TODO: 从用户账户中选择

    data = request.get_json()
    
    # 验证必需字段
    required_fields = ['name', 'type', 'amount', 'shares', 'purchasePrice']
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "error": f"缺少必需字段: {field}"
            }), 400

    try:
        with engine.begin() as conn:
            # 插入投资记录
            result = conn.execute(text("""
                INSERT INTO holdings 
                (user_id, account_id, product_name, asset_type, quantity, unit_cost)
                VALUES (:uid, :aid, :name, :type, :quantity, :price)
            """), {
                'uid': user_id,
                'aid': account_id,
                'name': data['name'],
                'type': data['type'].upper(),
                'quantity': float(data['shares']),
                'price': float(data['purchasePrice'])
            })
            
            holding_id = result.lastrowid

            # 如果有购买日期，可以添加到其他字段中
            # 这里简化处理，实际项目中可能需要扩展表结构

        return jsonify({
            "success": True,
            "data": {
                "id": holding_id,
                "message": "投资记录添加成功"
            },
            "message": "投资记录添加成功"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"添加投资记录失败: {str(e)}"
        }), 500


def get_risk_level(asset_type):
    """根据资产类型确定风险等级"""
    risk_levels = {
        'STOCK': 'high',
        'BOND': 'low', 
        'FUND': 'medium',
        'CRYPTO': 'high',
        'OPTION': 'high'
    }
    return risk_levels.get(asset_type.upper(), 'medium')


def get_expected_return(asset_type):
    """根据资产类型确定预期收益率"""
    expected_returns = {
        'STOCK': 10.0,
        'BOND': 4.0,
        'FUND': 8.0,
        'CRYPTO': 15.0,
        'OPTION': 12.0
    }
    return expected_returns.get(asset_type.upper(), 8.0)


def calculate_asset_allocation(portfolio, total_value):
    """计算资产配置比例"""
    if total_value == 0:
        return []
    
    # 按类型分组计算
    type_totals = {}
    for item in portfolio:
        asset_type = item['type']
        if asset_type not in type_totals:
            type_totals[asset_type] = 0
        type_totals[asset_type] += item['currentValue']
    
    # 转换为中文分类名称
    type_mapping = {
        'stock': '股票',
        'bond': '债券', 
        'fund': '基金',
        'etf': 'ETF',
        'crypto': '加密货币',
        'option': '期权'
    }
    
    asset_allocation = []
    for asset_type, amount in type_totals.items():
        percentage = (amount / total_value * 100) if total_value > 0 else 0
        asset_allocation.append({
            "category": type_mapping.get(asset_type, asset_type),
            "percentage": round(percentage, 1),
            "amount": round(amount, 2)
        })
    
    # 按金额降序排列
    asset_allocation.sort(key=lambda x: x['amount'], reverse=True)
    
    return asset_allocation 