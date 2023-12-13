import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface BarChartProps {
  labels: string[];
  datasets: Dataset[];
  xAxisTitle?: string;
  yAxisTitle?: string;
}

const defaultBackgroundColors = [
  'rgba(54, 162, 235, 0.6)',  // blue
  'rgba(255, 206, 86, 0.6)',  // yellow
  'rgba(153, 102, 255, 0.6)', // purple
  'rgba(255, 99, 132, 0.6)',  // red
  'rgba(255, 159, 64, 0.6)',  // orange
  'rgba(75, 192, 192, 0.6)',  // green
  'rgba(199, 199, 199, 0.6)', // grey
  'rgba(83, 102, 255, 0.6)',  // indigo
  'rgba(255, 99, 71, 0.6)',   // tomato
  'rgba(60, 179, 113, 0.6)'   // medium sea green
];

const ContractCountBarChart: React.FC<BarChartProps> = ({ labels, datasets, xAxisTitle, yAxisTitle }) => {
  datasets.forEach((dataset, index) => {
    dataset.backgroundColor = dataset.backgroundColor || defaultBackgroundColors[index % defaultBackgroundColors.length];
  });

  const chartData = {
    labels,
    datasets,
  };

    const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: !!yAxisTitle,
          text: yAxisTitle || '',
          beginAtZero: true,
        },
      },
      x: {
        title: {
          display: !!xAxisTitle,
          text: xAxisTitle || '',
        },
      }
    },
  };
  return <Bar data={chartData} options={options} />;
};

export default ContractCountBarChart;