import React, { useRef, useEffect } from 'react';
import * as echarts from 'echarts';
import { Paper, Typography, Box } from '@mui/material';

const FinancialSummary: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    // Initialize chart when component mounts
    if (chartRef.current) {
      chartInstance.current = echarts.init(chartRef.current);

      // Chart configuration
      const option = {
        title: {
          text: 'Financial Overview',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['Income', 'Spend', 'Net Growth'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          name: 'Amount ($)',
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series: [{
          name: 'Financial Metrics',
          type: 'bar',
          barWidth: '60%',
          data: [
            { value: 5200, itemStyle: { color: '#4CAF50' } },  // Income (green)
            { value: 3800, itemStyle: { color: '#F44336' } },  // Spend (red)
            { value: 1400, itemStyle: { color: '#2196F3' } }   // Net Growth (blue)
          ]
        }]
      };

      chartInstance.current.setOption(option);
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" gutterBottom>Financial Summary</Typography>
      <Box sx={{ height: 300, width: '100%' }} ref={chartRef} />
    </Paper>
  );
};

export default FinancialSummary;