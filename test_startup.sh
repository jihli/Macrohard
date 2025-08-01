#!/bin/bash

# Macrohard Wealth Management System - 启动测试脚本
# 测试前端和后端服务是否正常运行

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

echo "🧪 Macrohard 财富管理系统 - 启动测试"
echo "=================================="
echo ""

# 测试后端服务
print_status "测试后端服务..."
if curl -s http://localhost:5003/ > /dev/null; then
    print_success "后端服务运行正常"
    
    # 测试API端点
    print_status "测试API端点..."
    
    # 测试仪表板API
    if curl -s http://localhost:5003/api/dashboard > /dev/null; then
        print_success "✓ 仪表板API正常"
    else
        print_warning "⚠ 仪表板API无响应"
    fi
    
    # 测试预算API
    if curl -s http://localhost:5003/api/budget > /dev/null; then
        print_success "✓ 预算API正常"
    else
        print_warning "⚠ 预算API无响应"
    fi
    
    # 测试交易API
    if curl -s http://localhost:5003/api/transactions > /dev/null; then
        print_success "✓ 交易API正常"
    else
        print_warning "⚠ 交易API无响应"
    fi
    
    # 测试目标API
    if curl -s http://localhost:5003/api/goals > /dev/null; then
        print_success "✓ 目标API正常"
    else
        print_warning "⚠ 目标API无响应"
    fi
    
    # 测试投资API
    if curl -s http://localhost:5003/api/investments > /dev/null; then
        print_success "✓ 投资API正常"
    else
        print_warning "⚠ 投资API无响应"
    fi
    
    # 测试新闻API
    if curl -s http://localhost:5003/api/news > /dev/null; then
        print_success "✓ 新闻API正常"
    else
        print_warning "⚠ 新闻API无响应"
    fi
    
    # 测试税务API
    if curl -s http://localhost:5003/api/tax > /dev/null; then
        print_success "✓ 税务API正常"
    else
        print_warning "⚠ 税务API无响应"
    fi
    
else
    print_error "后端服务未运行或无法访问"
    print_error "请检查后端服务是否已启动"
    exit 1
fi

echo ""

# 测试前端服务
print_status "测试前端服务..."
if curl -s http://localhost:3001 > /dev/null; then
    print_success "前端服务运行正常"
    
    # 检查前端页面内容
    if curl -s http://localhost:3001 | grep -q "Macrohard\|财富管理\|Wealth"; then
        print_success "✓ 前端页面内容正常"
    else
        print_warning "⚠ 前端页面内容可能有问题"
    fi
    
else
    print_error "前端服务未运行或无法访问"
    print_error "请检查前端服务是否已启动"
    exit 1
fi

echo ""

# 检查端口占用
print_status "检查端口占用..."
BACKEND_PORT=$(lsof -i :5003 2>/dev/null | wc -l)
FRONTEND_PORT=$(lsof -i :3001 2>/dev/null | wc -l)

if [ $BACKEND_PORT -gt 0 ]; then
    print_success "✓ 后端端口 5003 正常占用"
else
    print_error "✗ 后端端口 5003 未被占用"
fi

if [ $FRONTEND_PORT -gt 0 ]; then
    print_success "✓ 前端端口 3001 正常占用"
else
    print_error "✗ 前端端口 3001 未被占用"
fi

echo ""

# 检查进程
print_status "检查进程状态..."
BACKEND_PROCESS=$(pgrep -f "flask run" | wc -l)
FRONTEND_PROCESS=$(pgrep -f "next dev" | wc -l)

if [ $BACKEND_PROCESS -gt 0 ]; then
    print_success "✓ 后端Flask进程正在运行"
else
    print_error "✗ 后端Flask进程未运行"
fi

if [ $FRONTEND_PROCESS -gt 0 ]; then
    print_success "✓ 前端Next.js进程正在运行"
else
    print_error "✗ 前端Next.js进程未运行"
fi

echo ""

# 总结
print_success "🎉 启动测试完成！"
echo ""
echo "📊 测试结果:"
echo "  后端服务: http://localhost:5003"
echo "  前端服务: http://localhost:3001"
echo ""
echo "🌐 访问应用:"
echo "  在浏览器中打开: http://localhost:3001"
echo ""
echo "📝 如果遇到问题:"
echo "  1. 检查日志文件: backend.log, frontend.log"
echo "  2. 重新启动服务: ./start_all.sh"
echo "  3. 查看详细文档: STARTUP_GUIDE.md" 