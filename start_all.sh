#!/bin/bash

# Macrohard Wealth Management System - 一键启动脚本
# 同时启动前端和后端服务

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查依赖
check_dependencies() {
    print_status "检查系统依赖..."
    
    # 检查Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 未安装，请先安装 Python 3.11+"
        exit 1
    fi
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装，请先安装 Node.js 18+"
        exit 1
    fi
    
    # 检查npm
    if ! command -v npm &> /dev/null; then
        print_error "npm 未安装，请先安装 npm"
        exit 1
    fi
    
    print_success "系统依赖检查完成"
}

# 检查环境变量文件
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env 文件不存在，正在从示例文件创建..."
        if [ -f "env.example" ]; then
            cp env.example .env
            print_warning "请编辑 .env 文件，设置您的 API 密钥和数据库配置"
            print_warning "特别是 NEWS_API_KEY 和 DATABASE_URL"
        else
            print_error "env.example 文件不存在"
            exit 1
        fi
    fi
}

# 安装Python依赖
install_python_deps() {
    print_status "安装 Python 依赖..."
    if [ -f "requirements.txt" ]; then
        pip3 install -r requirements.txt
        print_success "Python 依赖安装完成"
    else
        print_error "requirements.txt 文件不存在"
        exit 1
    fi
}

# 安装Node.js依赖
install_node_deps() {
    print_status "安装 Node.js 依赖..."
    if [ -d "Frontend_new" ]; then
        cd Frontend_new
        if [ ! -d "node_modules" ]; then
            npm install
            print_success "Node.js 依赖安装完成"
        else
            print_status "Node.js 依赖已存在，跳过安装"
        fi
        cd ..
    else
        print_error "Frontend_new 目录不存在"
        exit 1
    fi
}

# 启动后端服务
start_backend() {
    print_status "启动后端服务..."
    
    # 设置环境变量
    export FLASK_APP=backend.app
    export FLASK_ENV=development
    export FLASK_RUN_HOST=0.0.0.0
    export FLASK_RUN_PORT=5003
    
    # 在后台启动Flask应用
    python3 -m flask run --host=0.0.0.0 --port=5003 > backend.log 2>&1 &
    BACKEND_PID=$!
    
    # 等待后端启动
    sleep 3
    
    # 检查后端是否成功启动
    if curl -s http://localhost:5003/ > /dev/null; then
        print_success "后端服务启动成功 (PID: $BACKEND_PID)"
        print_success "后端API地址: http://localhost:5003"
    else
        print_error "后端服务启动失败，请检查 backend.log"
        exit 1
    fi
}

# 启动前端服务
start_frontend() {
    print_status "启动前端服务..."
    
    cd Frontend_new
    
    # 在后台启动Next.js应用
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    cd ..
    
    # 等待前端启动
    sleep 5
    
    # 检查前端是否成功启动
    if curl -s http://localhost:3001 > /dev/null; then
        print_success "前端服务启动成功 (PID: $FRONTEND_PID)"
        print_success "前端地址: http://localhost:3001"
    else
        print_error "前端服务启动失败，请检查 frontend.log"
        exit 1
    fi
}

# 显示服务状态
show_status() {
    echo ""
    print_success "🎉 所有服务启动完成！"
    echo ""
    echo "📊 服务状态:"
    echo "  后端 API:  http://localhost:5003  (PID: $BACKEND_PID)"
    echo "  前端应用:  http://localhost:3001  (PID: $FRONTEND_PID)"
    echo ""
    echo "📝 日志文件:"
    echo "  后端日志:  backend.log"
    echo "  前端日志:  frontend.log"
    echo ""
    echo "🛑 停止服务:"
    echo "  ./stop_all.sh"
    echo ""
    echo "🔍 查看日志:"
    echo "  tail -f backend.log    # 查看后端日志"
    echo "  tail -f frontend.log   # 查看前端日志"
    echo ""
    print_warning "按 Ctrl+C 停止所有服务"
}

# 清理函数
cleanup() {
    print_status "正在停止服务..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "后端服务已停止"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "前端服务已停止"
    fi
    
    print_success "所有服务已停止"
    exit 0
}

# 设置信号处理
trap cleanup SIGINT SIGTERM

# 主函数
main() {
    echo "🚀 Macrohard 财富管理系统 - 一键启动"
    echo "=================================="
    echo ""
    
    # 检查依赖
    check_dependencies
    
    # 检查环境变量
    check_env_file
    
    # 安装依赖
    install_python_deps
    install_node_deps
    
    # 启动服务
    start_backend
    start_frontend
    
    # 显示状态
    show_status
    
    # 保持脚本运行
    wait
}

# 运行主函数
main 