# Macrohard Wealth Management System

[English](#english) | [中文](#chinese)

---

## English

### 🏦 Project Overview

**Macrohard Wealth Management System** is a comprehensive financial management platform that helps users track their wealth, manage budgets, set financial goals, and make informed investment decisions. The system provides real-time financial insights, AI-powered recommendations, and a modern user interface for effective wealth management.

### 🚀 Key Features

- **📊 Dashboard Analytics**: Real-time overview of financial health, assets, and spending patterns
- **💰 Budget Management**: Track expenses, set budgets, and monitor spending across categories
- **🎯 Goal Setting**: Set and track financial goals with progress visualization
- **📈 Investment Portfolio**: Monitor investments, track performance, and get allocation insights
- **📰 Financial News**: Real-time financial news with sentiment analysis and AI recommendations
- **🧮 Tax Planning**: Tax estimation and optimization recommendations
- **📱 Modern UI**: Responsive design with beautiful charts and intuitive navigation
- **🤖 AI Recommendations**: Intelligent suggestions for wealth optimization

### 🏗️ Architecture

```
Macrohard/
├── Frontend_new/          # Next.js React Frontend
├── backend/              # Flask Python Backend
├── Database/             # MySQL Database & Scripts
├── docs/                 # API Documentation
├── tests/                # Test Suite
└── .devcontainer/        # Development Environment
```

### 🛠️ Technology Stack

#### Frontend
- **Framework**: Next.js 14 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: Headless UI, Heroicons
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

#### Backend
- **Framework**: Flask (Python)
- **Database**: MySQL with SQLAlchemy ORM
- **API**: RESTful API with CORS support
- **External APIs**: NewsAPI.org for financial news
- **Testing**: pytest

#### Database
- **Engine**: MySQL 8.0
- **Schema**: Comprehensive financial data model
- **Features**: Foreign key constraints, indexes, triggers

### 📦 Installation & Setup

#### Prerequisites
- Node.js 18+
- Python 3.11+
- MySQL 8.0+
- Git

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Macrohard
```

#### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your API keys and database credentials

# Initialize database
cd Database
chmod +x deploy.sh
./deploy.sh
cd ..
```

#### 3. Frontend Setup
```bash
cd Frontend_new
npm install
```

#### 4. Start the Application

##### Option A: One-Command Startup (Recommended)
```bash
# Linux/macOS
./start_all.sh

# Windows
start_all.bat
```

##### Option B: Manual Startup
```bash
# Terminal 1: Start Backend
./start_flask.sh

# Terminal 2: Start Frontend
cd Frontend_new
npm run dev
```

### 🌐 Access Points
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5003
- **Database**: localhost:3306

### 🛑 Stop Services
```bash
# Linux/macOS
./stop_all.sh

# Windows
stop_all.bat
```

### 📁 Project Structure

#### Frontend (`Frontend_new/`)
```
app/                    # Next.js App Router
├── page.tsx           # Home page
├── dashboard/         # Dashboard components
├── budget/           # Budget management
├── goals/            # Financial goals
├── investments/      # Investment portfolio
├── news/             # Financial news
├── tax/              # Tax planning
├── transactions/     # Transaction history
└── profile/          # User profile
components/           # Reusable UI components
├── dashboard/        # Dashboard-specific components
├── layout/           # Layout components
└── transactions/     # Transaction components
hooks/                # Custom React hooks
lib/                  # Utility libraries
types/                # TypeScript type definitions
```

#### Backend (`backend/`)
```
app.py                # Flask application factory
config.py             # Configuration settings
routes.py             # Route definitions
modules/              # Feature modules
├── dashboard/        # Dashboard analytics
├── budget/           # Budget management
├── transactions/     # Transaction handling
├── investments/      # Investment portfolio
├── goals/            # Financial goals
├── news/             # Financial news
└── tax/              # Tax calculations
utils/                # Utility functions
├── auth.py           # Authentication
└── db.py             # Database utilities
```

#### Database (`Database/`)
```
init_wealth.sql       # Database schema
deploy.sh             # Database deployment script
wealth_sample_2025.xlsx # Sample data
create_goals_table.sql # Goals table schema
```

### 🔧 API Endpoints

#### Dashboard
- `GET /api/dashboard` - Get dashboard overview data

#### Budget
- `GET /api/budget` - Get budget information
- `PUT /api/budget` - Update budget settings

#### Transactions
- `GET /api/transactions` - Get transaction history
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/<id>` - Update transaction
- `DELETE /api/transactions/<id>` - Delete transaction

#### Goals
- `GET /api/goals` - Get financial goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/<id>/progress` - Update goal progress
- `DELETE /api/goals/<id>` - Delete goal

#### Investments
- `GET /api/investments` - Get investment portfolio
- `POST /api/investments` - Add new investment

#### News
- `GET /api/news` - Get financial news with AI analysis

#### Tax
- `GET /api/tax` - Get tax estimation and recommendations

### 🧪 Testing

```bash
# Run all tests
pytest tests/

# Run specific test modules
pytest tests/test_budget_api.py
pytest tests/test_news_api.py
```

### 🚀 Deployment

#### Development Environment
The project includes a VS Code Dev Container configuration for consistent development environments.

#### Production Deployment
1. Set up production database
2. Configure environment variables
3. Build frontend: `npm run build`
4. Deploy backend with WSGI server
5. Set up reverse proxy (nginx)

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### 📄 License

MIT License - see LICENSE file for details

---

## Chinese

### 🏦 项目概述

**Macrohard 财富管理系统** 是一个综合性的财务管理平台，帮助用户跟踪财富、管理预算、设定财务目标并做出明智的投资决策。系统提供实时财务洞察、AI驱动的建议和现代化的用户界面，实现有效的财富管理。

### 🚀 核心功能

- **📊 仪表板分析**: 财务健康、资产和支出模式的实时概览
- **💰 预算管理**: 跟踪支出、设定预算并监控各类别支出
- **🎯 目标设定**: 设定和跟踪财务目标，可视化进度
- **📈 投资组合**: 监控投资、跟踪表现并获取配置洞察
- **📰 财经新闻**: 实时财经新闻，包含情感分析和AI建议
- **🧮 税务规划**: 税务估算和优化建议
- **📱 现代界面**: 响应式设计，美观图表和直观导航
- **🤖 AI建议**: 财富优化的智能建议

### 🏗️ 架构设计

```
Macrohard/
├── Frontend_new/          # Next.js React 前端
├── backend/              # Flask Python 后端
├── Database/             # MySQL 数据库和脚本
├── docs/                 # API 文档
├── tests/                # 测试套件
└── .devcontainer/        # 开发环境
```

### 🛠️ 技术栈

#### 前端
- **框架**: Next.js 14 + React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **UI组件**: Headless UI, Heroicons
- **表单**: React Hook Form + Zod 验证
- **动画**: Framer Motion

#### 后端
- **框架**: Flask (Python)
- **数据库**: MySQL + SQLAlchemy ORM
- **API**: RESTful API，支持CORS
- **外部API**: NewsAPI.org 财经新闻
- **测试**: pytest

#### 数据库
- **引擎**: MySQL 8.0
- **架构**: 综合性财务数据模型
- **特性**: 外键约束、索引、触发器

### 📦 安装和设置

#### 前置要求
- Node.js 18+
- Python 3.11+
- MySQL 8.0+
- Git

#### 1. 克隆仓库
```bash
git clone <repository-url>
cd Macrohard
```

#### 2. 后端设置
```bash
# 安装Python依赖
pip install -r requirements.txt

# 设置环境变量
cp env.example .env
# 编辑.env文件，填入您的API密钥和数据库凭据

# 初始化数据库
cd Database
chmod +x deploy.sh
./deploy.sh
cd ..
```

#### 3. 前端设置
```bash
cd Frontend_new
npm install
```

#### 4. 启动应用

##### 选项A: 一键启动 (推荐)
```bash
# Linux/macOS
./start_all.sh

# Windows
start_all.bat
```

##### 选项B: 手动启动
```bash
# 终端1: 启动后端
./start_flask.sh

# 终端2: 启动前端
cd Frontend_new
npm run dev
```

### 🌐 访问地址
- **前端**: http://localhost:3001
- **后端API**: http://localhost:5003
- **数据库**: localhost:3306

### 🛑 停止服务
```bash
# Linux/macOS
./stop_all.sh

# Windows
stop_all.bat
```

### 📁 项目结构

#### 前端 (`Frontend_new/`)
```
app/                    # Next.js App Router
├── page.tsx           # 首页
├── dashboard/         # 仪表板组件
├── budget/           # 预算管理
├── goals/            # 财务目标
├── investments/      # 投资组合
├── news/             # 财经新闻
├── tax/              # 税务规划
├── transactions/     # 交易历史
└── profile/          # 用户资料
components/           # 可复用UI组件
├── dashboard/        # 仪表板专用组件
├── layout/           # 布局组件
└── transactions/     # 交易组件
hooks/                # 自定义React钩子
lib/                  # 工具库
types/                # TypeScript类型定义
```

#### 后端 (`backend/`)
```
app.py                # Flask应用工厂
config.py             # 配置设置
routes.py             # 路由定义
modules/              # 功能模块
├── dashboard/        # 仪表板分析
├── budget/           # 预算管理
├── transactions/     # 交易处理
├── investments/      # 投资组合
├── goals/            # 财务目标
├── news/             # 财经新闻
└── tax/              # 税务计算
utils/                # 工具函数
├── auth.py           # 认证
└── db.py             # 数据库工具
```

#### 数据库 (`Database/`)
```
init_wealth.sql       # 数据库架构
deploy.sh             # 数据库部署脚本
wealth_sample_2025.xlsx # 示例数据
create_goals_table.sql # 目标表架构
```

### 🔧 API接口

#### 仪表板
- `GET /api/dashboard` - 获取仪表板概览数据

#### 预算
- `GET /api/budget` - 获取预算信息
- `PUT /api/budget` - 更新预算设置

#### 交易
- `GET /api/transactions` - 获取交易历史
- `POST /api/transactions` - 创建新交易
- `PUT /api/transactions/<id>` - 更新交易
- `DELETE /api/transactions/<id>` - 删除交易

#### 目标
- `GET /api/goals` - 获取财务目标
- `POST /api/goals` - 创建新目标
- `PUT /api/goals/<id>/progress` - 更新目标进度
- `DELETE /api/goals/<id>` - 删除目标

#### 投资
- `GET /api/investments` - 获取投资组合
- `POST /api/investments` - 添加新投资

#### 新闻
- `GET /api/news` - 获取财经新闻和AI分析

#### 税务
- `GET /api/tax` - 获取税务估算和建议

### 🧪 测试

```bash
# 运行所有测试
pytest tests/

# 运行特定测试模块
pytest tests/test_budget_api.py
pytest tests/test_news_api.py
```

### 🚀 部署

#### 开发环境
项目包含VS Code Dev Container配置，确保开发环境一致性。

#### 生产部署
1. 设置生产数据库
2. 配置环境变量
3. 构建前端: `npm run build`
4. 使用WSGI服务器部署后端
5. 设置反向代理(nginx)

### 🤝 贡献指南

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 为新功能添加测试
5. 提交拉取请求

### 📄 许可证

MIT许可证 - 详见LICENSE文件

---

## 📞 Support & Contact

For support, questions, or contributions, please contact the development team.

如需支持、问题或贡献，请联系开发团队。