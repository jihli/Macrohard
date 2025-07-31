#!/bin/bash
set -e

echo "🚀 开始设置 Macrohard 开发环境..."

# 更新包管理器
sudo apt-get update

# 安装系统依赖
sudo apt-get install -y \
    python3-pip \
    python3-venv \
    nodejs \
    npm \
    mysql-client \
    git

# 设置Python环境
echo "📦 安装Python依赖..."
pip3 install --user -r requirements.txt

# 设置Node.js环境
echo "📦 安装Node.js依赖..."
cd Frontend_new
npm install
cd ..

# 设置数据库
echo "🗄️ 初始化数据库..."
if [ -f "Database/deploy.sh" ]; then
    chmod +x Database/deploy.sh
    # 注意：在Codespace中可能需要调整数据库配置
    echo "数据库初始化脚本已准备就绪"
fi

# 设置启动脚本权限
chmod +x start_flask.sh

# 创建.env文件（如果不存在）
if [ ! -f ".env" ]; then
    echo "📝 创建.env文件..."
    cp env.example .env
    echo "请编辑.env文件设置您的API密钥"
fi

echo "✅ 开发环境设置完成！"
echo ""
echo "🎯 启动命令："
echo "  后端: ./start_flask.sh"
echo "  前端: cd Frontend_new && npm run dev"
echo ""
echo "🌐 访问地址："
echo "  后端API: http://localhost:5001"
echo "  前端应用: http://localhost:3000" 