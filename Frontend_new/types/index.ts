// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  income: number;
  createdAt: Date;
}

// 交易记录类型
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  description: string;
  date: Date;
  tags: string[];
  location?: string;
  receipt?: string;
}

export type TransactionCategory = 
  | 'food' | 'transport' | 'shopping' | 'entertainment' | 'health'
  | 'education' | 'housing' | 'utilities' | 'insurance' | 'investment'
  | 'salary' | 'bonus' | 'freelance' | 'dividend' | 'interest'
  | 'other';

// 预算相关类型
export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  period: 'monthly' | 'yearly';
  categories: BudgetCategory[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export interface BudgetCategory {
  category: TransactionCategory;
  amount: number;
  spent: number;
}

// API 预算数据类型
export interface ApiBudgetCategory {
  category: string;
  budgeted: number;
  spent: number;
  percentage: number;
  remaining: number;
}

export interface ApiBudgetData {
  monthlyBudget: number;
  categories: ApiBudgetCategory[];
  totalSpent: number;
  totalRemaining: number;
  overallPercentage: number;
}

// 目标管理类型
export interface Goal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  type: 'emergency' | 'travel' | 'house' | 'car' | 'education' | 'retirement' | 'other';
  description?: string;
  isActive: boolean;
}

// 投资组合类型
export interface Investment {
  id: string;
  userId: string;
  name: string;
  type: 'stock' | 'bond' | 'etf' | 'mutual-fund' | 'crypto' | 'real-estate' | 'other';
  amount: number;
  shares?: number;
  purchasePrice?: number;
  currentPrice?: number;
  purchaseDate: Date;
  riskLevel: 'low' | 'medium' | 'high';
  expectedReturn: number;
}

export interface InvestmentPortfolio {
  id: string;
  userId: string;
  name: string;
  investments: Investment[];
  totalValue: number;
  totalReturn: number;
  riskScore: number;
  lastUpdated: Date;
}

// 税务相关类型
export interface TaxEstimate {
  id: string;
  userId: string;
  year: number;
  totalIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  estimatedTax: number;
  deductions: TaxDeduction[];
}

export interface TaxDeduction {
  name: string;
  amount: number;
  type: 'standard' | 'itemized' | 'business' | 'charitable';
}

// 金融新闻类型
export interface FinancialNews {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
  category: 'market' | 'economy' | 'crypto' | 'stocks' | 'bonds' | 'real-estate';
  sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
}

// AI推荐类型
export interface AIRecommendation {
  id: string;
  userId: string;
  type: 'saving' | 'investment' | 'budget' | 'tax';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedImpact: number;
  actionItems: string[];
  data: Record<string, any>;
  createdAt: Date;
}

// 仪表板数据类型
export interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  budgetProgress: BudgetProgress[];
  recentTransactions: Transaction[];
  upcomingBills: Transaction[];
  investmentSummary: InvestmentSummary;
  goalProgress: GoalProgress[];
}

export interface BudgetProgress {
  category: TransactionCategory;
  budgeted: number;
  spent: number;
  percentage: number;
}

export interface InvestmentSummary {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  topPerformers: Investment[];
}

export interface GoalProgress {
  goal: Goal;
  percentage: number;
  remainingAmount: number;
  daysRemaining: number;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 图表数据类型
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  category?: string;
} 