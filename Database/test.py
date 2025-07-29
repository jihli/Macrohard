#!/usr/bin/env python3

from sqlalchemy import create_engine, text

# 1. 配置数据库连接
DB_USER = 'root'
DB_PWD  = 'Aa11223344'
DB_HOST = '127.0.0.1'
DB_NAME = 'wealth_app'

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PWD}@{DB_HOST}/{DB_NAME}",
    echo=False,
    future=True
)

def main():
    with engine.connect() as conn:
        # 2. 查询并直接映射成 dict
        rows = conn.execute(
            text("SELECT * FROM holding_prices")
        ).mappings().all()

    # 3. 打印输出
    print(f"Total rows: {len(rows)}\n")
    for row in rows:
        print(row)

if __name__ == "__main__":
    main()
