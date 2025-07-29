# API Documentation - 智能财富管理系统

## 概述

本文档描述了智能财富管理系统的API接口规范。系统提供完整的个人财务管理功能，包括预算管理、交易跟踪、投资组合、目标管理等。

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (待实现)
- **响应格式**: JSON

## 通用响应格式

```json
{
  "success": boolean,
  "data": object | array,
  "message": string,
  "timestamp": string
}
```

## 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details": object
  },
  "timestamp": string
}
```

---

## 1. 仪表板 API

### 获取仪表板数据

**GET** `/api/dashboard`

获取用户的仪表板概览数据，包括总余额、月度收支、预算进度、最近交易等。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "totalBalance": 125680,
    "monthlyIncome": 15200,
    "monthlyExpenses": 8450,
    "savingsRate": 44.2,
    "budgetProgress": [
      {
        "category": "food",
        "budgeted": 1500,
        "spent": 1200,
        "percentage": 80
      }
    ],
    "recentTransactions": [
      {
        "id": "1",
        "userId": "user1",
        "amount": -45,
        "type": "expense",
        "category": "food",
        "description": "星巴克咖啡",
        "date": "2024-01-15T10:30:00Z",
        "tags": ["餐饮", "咖啡"],
        "location": "星巴克"
      }
    ],
    "upcomingBills": [
      {
        "id": "4",
        "userId": "user1",
        "amount": -2500,
        "type": "expense",
        "category": "housing",
        "description": "房租",
        "date": "2024-01-25T00:00:00Z",
        "tags": ["住房", "房租"]
      }
    ],
    "investmentSummary": {
      "totalValue": 58000,
      "totalReturn": 16.7,
      "returnPercentage": 2.8,
      "topPerformers": [
        {
          "id": "1",
          "userId": "user1",
          "name": "沪深300ETF",
          "type": "etf",
          "amount": 25000,
          "shares": 1000,
          "purchasePrice": 25,
          "currentPrice": 27.1,
          "purchaseDate": "2023-06-01T00:00:00Z",
          "riskLevel": "medium",
          "expectedReturn": 8.5
        }
      ]
    },
    "goalProgress": [
      {
        "goal": {
          "id": "1",
          "userId": "user1",
          "name": "紧急备用金",
          "targetAmount": 50000,
          "currentAmount": 35000,
          "deadline": "2024-06-30T00:00:00Z",
          "priority": "high",
          "type": "emergency",
          "isActive": true
        },
        "percentage": 70,
        "remainingAmount": 15000,
        "daysRemaining": 166
      }
    ]
  },
  "message": "仪表板数据获取成功"
}
```

---

## 2. 预算管理 API

### 获取预算数据

**GET** `/api/budget`

获取用户的预算设置和进度数据。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "monthlyBudget": 8000,
    "categories": [
      {
        "category": "food",
        "budgeted": 1500,
        "spent": 1200,
        "percentage": 80,
        "remaining": 300
      },
      {
        "category": "transport",
        "budgeted": 1000,
        "spent": 800,
        "percentage": 80,
        "remaining": 200
      }
    ],
    "totalSpent": 7050,
    "totalRemaining": 950,
    "overallPercentage": 88.1
  },
  "message": "预算数据获取成功"
}
```

### 更新预算设置

**PUT** `/api/budget`

更新用户的预算设置。

#### 请求参数

```json
{
  "monthlyBudget": 8500,
  "categories": [
    {
      "category": "food",
      "budgeted": 1600
    },
    {
      "category": "transport",
      "budgeted": 1100
    }
  ]
}
```

---

## 3. 交易管理 API

### 获取交易记录

**GET** `/api/transactions`

获取用户的交易记录列表。

#### 查询参数

- `page` (number): 页码，默认 1
- `limit` (number): 每页数量，默认 20
- `category` (string): 按分类筛选
- `type` (string): 按类型筛选 (income/expense)
- `startDate` (string): 开始日期
- `endDate` (string): 结束日期

#### 响应示例

```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "1",
        "userId": "user1",
        "amount": -45,
        "type": "expense",
        "category": "food",
        "description": "星巴克咖啡",
        "date": "2024-01-15T10:30:00Z",
        "tags": ["餐饮", "咖啡"],
        "location": "星巴克"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  },
  "message": "交易记录获取成功"
}
```

### 添加交易记录

**POST** `/api/transactions`

添加新的交易记录。

#### 请求参数

```json
{
  "amount": -120,
  "type": "expense",
  "category": "shopping",
  "description": "超市购物",
  "date": "2024-01-15T14:30:00Z",
  "tags": ["购物", "日用品"],
  "location": "沃尔玛"
}
```

### 更新交易记录

**PUT** `/api/transactions/:id`

更新指定的交易记录。

### 删除交易记录

**DELETE** `/api/transactions/:id`

删除指定的交易记录。

---

## 4. 目标管理 API

### 获取目标列表

**GET** `/api/goals`

获取用户的所有财务目标。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "1",
        "userId": "user1",
        "name": "紧急备用金",
        "targetAmount": 50000,
        "currentAmount": 35000,
        "deadline": "2024-06-30T00:00:00Z",
        "priority": "high",
        "type": "emergency",
        "isActive": true,
        "percentage": 70,
        "remainingAmount": 15000,
        "daysRemaining": 166
      }
    ],
    "statistics": {
      "totalGoals": 3,
      "activeGoals": 3,
      "totalTargetAmount": 280000,
      "totalCurrentAmount": 133000,
      "averageProgress": 47.5
    }
  },
  "message": "目标数据获取成功"
}
```

### 创建新目标

**POST** `/api/goals`

创建新的财务目标。

#### 请求参数

```json
{
  "name": "购房首付",
  "targetAmount": 200000,
  "deadline": "2025-12-31T00:00:00Z",
  "priority": "high",
  "type": "savings"
}
```

### 更新目标进度

**PUT** `/api/goals/:id/progress`

更新目标的当前进度。

#### 请求参数

```json
{
  "currentAmount": 85000
}
```

---

## 5. 投资组合 API

### 获取投资组合

**GET** `/api/investments`

获取用户的投资组合数据。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "portfolio": [
      {
        "id": "1",
        "userId": "user1",
        "name": "沪深300ETF",
        "type": "etf",
        "amount": 25000,
        "shares": 1000,
        "purchasePrice": 25,
        "currentPrice": 27.1,
        "purchaseDate": "2023-06-01T00:00:00Z",
        "riskLevel": "medium",
        "expectedReturn": 8.5,
        "return": 8.4,
        "currentValue": 27100
      }
    ],
    "summary": {
      "totalValue": 58000,
      "totalReturn": 16.7,
      "returnPercentage": 2.8,
      "totalInvested": 58000,
      "totalGain": 9700
    },
    "assetAllocation": [
      {
        "category": "股票",
        "percentage": 43,
        "amount": 25000
      },
      {
        "category": "债券",
        "percentage": 31,
        "amount": 18000
      },
      {
        "category": "基金",
        "percentage": 26,
        "amount": 15000
      }
    ]
  },
  "message": "投资组合数据获取成功"
}
```

### 添加投资

**POST** `/api/investments`

添加新的投资记录。

#### 请求参数

```json
{
  "name": "科技股组合",
  "type": "stock",
  "amount": 15000,
  "shares": 500,
  "purchasePrice": 29,
  "purchaseDate": "2023-12-01T00:00:00Z",
  "riskLevel": "high",
  "expectedReturn": 12.0
}
```

---

## 6. 税务预测 API

### 获取税务数据

**GET** `/api/tax`

获取用户的税务预测数据。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "annualIncome": 182400,
    "estimatedTaxRate": 15,
    "paidTax": 18240,
    "estimatedTax": 27360,
    "difference": 9120,
    "status": "underpaid",
    "deductions": [
      {
        "name": "住房贷款利息",
        "amount": 12000,
        "status": "available"
      },
      {
        "name": "子女教育",
        "amount": 8000,
        "status": "available"
      }
    ],
    "recommendations": [
      {
        "title": "增加退休金缴纳",
        "description": "考虑增加个人养老金缴纳，可享受税前扣除",
        "savings": 2400,
        "priority": "high"
      }
    ]
  },
  "message": "税务数据获取成功"
}
```

---

## 7. 金融新闻 API

### 获取金融新闻

**GET** `/api/news`

获取最新的金融新闻和市场数据。

#### 查询参数

- `category` (string): 新闻分类
- `limit` (number): 返回数量，默认 10

#### 响应示例

```json
{
  "success": true,
  "data": {
    "news": [
      {
        "id": "1",
        "title": "央行宣布降息0.25个百分点，释放流动性信号",
        "summary": "中国人民银行今日宣布下调金融机构存款准备金率0.25个百分点...",
        "source": "财经网",
        "time": "2024-01-15T10:00:00Z",
        "category": "货币政策",
        "impact": "positive"
      }
    ],
    "marketData": [
      {
        "name": "上证指数",
        "value": "3,245.67",
        "change": "+1.2%",
        "trend": "up"
      }
    ],
    "recommendations": [
      {
        "title": "关注科技股",
        "description": "政策支持力度加大，建议关注人工智能、芯片等板块",
        "category": "投资建议"
      }
    ]
  },
  "message": "金融新闻获取成功"
}
```

---

## 8. AI推荐 API

### 获取AI推荐

**GET** `/api/ai-recommendations`

获取基于用户财务状况的AI推荐。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "investmentRecommendations": [
      {
        "id": "1",
        "title": "增加科技股配置",
        "description": "基于您的风险承受能力和市场趋势，建议将科技股配置比例从15%提升至25%",
        "confidence": 85,
        "impact": "positive",
        "action": "立即调整"
      }
    ],
    "budgetRecommendations": [
      {
        "category": "餐饮支出",
        "current": 1200,
        "suggested": 1000,
        "savings": 200,
        "reason": "餐饮支出超出预算20%，建议减少外卖频率"
      }
    ],
    "alerts": [
      {
        "type": "bill_reminder",
        "title": "账单提醒",
        "description": "您的房租账单将在3天后到期，请及时支付 ¥2,500",
        "priority": "high"
      }
    ]
  },
  "message": "AI推荐获取成功"
}
```

---

## 9. 用户设置 API

### 获取用户信息

**GET** `/api/profile`

获取用户的个人信息和设置。

#### 响应示例

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user1",
      "name": "张小明",
      "email": "zhangxiaoming@example.com",
      "phone": "138****5678",
      "city": "北京",
      "bio": "热爱理财和投资，希望通过智能财富管理工具实现财务自由。",
      "registrationDate": "2023-03-15T00:00:00Z",
      "userLevel": "premium"
    },
    "settings": {
      "emailNotifications": true,
      "smsNotifications": false,
      "aiRecommendations": true,
      "dataSync": true,
      "twoFactorAuth": false
    }
  },
  "message": "用户信息获取成功"
}
```

### 更新用户信息

**PUT** `/api/profile`

更新用户的个人信息。

#### 请求参数

```json
{
  "name": "张小明",
  "email": "zhangxiaoming@example.com",
  "phone": "138****5678",
  "city": "北京",
  "bio": "热爱理财和投资，希望通过智能财富管理工具实现财务自由。"
}
```

### 更新设置

**PUT** `/api/profile/settings`

更新用户的应用设置。

#### 请求参数

```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "aiRecommendations": true,
  "dataSync": true
}
```

---

## 数据模型

### Transaction (交易记录)

```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  tags?: string[];
  location?: string;
}
```

### Goal (财务目标)

```typescript
interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
  isActive: boolean;
}
```

### Investment (投资)

```typescript
interface Investment {
  id: string;
  userId: string;
  name: string;
  type: string;
  amount: number;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
}
```

### User (用户)

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  bio: string;
  registrationDate: string;
  userLevel: string;
}
```

---

## 错误代码

| 错误代码 | 描述 |
|---------|------|
| `AUTH_001` | 未授权访问 |
| `AUTH_002` | Token过期 |
| `VALID_001` | 请求参数验证失败 |
| `NOT_FOUND_001` | 资源不存在 |
| `SERVER_001` | 服务器内部错误 |
| `RATE_LIMIT_001` | 请求频率超限 |

---

## 认证

### Bearer Token 认证

在请求头中包含认证信息：

```
Authorization: Bearer <your-token>
```

### 获取Token

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

响应：

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh-token-here",
    "expiresIn": 3600
  }
}
```

---

## 速率限制

- **普通用户**: 1000 请求/小时
- **高级用户**: 5000 请求/小时
- **API密钥**: 10000 请求/小时

---

## 更新日志

### v1.0.0 (2024-01-15)
- 初始版本发布
- 支持基础的财务管理功能
- 包含仪表板、预算、交易、目标等核心API

---

## 联系信息

如有问题或建议，请联系开发团队：

- **邮箱**: dev@wealthmanagement.com
- **文档**: https://docs.wealthmanagement.com
- **GitHub**: https://github.com/wealthmanagement/api 