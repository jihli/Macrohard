// const API_BASE_URL = 'http://localhost:3000/api';
const API_BASE_URL='https://literate-space-goggles-6vp45vrpq424vwp-5000.app.github.dev/api';
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
  getBudgetData: () => apiCall<any>('/budget'),
  updateBudget: (data: any) => apiCall<any>('/budget', {
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
  getGoals: () => apiCall<any>('/goals'),
  createGoal: (data: any) => apiCall<any>('/goals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateGoalProgress: (id: string, data: any) => apiCall<any>(`/goals/${id}/progress`, {
    method: 'PUT',
    body: JSON.stringify(data),
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
  getNews: (params?: { category?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/news?${queryString}` : '/news';
    return apiCall<any>(endpoint);
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