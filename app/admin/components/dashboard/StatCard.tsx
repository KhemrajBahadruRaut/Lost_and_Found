import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subValue?: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  subValue, 
  change 
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subValue && <p className="text-sm text-gray-600 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 ${colorClasses[color as keyof typeof colorClasses]} rounded-lg`}>
          {icon}
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center text-sm text-green-600">
          <span className="font-medium">{change}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;