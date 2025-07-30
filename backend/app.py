# backend/app.py


import os
from flask import Flask
from sqlalchemy import create_engine
from flask_cors import CORS

def create_app(config: dict = None) -> Flask:
    """
    应用工厂：创建 Flask 实例并注册各模块路由

    :param config: 测试时注入的额外配置（如 DB_ENGINE）
    """

    app = Flask(__name__)
    # 启用 CORS，允许所有来源
    CORS(app, resources={r"/*": {"origins": "*"}})

    # 根路径首页
    @app.route('/')
    def index():
        return 'Welcome to Wealth App API'

    # 1) 初始化数据库引擎
    db_url = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:Aa11223344@127.0.0.1/wealth_app'
    )
    engine = create_engine(db_url, future=True)
    app.config['DB_ENGINE'] = engine

    # 2) 测试/运行时覆盖配置
    if config:
        app.config.update(config)

    # 3) 注册各模块 Blueprint
    from backend.modules.dashboard.controller import bp as dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')

    from backend.modules.budget.controller import bp as budget_bp
    app.register_blueprint(budget_bp, url_prefix='/api/budget')

    from backend.modules.transactions.controller import bp as tx_bp
    app.register_blueprint(tx_bp, url_prefix='/api/transactions')

    from backend.modules.investments.controller import bp as investments_bp
    app.register_blueprint(investments_bp, url_prefix='/api/investments')

    from backend.modules.tax.controller import bp as tax_bp
    app.register_blueprint(tax_bp, url_prefix='/api/tax')

    from backend.modules.goals.controller import bp as goals_bp
    app.register_blueprint(goals_bp, url_prefix='/api/goals')

    from backend.modules.news.controller import bp as news_bp
    app.register_blueprint(news_bp, url_prefix='/api/news')

    # TODO: 注册其他模块

    return app

# 顶层 app 对象，供 Flask CLI 和 WSGI 使用
app = create_app()

if __name__ == '__main__':
    # 从环境变量读取 host/port，便于 Codespace 端口映射
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(host=host, port=port, debug=True)
