import React, { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
}

export default function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
