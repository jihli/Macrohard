# backend/modules/investments/controller.py

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from datetime import datetime

bp = Blueprint('investments', __name__)

@bp.route('', methods=['GET'])
def get_investments():
    """
    GET /api/investments
    Get user's investment portfolio data
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: Get actual user_id from token or parameters

    with engine.connect() as conn:
        # 1) Get all investment holdings
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
            # Get latest price (if available)
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

            # Determine risk level based on asset type
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
                "purchaseDate": "2023-06-01T00:00:00Z",  # TODO: Get actual purchase date from database
                "riskLevel": risk_level,
                "expectedReturn": expected_return,
                "return": round(return_pct, 1),
                "currentValue": round(current_value, 2)
            }
            
            portfolio.append(portfolio_item)
            total_invested += purchase_value
            total_current_value += current_value
            total_gain += gain

        # 2) Calculate summary data
        total_return_pct = (total_gain / total_invested * 100) if total_invested > 0 else 0
        
        summary = {
            "totalValue": round(total_current_value, 2),
            "totalReturn": round(total_gain, 2),
            "returnPercentage": round(total_return_pct, 1),
            "totalInvested": round(total_invested, 2),
            "totalGain": round(total_gain, 2)
        }

        # 3) Calculate asset allocation
        asset_allocation = calculate_asset_allocation(portfolio, total_current_value)

    return jsonify({
        "success": True,
        "data": {
            "portfolio": portfolio,
            "summary": summary,
            "assetAllocation": asset_allocation
        },
        "message": "Investment portfolio data retrieved successfully"
    })


@bp.route('', methods=['POST'])
def create_investment():
    """
    POST /api/investments
    Add new investment record
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: Get actual user_id from token or parameters
    account_id = 1  # TODO: Select from user accounts

    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name', 'type', 'amount', 'shares', 'purchasePrice']
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "error": f"Missing required field: {field}"
            }), 400

    try:
        with engine.begin() as conn:
            # Insert investment record
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

            # If there's a purchase date, it can be added to other fields
            # Simplified handling here, actual projects may need to extend table structure

        return jsonify({
            "success": True,
            "data": {
                "id": holding_id,
                "message": "Investment record added successfully"
            },
            "message": "Investment record added successfully"
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to add investment record: {str(e)}"
        }), 500


def get_risk_level(asset_type):
    """Determine risk level based on asset type"""
    risk_levels = {
        'STOCK': 'high',
        'BOND': 'low', 
        'FUND': 'medium',
        'CRYPTO': 'high',
        'OPTION': 'high'
    }
    return risk_levels.get(asset_type.upper(), 'medium')


def get_expected_return(asset_type):
    """Determine expected return rate based on asset type"""
    expected_returns = {
        'STOCK': 10.0,
        'BOND': 4.0,
        'FUND': 8.0,
        'CRYPTO': 15.0,
        'OPTION': 12.0
    }
    return expected_returns.get(asset_type.upper(), 8.0)


def calculate_asset_allocation(portfolio, total_value):
    """Calculate asset allocation percentages"""
    if total_value == 0:
        return []
    
    # Group by type and calculate
    type_totals = {}
    for item in portfolio:
        asset_type = item['type']
        if asset_type not in type_totals:
            type_totals[asset_type] = 0
        type_totals[asset_type] += item['currentValue']
    
    # Convert to English category names
    type_mapping = {
        'stock': 'Stocks',
        'bond': 'Bonds', 
        'fund': 'Funds',
        'etf': 'ETFs',
        'crypto': 'Cryptocurrency',
        'option': 'Options'
    }
    
    asset_allocation = []
    for asset_type, amount in type_totals.items():
        percentage = (amount / total_value * 100) if total_value > 0 else 0
        asset_allocation.append({
            "category": type_mapping.get(asset_type, asset_type),
            "percentage": round(percentage, 1),
            "amount": round(amount, 2)
        })
    
    # Sort by amount in descending order
    asset_allocation.sort(key=lambda x: x['amount'], reverse=True)
    
    return asset_allocation 