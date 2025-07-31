import { ApiBudgetData, ApiBudgetCategory } from '@/types';

// const API_BASE_URL = 'http://localhost:5001/api';
const API_BASE_URL='http://localhost:5001/api';
// Generic API call function
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header when auth is implemented
        // 'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API call failed');
    }

    return data.data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

// Dashboard API
export const dashboardApi = {
  getDashboardData: () => apiCall<DashboardData>('/dashboard'),
};

// Budget API
export const budgetApi = {
  getBudgetData: () => apiCall<ApiBudgetData>('/budget'),
  updateBudget: (data: { categories: ApiBudgetCategory[] }) => apiCall<any>('/budget', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Transactions API
export const transactionsApi = {
  getTransactions: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';
    return apiCall<any>(endpoint);
  },
  
  createTransaction: (data: any) => apiCall<any>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateTransaction: (id: string, data: any) => apiCall<any>(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteTransaction: (id: string) => apiCall<any>(`/transactions/${id}`, {
    method: 'DELETE',
  }),
};

// Goals API
export const goalsApi = {
  getGoals: () => apiCall<{
    goals: Array<{
      id: string;
      userId: string;
      name: string;
      targetAmount: number;
      currentAmount: number;
      deadline: string;
      priority: string;
      type: string;
      isActive: boolean;
      percentage: number;
      remainingAmount: number;
      daysRemaining: number;
    }>;
    statistics: {
      totalGoals: number;
      activeGoals: number;
      totalTargetAmount: number;
      totalCurrentAmount: number;
      averageProgress: number;
    };
  }>('/goals'),
  
  createGoal: (data: {
    name: string;
    targetAmount: number;
    deadline: string;
    priority: string;
    type: string;
  }) => apiCall<any>('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updateGoalProgress: (id: string, data: {
    currentAmount: number;
  }) => apiCall<any>(`/goals/${id}/progress`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  deleteGoal: (id: string) => apiCall<any>(`/goals/${id}`, {
    method: 'DELETE',
  }),
};

// Investments API
export const investmentsApi = {
  getInvestments: () => apiCall<any>('/investments'),
  createInvestment: (data: {
    name: string;
    type: string;
    amount: number;
    shares: number;
    purchasePrice: number;
    purchaseDate?: string;
    riskLevel?: string;
    expectedReturn?: number;
  }) => apiCall<any>('/investments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Tax API
export const taxApi = {
  getTaxData: () => apiCall<{
    annualIncome: number;
    estimatedTaxRate: number;
    paidTax: number;
    estimatedTax: number;
    difference: number;
    status: string;
    deductions: Array<{
      name: string;
      amount: number;
      status: string;
    }>;
    recommendations: Array<{
      title: string;
      description: string;
      savings: number;
      priority: string;
    }>;
  }>('/tax'),
};

// News API
export const newsApi = {
  getNews: (params?: {
    category?: string;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const url = `/news${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    return apiCall<{
      news: Array<{
        id: string;
        title: string;
        summary: string;
        source: string;
        time: string;
        category: string;
        impact: 'positive' | 'negative' | 'neutral';
        url?: string;
        author?: string;
      }>;
      marketData: Array<{
        name: string;
        value: string;
        change: string;
        trend: 'up' | 'down';
      }>;
      recommendations: Array<{
        title: string;
        description: string;
        category: string;
      }>;
    }>(url);
  },
};

// AI Recommendations API
export const aiRecommendationsApi = {
  getRecommendations: () => apiCall<any>('/ai-recommendations'),
};

// Profile API
export const profileApi = {
  getUserProfile: () => apiCall<any>('/profile'),
  updateUserProfile: (data: any) => apiCall<any>('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  updateSettings: (data: any) => apiCall<any>('/profile/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};

// Import types
import type { DashboardData } from '@/types'; 