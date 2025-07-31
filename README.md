# Macrohard - 财富管理应用

## 🚀 快速启动

### 前端启动
```bash
cd ./Frontend_new
npm install
npm run dev
```

### 后端启动

#### 方法一：使用启动脚本（推荐）
```bash
# macOS/Linux
chmod +x start_flask.sh
./start_flask.sh

# Windows
start_flask.bat
```

#### 方法二：手动设置环境变量
```bash
cd ./backend
pip install -r requirements.txt
export FLASK_APP=backend.app
export FLASK_ENV=development
flask run --host=0.0.0.0 --port=5001
```

#### 方法三：使用Flask CLI
```bash
cd ./backend
pip install -r requirements.txt
flask --app backend.app run --host=0.0.0.0 --port=5001
```

## 🔧 环境配置

### 1. 复制环境变量文件
```bash
cp env.example .env
```

### 2. 编辑.env文件
```bash
# 设置您的NewsAPI密钥
NEWS_API_KEY=your_actual_api_key_here

# 数据库配置
DATABASE_URL=mysql+pymysql://root:your_password@127.0.0.1/wealth_app

# Flask配置
FLASK_APP=backend.app
FLASK_ENV=development
FLASK_RUN_HOST=0.0.0.0
FLASK_RUN_PORT=5001
```

## 🗄️ 数据库设置

### 初始化数据库
```bash
chmod +x setup_and_deploy.sh
sudo ./setup_and_deploy.sh
```

或者手动执行：
```bash
cd ./Database
chmod +x deploy.sh
./deploy.sh
```

## 🐛 常见问题解决

### 问题1：Flask找不到应用
**错误信息：** `Could not locate a Flask application`

**解决方案：**
```bash
# 设置FLASK_APP环境变量
export FLASK_APP=backend.app

# 或者使用--app参数
flask --app backend.app run
```

### 问题2：端口被占用
**解决方案：**
```bash
# 更改端口
export FLASK_RUN_PORT=5002
flask run --host=0.0.0.0 --port=5002
```

### 问题3：数据库连接失败
**解决方案：**
1. 确保MySQL服务正在运行
2. 检查数据库连接字符串
3. 确保数据库已创建

## 📁 项目结构
```
Macrohard/
├── backend/           # Flask后端API
├── Frontend_new/      # Next.js前端
├── Database/          # 数据库脚本和样本数据
├── tests/            # 测试文件
├── start_flask.sh    # Flask启动脚本
├── start_flask.bat   # Windows启动脚本
└── env.example       # 环境变量示例
```

## 🔗 API文档
- 后端API运行在：http://localhost:5001
- 前端应用运行在：http://localhost:3000
- API文档：查看 `docs/openapi/master.yaml`

## 🧪 运行测试
```bash
cd tests
python -m pytest
```