# 🚀 快速启动指南

## 一键启动 (推荐)

### Linux/macOS
```bash
# 1. 给脚本添加执行权限 (首次使用)
chmod +x start_all.sh stop_all.sh test_startup.sh

# 2. 启动所有服务
./start_all.sh

# 3. 测试服务是否正常
./test_startup.sh

# 4. 停止所有服务
./stop_all.sh
```

### Windows
```cmd
# 1. 启动所有服务
start_all.bat

# 2. 停止所有服务
stop_all.bat
```

## 访问地址

启动成功后，在浏览器中访问：
- **前端应用**: http://localhost:3001
- **后端API**: http://localhost:5003

## 常见问题

### 端口被占用
```bash
# 检查端口占用
lsof -i :5003  # 后端
lsof -i :3001  # 前端

# 停止占用进程
kill -9 <PID>
```

### 权限问题
```bash
chmod +x start_all.sh stop_all.sh test_startup.sh
```

### 依赖问题
```bash
# 重新安装依赖
pip install -r requirements.txt
cd Frontend_new && npm install
```

## 详细文档

- 📖 完整启动指南: [STARTUP_GUIDE.md](STARTUP_GUIDE.md)
- 📋 项目文档: [README.md](README.md)
- 🔧 API文档: [Frontend_new/API_DOCUMENTATION.md](Frontend_new/API_DOCUMENTATION.md) 