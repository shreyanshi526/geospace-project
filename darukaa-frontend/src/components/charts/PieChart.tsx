import React from "react";
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type PieChartProps = {
  data: { name: string; value: number }[];
  colors?: string[];
  height?: number;
};

const defaultColors = ["#4f46e5", "#16a34a", "#f59e0b", "#ef4444"];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = defaultColors,
  height = 300,
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </RePieChart>
    </ResponsiveContainer>
  );
};
