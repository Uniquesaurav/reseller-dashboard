import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, trend, trendUp }) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={64} />
      </div>
      <div className="flex flex-col relative z-10">
        <span className="text-gray-400 text-sm font-medium mb-1">{title}</span>
        <span className="text-3xl font-bold text-white mb-2">{value}</span>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${trendUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};