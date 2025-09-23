import React from "react";

interface KPIProps {
  label: string;
  value: string | number;
  unit?: string;
}

export default function KPI({ label, value, unit }: KPIProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm border flex flex-col items-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">
        {value} {unit}
      </h3>
    </div>
  );
}
