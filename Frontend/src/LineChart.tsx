import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ReactECharts from "echarts-for-react";

const LineChart: React.FC = () => {
  // 定义 TimeRange 类型
  type TimeRange = "1w" | "1m" | "1y";
  const [timeRange, setTimeRange] = React.useState<TimeRange>("1w");

  const handleChange = (event: SelectChangeEvent<TimeRange>) => {
    setTimeRange(event.target.value as TimeRange);
  };

  const getOption = () => {
    const xAxisData: Record<TimeRange, string[]> = {
      "1w": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "1m": ["Week 1", "Week 2", "Week 3", "Week 4"],
      "1y": ["Q1", "Q2", "Q3", "Q4"],
    };

    const seriesData: Record<TimeRange, number[]> = {
      "1w": [820, 932, 901, 934, 1290, 1330, 1320],
      "1m": [3200, 3320, 3010, 3340],
      "1y": [12200, 13320, 13010, 13340],
    };

    return {
      title: {
        text: "趋势分析",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: xAxisData[timeRange],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: seriesData[timeRange],
          type: "line",
          smooth: true,
        },
      ],
    };
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">趋势分析</Typography>
        <Select
          value={timeRange}
          onChange={handleChange}
          displayEmpty
          sx={{ width: 120 }}
        >
          <MenuItem value="1w">1周</MenuItem>
          <MenuItem value="1m">1个月</MenuItem>
          <MenuItem value="1y">1年</MenuItem>
        </Select>
      </Box>
      <ReactECharts option={getOption()} style={{ height: 400 }} />
    </Box>
  );
};

export default LineChart;
