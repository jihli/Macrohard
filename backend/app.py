import os
from flask import Flask
from sqlalchemy import create_engine


def create_app(config: dict = None) -> Flask:
    """
    Flask 应用工厂，返回配置好数据库引擎和路由的 Flask 实例
    :param config: 可选配置字典，用于测试或覆盖默认设置
    """
    app = Flask(__name__)

    # 1. 数据库连接 URL，可通过环境变量 DATABASE_URL 覆盖
    #    示例：mysql+pymysql://root:密码@127.0.0.1/wealth_app
    db_url = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:Aa11223344@127.0.0.1/wealth_app'
    )
    engine = create_engine(db_url, future=True)
    app.config['DB_ENGINE'] = engine

    # 2. 外部传入配置（如测试中传入 SQLite engine）
    if config:
        app.config.update(config)

    # 3. 注册各功能模块的 Blueprint
    from modules.dashboard.controller import bp as dashboard_bp
    app.register_blueprint(dashboard_bp, url_prefix='/api/dashboard')
    # TODO: 后续注册 budget, transactions, goals, investments... 模块

    return app


if __name__ == '__main__':
    # 运行在所有接口，方便 Docker / Codespaces 端口转发
    app = create_app()
    host = os.getenv('FLASK_RUN_HOST', '0.0.0.0')
    port = int(os.getenv('FLASK_RUN_PORT', 5000))
    app.run(host=host, port=port, debug=True)
