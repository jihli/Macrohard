import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReactECharts from "echarts-for-react";
import CalendarView from "./CalendarView";
import LineChart from "./LineChart";

const sampleOption = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
    },
  ],
};

function Income() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Income</Typography>
        <Typography variant="body1">$12,345</Typography>
      </CardContent>
    </Card>
  );
}

function Calendar() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Calendar</Typography>
        <CalendarView />
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>
      <LineChart />
      <Grid container spacing={2}>
        {[1, 2, 3].map((id) => (
          <Grid item xs={12} key={id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Chart {id}</Typography>
                <ReactECharts option={sampleOption} style={{ height: 200 }} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function InvestmentAnalysis() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Investment Analysis</Typography>
        <Typography variant="body1">Analysis content goes here.</Typography>
      </CardContent>
    </Card>
  );
}

function App() {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Income />
        </Grid>
        <Grid item xs={12} md={8}>
          <Dashboard />
        </Grid>
        <Grid item xs={12} md={2}>
          <InvestmentAnalysis />
        </Grid>
        <Grid item xs={12} md={12}>
          <Calendar />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
