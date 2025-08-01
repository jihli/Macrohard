# backend/modules/goals/controller.py

from flask import Blueprint, jsonify, request, current_app
from sqlalchemy import text
from datetime import date, datetime, timedelta

bp = Blueprint('goals', __name__)

@bp.route('', methods=['GET'])
def get_goals():
    """
    GET /api/goals
    获取用户的所有财务目标
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    with engine.connect() as conn:
        # 1) 获取所有目标
        goals_data = conn.execute(text("""
            SELECT 
                g.goal_id AS id,
                g.user_id AS userId,
                g.goal_name AS name,
                g.target_amount AS targetAmount,
                g.current_amount AS currentAmount,
                g.deadline,
                g.priority,
                g.goal_type AS type,
                g.is_active AS isActive
            FROM goals g
            WHERE g.user_id = :uid
            ORDER BY g.priority DESC, g.deadline ASC
        """), {"uid": user_id}).mappings().all()

        goals = []
        total_target = 0
        total_current = 0
        active_goals = 0

        for goal_data in goals_data:
            target_amount = float(goal_data['targetAmount'])
            current_amount = float(goal_data['currentAmount'])
            deadline = goal_data['deadline']
            
            # 计算进度百分比
            percentage = (current_amount / target_amount * 100) if target_amount > 0 else 0
            
            # 计算剩余金额
            remaining_amount = max(0, target_amount - current_amount)
            
            # 计算剩余天数
            days_remaining = (deadline - date.today()).days if deadline else 0
            
            goal = {
                "id": str(goal_data['id']),
                "userId": str(goal_data['userId']),
                "name": goal_data['name'],
                "targetAmount": target_amount,
                "currentAmount": current_amount,
                "deadline": deadline.isoformat() + "T00:00:00Z" if deadline else None,
                "priority": goal_data['priority'].lower(),
                "type": goal_data['type'],
                "isActive": bool(goal_data['isActive']),
                "percentage": round(percentage, 1),
                "remainingAmount": remaining_amount,
                "daysRemaining": max(0, days_remaining)
            }
            
            goals.append(goal)
            total_target += target_amount
            total_current += current_amount
            if goal_data['isActive']:
                active_goals += 1

        # 2) 计算统计信息
        average_progress = (total_current / total_target * 100) if total_target > 0 else 0
        
        statistics = {
            "totalGoals": len(goals),
            "activeGoals": active_goals,
            "totalTargetAmount": round(total_target, 2),
            "totalCurrentAmount": round(total_current, 2),
            "averageProgress": round(average_progress, 1)
        }

    return jsonify({
        "success": True,
        "data": {
            "goals": goals,
            "statistics": statistics
        },
        "message": "目标数据获取成功"
    })


@bp.route('', methods=['POST'])
def create_goal():
    """
    POST /api/goals
    创建新的财务目标
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    data = request.get_json()
    
    # 验证必需字段
    required_fields = ['name', 'targetAmount', 'deadline', 'priority', 'type']
    for field in required_fields:
        if field not in data:
            return jsonify({
                "success": False,
                "error": f"缺少必需字段: {field}"
            }), 400

    try:
        # 解析截止日期
        deadline_str = data['deadline']
        if deadline_str.endswith('Z'):
            deadline_str = deadline_str[:-1]  # 移除 Z 后缀
        deadline = datetime.fromisoformat(deadline_str).date()

        with engine.begin() as conn:
            # 插入新目标
            result = conn.execute(text("""
                INSERT INTO goals 
                (user_id, goal_name, target_amount, current_amount, deadline, priority, goal_type, is_active)
                VALUES (:uid, :name, :target, :current, :deadline, :priority, :type, :active)
            """), {
                'uid': user_id,
                'name': data['name'],
                'target': float(data['targetAmount']),
                'current': 0.0,  # 新目标当前金额为0
                'deadline': deadline,
                'priority': data['priority'].upper(),
                'type': data['type'],
                'active': True
            })
            
            goal_id = result.lastrowid

        return jsonify({
            "success": True,
            "data": {
                "id": goal_id,
                "message": "目标创建成功"
            },
            "message": "目标创建成功"
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "error": f"日期格式错误: {str(e)}"
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"创建目标失败: {str(e)}"
        }), 500


@bp.route('/<int:goal_id>/progress', methods=['PUT'])
def update_goal_progress(goal_id):
    """
    PUT /api/goals/:id/progress
    更新目标的当前进度
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    data = request.get_json()
    
    if 'currentAmount' not in data:
        return jsonify({
            "success": False,
            "error": "缺少必需字段: currentAmount"
        }), 400

    try:
        current_amount = float(data['currentAmount'])
        if current_amount < 0:
            return jsonify({
                "success": False,
                "error": "当前金额不能为负数"
            }), 400

        with engine.begin() as conn:
            # 检查目标是否存在且属于当前用户
            goal = conn.execute(text("""
                SELECT goal_id, target_amount 
                FROM goals 
                WHERE goal_id = :gid AND user_id = :uid
            """), {"gid": goal_id, "uid": user_id}).fetchone()
            
            if not goal:
                return jsonify({
                    "success": False,
                    "error": "目标不存在或无权限访问"
                }), 404

            target_amount = float(goal['target_amount'])
            
            # 检查当前金额是否超过目标金额
            if current_amount > target_amount:
                return jsonify({
                    "success": False,
                    "error": "当前金额不能超过目标金额"
                }), 400

            # 更新目标进度
            conn.execute(text("""
                UPDATE goals 
                SET current_amount = :current 
                WHERE goal_id = :gid AND user_id = :uid
            """), {
                'current': current_amount,
                'gid': goal_id,
                'uid': user_id
            })

        return jsonify({
            "success": True,
            "data": {
                "id": goal_id,
                "currentAmount": current_amount,
                "percentage": round((current_amount / target_amount * 100), 1)
            },
            "message": "目标进度更新成功"
        })

    except ValueError:
        return jsonify({
            "success": False,
            "error": "当前金额格式错误"
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"更新目标进度失败: {str(e)}"
        }), 500


@bp.route('/<int:goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
    """
    DELETE /api/goals/:id
    删除指定的财务目标
    """
    engine = current_app.config['DB_ENGINE']
    user_id = 1  # TODO: 从 token 或参数获取实际 user_id

    try:
        with engine.begin() as conn:
            # 检查目标是否存在且属于当前用户
            goal = conn.execute(text("""
                SELECT goal_id 
                FROM goals 
                WHERE goal_id = :gid AND user_id = :uid
            """), {"gid": goal_id, "uid": user_id}).fetchone()
            
            if not goal:
                return jsonify({
                    "success": False,
                    "error": "目标不存在或无权限访问"
                }), 404

            # 删除目标
            conn.execute(text("""
                DELETE FROM goals 
                WHERE goal_id = :gid AND user_id = :uid
            """), {"gid": goal_id, "uid": user_id})

        return jsonify({
            "success": True,
            "message": "目标删除成功"
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"删除目标失败: {str(e)}"
        }), 500 