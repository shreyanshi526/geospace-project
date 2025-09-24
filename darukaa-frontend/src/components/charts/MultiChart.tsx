import React, { useState } from 'react';
import Chart, { ChartMetric } from './Chart';
import ChartContainer from './ChartContainer';
import { ChevronDown, TrendingUp, BarChart3 } from 'lucide-react';

export interface MultiChartData {
  [key: string]: ChartMetric;
}

interface MultiChartProps {
  data: MultiChartData;
  title?: string;
  defaultMetric?: string;
  chartType?: 'line' | 'bar';
  showArea?: boolean;
  height?: number;
  colors?: string[];
}

const MultiChart: React.FC<MultiChartProps> = ({
  data,
  title = "Analytics Chart",
  defaultMetric,
  chartType = 'line',
  showArea = false,
  height = 400,
  colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
  ],
}) => {
  const metrics = Object.keys(data);
  const [selectedMetric, setSelectedMetric] = useState(
    defaultMetric && metrics.includes(defaultMetric) ? defaultMetric : metrics[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!metrics.length) {
    return (
      <ChartContainer title={title}>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <TrendingUp className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-500 font-medium">No metrics available</p>
            <p className="text-gray-400 text-sm">Chart data will appear here when available</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  const currentData = data[selectedMetric];
  const colorIndex = metrics.indexOf(selectedMetric) % colors.length;
  const currentColor = colors[colorIndex];

  return (
    <ChartContainer 
      title={title}
      subtitle={`Showing ${selectedMetric} (${currentData?.unit || 'N/A'})`}
      icon={chartType === 'bar' ? 'bar' : 'trending'}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColor }}></span>
            {selectedMetric}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {metrics.map((metric, index) => {
                  const metricColor = colors[index % colors.length];
                  const isSelected = metric === selectedMetric;
                  
                  return (
                    <button
                      key={metric}
                      onClick={() => {
                        setSelectedMetric(metric);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                        isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      }`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: metricColor }}
                      ></span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{metric}</div>
                        <div className="text-xs text-gray-500">
                          {data[metric]?.unit || 'N/A'} • {data[metric]?.values?.length || 0} points
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{currentData?.values?.length || 0} data points</span>
        </div>
      </div>

      <Chart
        data={currentData}
        title={selectedMetric}
        type={chartType}
        color={currentColor}
        showArea={showArea}
        height={height}
      />
    </ChartContainer>
  );
};

export default MultiChart;