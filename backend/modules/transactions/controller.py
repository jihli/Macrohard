# backend/modules/transactions/controller.py

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from datetime import datetime

bp = Blueprint('transactions', __name__)

@bp.route('', methods=['GET'])
def get_transactions():
    """
    GET /api/transactions
    获取用户的交易记录列表，支持分页和筛选
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    # 查询参数
    page       = int(request.args.get('page', 1))
    limit      = int(request.args.get('limit', 20))
    category   = request.args.get('category')
    tx_type    = request.args.get('type')       # 'income' 或 'expense'
    start_date = request.args.get('startDate')  # ISO 格式
    end_date   = request.args.get('endDate')

    # 动态构建 WHERE 子句
    filters = ['t.user_id = :uid']
    params  = {'uid': user_id}

    if category:
        filters.append('c.name = :cat')
        params['cat'] = category
    if tx_type:
        if tx_type.lower() == 'income':
            filters.append("t.flow_type = 'Income'")
        else:
            filters.append("t.flow_type = 'Spending'")
    if start_date:
        filters.append('t.txn_date >= :start_date')
        params['start_date'] = start_date[:10]
    if end_date:
        filters.append('t.txn_date <= :end_date')
        params['end_date'] = end_date[:10]

    where_clause = ' AND '.join(filters)

    with engine.connect() as conn:
        # 1) 统计总数
        total = conn.execute(
            text(f"SELECT COUNT(*) FROM transactions t JOIN categories c ON t.category_id=c.category_id WHERE {where_clause}"),
            params
        ).scalar_one()

        total_pages = (total + limit - 1) // limit
        offset = (page - 1) * limit

        # 2) 分页查询
        rows = conn.execute(
            text(f"""
                SELECT
                  t.transaction_id AS id,
                  t.user_id         AS userId,
                  CASE WHEN t.flow_type = 'Spending' THEN -t.amount ELSE t.amount END AS amount,
                  CASE t.flow_type WHEN 'Income' THEN 'income' ELSE 'expense' END  AS type,
                  c.name            AS category,
                  t.description,
                  t.txn_date        AS date
                FROM transactions t
                JOIN categories c ON t.category_id = c.category_id
                WHERE {where_clause}
                ORDER BY t.txn_date DESC
                LIMIT :limit OFFSET :offset
            """),
            {**params, 'limit': limit, 'offset': offset}
        ).mappings().all()

    transactions = []
    for r in rows:
        transactions.append({**r, 'tags': [], 'location': None})

    return jsonify({
        'success': True,
        'data': {
            'transactions': transactions,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'totalPages': total_pages
            }
        },
        'message': '交易记录获取成功'
    })


@bp.route('', methods=['POST'])
def create_transaction():
    """
    POST /api/transactions
    添加新的交易记录。
    """
    engine     = current_app.config['DB_ENGINE']
    user_id    = 1
    account_id = 1  # TODO: 真实场景中取自用户账户

    data      = request.get_json()
    flow_type = 'Income' if data.get('type','').lower() == 'income' else 'Spending'
    amount    = abs(data.get('amount', 0))
    txn_date  = data.get('date','')[:10]  # 只保留 YYYY-MM-DD

    with engine.begin() as conn:
        # 查 category_id
        cid = conn.execute(
            text("SELECT category_id FROM categories WHERE name = :name"),
            {'name': data.get('category')}
        ).scalar_one()
        # 插入
        res = conn.execute(
            text("""
                INSERT INTO transactions
                  (user_id, account_id, category_id, txn_date, flow_type, amount, description)
                VALUES
                  (:uid, :aid, :cid, :date, :flow, :amt, :desc)
            """),
            {
                'uid': user_id,
                'aid': account_id,
                'cid': cid,
                'date': txn_date,
                'flow': flow_type,
                'amt': amount,
                'desc': data.get('description')
            }
        )
        tx_id = res.lastrowid

    return jsonify({'success': True, 'data': {'id': tx_id}, 'message': '交易记录添加成功'}), 201


@bp.route('/<int:tx_id>', methods=['PUT'])
def update_transaction(tx_id):
    """
    PUT /api/transactions/:id
    更新指定的交易记录。
    """
    engine = current_app.config['DB_ENGINE']
    data   = request.get_json()

    # 构建更新字段
    fields = []
    params = {'tx_id': tx_id}

    with engine.begin() as conn:
        # 更新 category_id
        if 'category' in data:
            cid = conn.execute(
                text("SELECT category_id FROM categories WHERE name = :name"),
                {'name': data['category']}
            ).scalar_one_or_none()
            if cid is not None:
                conn.execute(
                    text("UPDATE transactions SET category_id = :cid WHERE transaction_id = :tx_id"),
                    {'cid': cid, 'tx_id': tx_id}
                )

        # 更新其他字段
        if 'amount' in data:
            fields.append('amount = :amt')
            params['amt'] = abs(data['amount'])
        if 'type' in data:
            flow = 'Income' if data['type'].lower() == 'income' else 'Spending'
            fields.append('flow_type = :flow_type')
            params['flow_type'] = flow
        if 'description' in data:
            fields.append('description = :desc')
            params['desc'] = data['description']
        if 'date' in data:
            fields.append('txn_date = :date')
            params['date'] = data['date'][:10]

        if fields:
            sql = 'UPDATE transactions SET ' + ', '.join(fields) + ' WHERE transaction_id = :tx_id'
            conn.execute(text(sql), params)

    return jsonify({'success': True, 'message': '交易记录更新成功'})


@bp.route('/<int:tx_id>', methods=['DELETE'])
def delete_transaction(tx_id):
    """
    DELETE /api/transactions/:id
    删除指定的交易记录。
    """
    engine = current_app.config['DB_ENGINE']
    with engine.begin() as conn:
        conn.execute(text("DELETE FROM transactions WHERE transaction_id = :tx_id"), {'tx_id': tx_id})
    return jsonify({'success': True, 'message': '交易记录删除成功'})
