#!/usr/bin/env bash
set -euo pipefail

# ———— 配置 ————
DB_USER="root"
DB_PWD="Aa11223344"
DB_HOST="127.0.0.1"
DB_PORT="3306"
SQL_INIT_FILE="init_wealth.sql"
EXCEL_FILE="wealth_sample_2025.xlsx"

echo "📦 1. 初始化数据库 schema …"
mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PWD}" < "${SQL_INIT_FILE}"
echo "✅ Schema 初始化完成。"

echo "📦 2. 安装 Python 依赖（如已安装可跳过）…"
pip3 install --user pandas openpyxl sqlalchemy pymysql

echo "📦 3. 导入 Excel 数据到 MySQL …"
python3 - <<'PYCODE'
import os
import pandas as pd
from sqlalchemy import create_engine, text

# 从上层脚本读取
DB_USER = "root"
DB_PWD  = "Aa11223344"
DB_HOST = "127.0.0.1"
DB_PORT = "3306"
DB_NAME = "wealth_app"
EXCEL   = "wealth_sample_2025.xlsx"

engine = create_engine(
    f"mysql+pymysql://{DB_USER}:{DB_PWD}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
)

sheet_to_table = {
    "users": "users",
    "accounts": "accounts",
    "categories": "categories",
    "transactions": "transactions",
    "recurring_transactions": "recurring_transactions",
    "holdings": "holdings",
    "holding_prices": "holding_prices",
    "budgets": "budgets",
    "networth_daily": "networth_daily",
}

with engine.begin() as conn:
    # 关闭外键检查，允许 TRUNCATE
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
    for tbl in sheet_to_table.values():
        conn.execute(text(f"TRUNCATE TABLE {tbl};"))
    conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))

    xls = pd.ExcelFile(EXCEL, engine="openpyxl")
    for sheet, table in sheet_to_table.items():
        df = pd.read_excel(xls, sheet_name=sheet)
        if df.empty:
            print(f"⚠️  表 {sheet} 为空，跳过导入")
            continue
        df.to_sql(table, conn, if_exists="append", index=False, chunksize=500)
        print(f"✅  {sheet} → {table} ({len(df)} 行)")

print("🎉 全部数据导入成功！")
PYCODE

echo "🎯 部署完成！"
