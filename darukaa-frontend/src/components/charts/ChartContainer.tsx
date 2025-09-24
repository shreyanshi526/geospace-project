import React from 'react';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  icon?: 'trending' | 'bar' | 'activity';
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  children,
  subtitle,
  icon = 'trending',
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'bar':
        return <BarChart3 className="w-5 h-5 text-blue-600" />;
      case 'activity':
        return <Activity className="w-5 h-5 text-blue-600" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;