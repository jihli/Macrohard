#!/bin/bash

# Macrohard Wealth Management System - 停止所有服务脚本

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

echo "🛑 Macrohard 财富管理系统 - 停止所有服务"
echo "=================================="
echo ""

# 停止后端服务 (Flask)
print_status "正在停止后端服务..."
BACKEND_PIDS=$(pgrep -f "flask run" || true)
if [ ! -z "$BACKEND_PIDS" ]; then
    echo "$BACKEND_PIDS" | xargs kill -TERM
    sleep 2
    # 强制停止仍在运行的进程
    BACKEND_PIDS=$(pgrep -f "flask run" || true)
    if [ ! -z "$BACKEND_PIDS" ]; then
        echo "$BACKEND_PIDS" | xargs kill -KILL
    fi
    print_success "后端服务已停止"
else
    print_warning "未找到运行的后端服务"
fi

# 停止前端服务 (Next.js)
print_status "正在停止前端服务..."
FRONTEND_PIDS=$(pgrep -f "next dev" || true)
if [ ! -z "$FRONTEND_PIDS" ]; then
    echo "$FRONTEND_PIDS" | xargs kill -TERM
    sleep 2
    # 强制停止仍在运行的进程
    FRONTEND_PIDS=$(pgrep -f "next dev" || true)
    if [ ! -z "$FRONTEND_PIDS" ]; then
        echo "$FRONTEND_PIDS" | xargs kill -KILL
    fi
    print_success "前端服务已停止"
else
    print_warning "未找到运行的前端服务"
fi

# 停止Node.js进程 (以防万一)
print_status "检查Node.js进程..."
NODE_PIDS=$(pgrep -f "node.*3001" || true)
if [ ! -z "$NODE_PIDS" ]; then
    echo "$NODE_PIDS" | xargs kill -TERM
    sleep 1
    NODE_PIDS=$(pgrep -f "node.*3001" || true)
    if [ ! -z "$NODE_PIDS" ]; then
        echo "$NODE_PIDS" | xargs kill -KILL
    fi
    print_success "Node.js进程已停止"
fi

# 停止Python进程 (以防万一)
print_status "检查Python进程..."
PYTHON_PIDS=$(pgrep -f "python.*flask" || true)
if [ ! -z "$PYTHON_PIDS" ]; then
    echo "$PYTHON_PIDS" | xargs kill -TERM
    sleep 1
    PYTHON_PIDS=$(pgrep -f "python.*flask" || true)
    if [ ! -z "$PYTHON_PIDS" ]; then
        echo "$PYTHON_PIDS" | xargs kill -KILL
    fi
    print_success "Python进程已停止"
fi

echo ""
print_success "🎉 所有服务已成功停止！"
echo ""
echo "📝 清理日志文件 (可选):"
echo "  rm -f backend.log frontend.log"
echo ""
echo "🚀 重新启动服务:"
echo "  ./start_all.sh" 