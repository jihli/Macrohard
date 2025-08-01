# API 设置指南

## 🔑 NewsAPI.org 设置

### 1. 获取API密钥
1. 访问 [NewsAPI.org](https://newsapi.org/)
2. 注册免费账户
3. 获取您的API密钥

### 2. 配置环境变量

#### 方法一：使用.env文件（推荐）
```bash
# 复制示例文件
cp env.example .env

# 编辑.env文件，填入您的API密钥
NEWS_API_KEY=your_actual_api_key_here
```

#### 方法二：直接在终端设置
```bash
# macOS/Linux
export NEWS_API_KEY=your_actual_api_key_here

# Windows
set NEWS_API_KEY=your_actual_api_key_here
```

### 3. 验证设置
```bash
# 启动Flask应用
export FLASK_APP=backend.app
flask run --host=0.0.0.0 --port=5003

# 测试API
curl "http://localhost:5003/api/news?category=finance&limit=2"
```

## 🔒 安全注意事项

- ✅ `.env` 文件已被添加到 `.gitignore`，不会被提交到Git
- ✅ API密钥不会出现在代码中
- ✅ 每个开发者需要设置自己的API密钥
- ❌ 不要将API密钥提交到版本控制系统

## 📝 队友设置步骤

1. 克隆项目后，复制 `env.example` 为 `.env`
2. 在 `.env` 文件中填入自己的NewsAPI.org API密钥
3. 启动Flask应用进行测试

## 🚨 重要提醒

- 如果您看到API密钥硬编码在代码中，请立即联系项目维护者
- 定期检查 `.gitignore` 文件确保 `.env` 被正确忽略
- 如果API密钥泄露，请立即在NewsAPI.org上重新生成 