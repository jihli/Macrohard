# app.py

from flask import Flask, jsonify
from sqlalchemy import create_engine, text

# ------------ 配置 ------------
DB_USER = 'root'
DB_PWD  = 'Aa11223344'
DB_HOST = '127.0.0.1'
DB_NAME = 'wealth_app'

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PWD}@{DB_HOST}/{DB_NAME}",
    echo=False,
    future=True
)

app = Flask(__name__)

# ------------ 路由 ------------
@app.route("/")
def holding_prices():
    with engine.connect() as conn:
        # 查询并映射为 dict 列表
        rows = conn.execute(
            text("SELECT * FROM holding_prices LIMIT 50")
        ).mappings().all()
    # 把每个 RowMapping 转成普通 dict
    data = [dict(r) for r in rows]

    return jsonify({
        "table": "holding_prices",
        "count": len(data),
        "rows": data
    })

# ------------ 启动 ------------
if __name__ == "__main__":
    # 如果在 Codespaces 中运行，需要 host="0.0.0.0"
    app.run(host="0.0.0.0", port=5000, debug=True)
