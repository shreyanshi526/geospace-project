import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { format, isSameDay, parseISO } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
);

export interface ChartDataPoint {
  x: string; // ISO date string
  y: number;
}

export interface ChartMetric {
  unit: string;
  values: ChartDataPoint[];
}

export interface ChartProps {
  data: ChartMetric;
  title: string;
  type?: 'line' | 'bar';
  color?: string;
  showArea?: boolean;
  height?: number;
}

const Chart: React.FC<ChartProps> = ({
  data,
  title,
  type = 'line',
  color = '#3B82F6',
  showArea = false,
  height = 300,
}) => {
  const chartData = useMemo(() => {
    if (!data?.values?.length) {
      return {
        labels: [],
        datasets: [],
      };
    }


    const dates = data.values.map(point => parseISO(point.x));
    const allSameDay = dates.every(date => isSameDay(date, dates[0]));

    const labels = data.values.map(point => {
      const date = parseISO(point.x);
      if (allSameDay) {
        return format(date, 'HH:mm:ss');
      } else {
        const now = new Date();
        const isToday = isSameDay(date, now);
        const isThisYear = date.getFullYear() === now.getFullYear();
        
        if (isToday) {
          return format(date, 'HH:mm');
        } else if (isThisYear) {
          return format(date, 'MMM dd, HH:mm');
        } else {
          return format(date, 'MMM dd, yyyy');
        }
      }
    });

    const values = data.values.map(point => point.y);

    return {
      labels,
      datasets: [
        {
          label: `${title} (${data.unit})`,
          data: values,
          borderColor: color,
          backgroundColor: showArea ? `${color}20` : color,
          borderWidth: 2,
          fill: showArea,
          tension: 0.4,
          pointBackgroundColor: color,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [data, title, color, showArea]);

  const options = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12,
              weight: 500,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: color,
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (context: any) => {
              const index = context[0].dataIndex;
              const originalDate = parseISO(data.values[index].x);
              return format(originalDate, 'MMM dd, yyyy HH:mm:ss');
            },
            label: (context: any) => {
              return `${context.parsed.y} ${data.unit}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 11,
            },
            maxRotation: 45,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 11,
            },
            callback: function(value: any) {
              return `${value} ${data.unit}`;
            },
          },
        },
      },
      elements: {
        point: {
          hoverBackgroundColor: color,
        },
      },
    };

    return baseOptions;
  }, [data, color]);

  if (!data?.values?.length) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No data available</p>
          <p className="text-gray-400 text-sm">Data will appear here when available</p>
        </div>
      </div>
    );
  }

  const ChartComponent = type === 'bar' ? Bar : Line;

  return (
    <div style={{ height: `${height}px` }}>
      <ChartComponent data={chartData} options={options} />
    </div>
  );
};

export default Chart;