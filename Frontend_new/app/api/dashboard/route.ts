import { NextResponse } from 'next/server'
import type { DashboardData } from '@/types'

export async function GET() {
  try {
    const url='http://localhost:5001/'
    const response = await fetch(url+'api/dashboard', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API call failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch dashboard data',
        message: '无法获取仪表板数据',
      },
      { status: 500 }
    );
  }
} 