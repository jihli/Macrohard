#!/usr/bin/env bash
set -e

# 1. 创建目录结构
mkdir -p backend/modules/{dashboard,budget,transactions,goals,investments,tax,news,ai_recommendations,profile} \
         backend/utils \
         docs/openapi \
         tests

# 2. 保留 Database/ 原样，不做重命名或移动

# 3. 把旧的测试脚本移到 tests/
if [ -f Database/test_app.py ]; then
  mv Database/test_app.py tests/
fi
if [ -f Database/test.py ]; then
  mv Database/test.py tests/
fi

# 4. 在 backend/ 下创建占位文件
touch backend/config.py
touch backend/app.py
touch backend/routes.py
touch backend/utils/auth.py
touch backend/utils/db.py

# 5. 根目录下创建 requirements.txt 及 docs/openapi/master.yaml
touch requirements.txt
touch docs/openapi/master.yaml

echo "✅ 目录结构已重组："
tree -L 2 .
