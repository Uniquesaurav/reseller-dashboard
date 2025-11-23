import React, { useState } from 'react';
import { GenerationStats, Account } from '../types';
import { StatCard } from './StatCard';
import { Infinity as InfinityIcon, Package, MonitorPlay, ChevronDown, MapPin, Tag, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  stats: GenerationStats;
  recentAccounts: Account[];
}

// Mock data for the chart
const data = [
  { name: 'Mon', generated: 12 },
  { name: 'Tue', generated: 19 },
  { name: 'Wed', generated: 15 },
  { name: 'Thu', generated: 25 },
  { name: 'Fri', generated: 32 },
  { name: 'Sat', generated: 45 },
  { name: 'Sun', generated: 38 },
];

export const Dashboard: React.FC<DashboardProps> = ({ stats, recentAccounts }) => {
  const [visibleCount, setVisibleCount] = useState(5);

  const sortedAccounts = [...recentAccounts].sort((a, b) => 
    new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
  );

  const historyToShow = sortedAccounts.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5);
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = (new Date().getTime() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Generated" 
          value={stats.totalGenerated} 
          icon={Package} 
          trend="+12% this week"
          trendUp={true}
        />
        <StatCard 
          title="Active Stock" 
          value="Unlimited" 
          icon={InfinityIcon}
          trend="Always available"
          trendUp={true}
        />
        <StatCard 
          title="Credits Balance" 
          value="Unlimited" 
          icon={InfinityIcon}
          trend="Demo Mode"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Generation Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#9ca3af" 
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#9ca3af" 
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="generated" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#818cf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col h-full">
          <h3 className="text-lg font-bold text-white mb-4">Generation History</h3>
          <div className="space-y-4 flex-1">
            {historyToShow.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent activity.
                <br />
                Generate accounts to see them here.
              </div>
            ) : (
              historyToShow.map((acc) => (
                <div key={acc.id} className="flex items-start gap-3 pb-3 border-b border-gray-800 last:border-0">
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-400 shrink-0 mt-1">
                    <MonitorPlay size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-white truncate">{acc.service}</p>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{getTimeAgo(acc.generatedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-2">{acc.email}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
                        <Tag size={10} /> {acc.plan}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
                        <MapPin size={10} /> {acc.region}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
                        <Clock size={10} /> {acc.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {sortedAccounts.length > visibleCount && (
            <button 
              onClick={handleLoadMore}
              className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-sm text-primary-400 hover:text-white border border-dashed border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Load More <ChevronDown size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};