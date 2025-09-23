import React from "react";
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type BarChartProps = {
  data: any[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
};

export const BarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  yKey,
  color = "#16a34a", // default green
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yKey} fill={color} />
      </ReBarChart>
    </ResponsiveContainer>
  );
};
