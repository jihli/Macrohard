import os
from flask import Flask
from sqlalchemy import create_engine


def create_app(config: dict = None) -> Flask:
    """
    Flask 应用工厂
    - 从环境变量 DATABASE_URL 获取数据库 URL
    - 注册各模块 Blueprint

    :param config: 覆盖默认配置，如测试时指定 DB_ENGINE
    """
    app = Flask(__name__)

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

    # 3) 注册模块路由
    from backend.modules.dashboard.controller import bp as dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    from backend.modules.budget.controller import bp as budget_bp
    app.register_blueprint(budget_bp, url_prefix='/api/budget')
    # TODO: 注册其他模块（transactions, goals...）

    return app


if __name__ == '__main__':
    # 直接启动支持 Codespaces 端口映射
    app = create_app()
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(host=host, port=port, debug=True)
