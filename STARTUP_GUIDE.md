# 🚀 Macrohard 财富管理系统 - 启动指南

## 📋 概述

本指南将帮助您快速启动 Macrohard 财富管理系统的前端和后端服务。我们提供了多种启动方式，适用于不同的操作系统和使用场景。

## 🛠️ 启动脚本

### 1. 一键启动脚本 (推荐)

#### Linux/macOS 用户
```bash
# 给脚本添加执行权限 (首次使用)
chmod +x start_all.sh stop_all.sh

# 启动所有服务
./start_all.sh

# 停止所有服务
./stop_all.sh
```

#### Windows 用户
```cmd
# 启动所有服务
start_all.bat

# 停止所有服务
stop_all.bat
```

### 2. 手动启动 (高级用户)

#### 启动后端
```bash
# 设置环境变量
export FLASK_APP=backend.app
export FLASK_ENV=development
export FLASK_RUN_HOST=0.0.0.0
export FLASK_RUN_PORT=5003

# 启动Flask应用
python3 -m flask run --host=0.0.0.0 --port=5003
```

#### 启动前端
```bash
# 进入前端目录
cd Frontend_new

# 安装依赖 (首次使用)
npm install

# 启动开发服务器
npm run dev
```

## 🔧 启动脚本功能

### `start_all.sh` / `start_all.bat` 功能

✅ **自动检查依赖**
- 检查 Python 3.11+
- 检查 Node.js 18+
- 检查 npm

✅ **环境配置**
- 自动创建 `.env` 文件 (如果不存在)
- 从 `env.example` 复制配置模板

✅ **依赖安装**
- 自动安装 Python 依赖 (`requirements.txt`)
- 自动安装 Node.js 依赖 (`package.json`)

✅ **服务启动**
- 启动后端 Flask 服务 (端口 5003)
- 启动前端 Next.js 服务 (端口 3001)
- 自动检查服务启动状态

✅ **状态监控**
- 显示服务运行状态
- 提供日志文件位置
- 显示访问地址

### `stop_all.sh` / `stop_all.bat` 功能

✅ **优雅停止**
- 停止后端 Flask 服务
- 停止前端 Next.js 服务
- 清理相关进程

✅ **强制清理**
- 检查端口占用
- 强制终止残留进程

## 🌐 访问地址

启动成功后，您可以通过以下地址访问系统：

- **前端应用**: http://localhost:3001
- **后端API**: http://localhost:5003
- **API文档**: http://localhost:5003/docs (如果配置了)

## 📝 日志文件

启动脚本会生成以下日志文件：

- `backend.log` - 后端服务日志
- `frontend.log` - 前端服务日志

查看实时日志：
```bash
# 查看后端日志
tail -f backend.log

# 查看前端日志
tail -f frontend.log
```

## ⚠️ 常见问题

### 1. 端口被占用
```bash
# 检查端口占用
lsof -i :5003  # 后端端口
lsof -i :3001  # 前端端口

# 停止占用进程
kill -9 <PID>
```

### 2. 权限问题 (Linux/macOS)
```bash
# 给脚本添加执行权限
chmod +x start_all.sh stop_all.sh
```

### 3. 依赖安装失败
```bash
# 清理并重新安装
rm -rf Frontend_new/node_modules
rm -rf __pycache__
pip install -r requirements.txt
cd Frontend_new && npm install
```

### 4. 环境变量问题
```bash
# 检查.env文件
cat .env

# 重新创建.env文件
cp env.example .env
# 编辑.env文件，设置正确的API密钥和数据库配置
```

## 🔄 开发工作流

### 日常开发
1. 启动服务: `./start_all.sh`
2. 进行开发工作
3. 停止服务: `./stop_all.sh`

### 调试模式
```bash
# 后端调试
cd backend
export FLASK_DEBUG=1
python3 -m flask run --host=0.0.0.0 --port=5003

# 前端调试
cd Frontend_new
npm run dev
```

### 生产部署
```bash
# 构建前端
cd Frontend_new
npm run build

# 启动生产服务
npm start
```

## 📞 技术支持

如果遇到问题，请检查：

1. **系统要求**
   - Python 3.11+
   - Node.js 18+
   - MySQL 8.0+

2. **网络连接**
   - 确保可以访问外部API (NewsAPI.org)
   - 检查防火墙设置

3. **数据库配置**
   - 确保MySQL服务正在运行
   - 检查数据库连接字符串

4. **API密钥**
   - 确保在 `.env` 文件中设置了正确的 `NEWS_API_KEY`

## 🎯 快速开始

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Macrohard
   ```

2. **配置环境**
   ```bash
   cp env.example .env
   # 编辑.env文件，设置API密钥和数据库配置
   ```

3. **启动服务**
   ```bash
   ./start_all.sh
   ```

4. **访问应用**
   - 打开浏览器访问: http://localhost:3001
   - 开始使用财富管理系统！

---

**注意**: 首次启动可能需要较长时间来安装依赖。后续启动会更快。 