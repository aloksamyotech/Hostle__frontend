import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
// components
import { useChart } from '../../../ui-component/chart';

// ----------------------------------------------------------------------

MonthlyExpenses.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired
};

export default function MonthlyExpenses({ title, subheader, chartData, ...other }) {
  const chartLabels = chartData.map((i) => i.label);
  console.log("chartLabels ==>",chartLabels);

  const chartSeries = chartData.map((i) => i.value);
  console.log("chartSeries==>",chartSeries);

  const chartOptions = useChart({
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: () => ''
        }
      }
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '28%', borderRadius: 2 }
    },
    xaxis: {
      categories: chartLabels
    }
  });
  

  return (
    <Card {...other}>
      <CardHeader title={title} />

      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={[{ data: chartSeries }]} options={chartOptions} height={340} />
      </Box>
    </Card>
  );
}
