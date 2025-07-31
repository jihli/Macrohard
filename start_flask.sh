#!/bin/bash

# 设置Flask应用环境变量
export FLASK_APP=backend.app
export FLASK_ENV=development
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5001

# 检查.env文件是否存在，如果存在则加载
if [ -f ".env" ]; then
    echo "📁 加载 .env 文件..."
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "🚀 启动Flask应用..."
echo "📍 应用路径: $FLASK_APP"
echo "🌐 访问地址: http://localhost:$FLASK_RUN_PORT"
echo ""

# 启动Flask应用
flask run --host=$FLASK_RUN_HOST --port=$FLASK_RUN_PORT 