import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type LineChartProps = {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  xKey,
  yKey,
  color = "#4f46e5", // default purple
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2}
        />
      </ReLineChart>
    </ResponsiveContainer>
  );
};
