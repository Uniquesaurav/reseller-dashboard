

import React, { useState } from 'react';
import { Account } from '../types';
import { Copy, Check, Download, Search, Filter, Ban, MonitorPlay, Pause, PlayCircle, Info, Lock } from 'lucide-react';

interface InventoryProps {
  accounts: Account[];
  onUpdateAccounts: (accounts: Account[]) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ accounts, onUpdateAccounts }) => {
  const [filter, setFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success'} | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevoke = (id: string) => {
    if (confirm('Are you sure you want to revoke this account? This action cannot be undone.')) {
      const updated = accounts.map(acc => 
        acc.id === id ? { ...acc, status: 'Revoked' as const } : acc
      );
      onUpdateAccounts(updated);
    }
  };

  const handleTogglePause = (id: string) => {
    const updated = accounts.map(acc => {
      if (acc.id !== id) return acc;

      if (acc.status === 'Active') {
        // Pause logic
        const now = new Date().getTime();
        const expiry = new Date(acc.expiresAt).getTime();
        const remaining = Math.max(0, expiry - now);
        
        setNotification({
          message: `Account paused. Password has been changed for security and will be provided once resumed.`,
          type: 'info'
        });
        setTimeout(() => setNotification(null), 5000);

        return {
          ...acc,
          status: 'Paused' as const,
          remainingTimeMs: remaining,
          originalPassword: acc.password,
          password: '••••••••' // Secure placeholder
        };
      } else if (acc.status === 'Paused') {
        // Resume logic
        const now = new Date().getTime();
        const remaining = acc.remainingTimeMs || 0;
        const newExpiry = new Date(now + remaining).toISOString();
        
        setNotification({
          message: `Account resumed. Access credentials have been restored.`,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);

        return {
          ...acc,
          status: 'Active' as const,
          expiresAt: newExpiry,
          remainingTimeMs: undefined,
          password: acc.originalPassword || Math.random().toString(36).slice(-10), // Restore old or gen new
          originalPassword: undefined
        };
      }
      return acc;
    });
    onUpdateAccounts(updated);
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.email.toLowerCase().includes(filter.toLowerCase()) || 
    acc.region.toLowerCase().includes(filter.toLowerCase()) ||
    acc.service?.toLowerCase().includes(filter.toLowerCase())
  );

  const getRemainingDays = (ms: number) => {
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Inventory Management <span className="text-sm font-normal text-gray-500 ml-2">({accounts.length} Total)</span></h2>
        <div className="flex items-center gap-2 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search email, service, or region..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary-600"
            />
          </div>
          <button className="p-2 bg-gray-900 border border-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
          <button className="p-2 bg-primary-600/20 text-primary-500 border border-primary-600/30 rounded-lg hover:bg-primary-600/30 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {notification && (
        <div className={`p-4 rounded-lg border flex items-center gap-3 animate-fade-in ${
          notification.type === 'info' 
            ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
            : 'bg-green-500/10 border-green-500/20 text-green-400'
        }`}>
          <div className="p-1 rounded-full bg-current/10">
            {notification.type === 'info' ? <Lock size={16} /> : <Check size={16} />}
          </div>
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-950/50 border-b border-gray-800">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No accounts found. Start generating!
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-gray-800/50 transition-colors group">
                     <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                          <MonitorPlay size={14} />
                        </div>
                        <span className="font-medium text-white">{acc.service || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-mono text-sm">{acc.email}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`font-mono text-xs hidden group-hover:inline-block px-2 py-0.5 rounded
                            ${acc.status === 'Paused' ? 'bg-red-500/10 text-red-400' : 'bg-gray-950 text-gray-500'}`}>
                            {acc.password}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="text-gray-400 text-xs flex items-center gap-2">
                           <img 
                             src={`https://flagcdn.com/24x18/${acc.region.toLowerCase()}.png`} 
                             alt={acc.region}
                             className="w-4 h-3 object-cover rounded-sm"
                           />
                           {acc.region}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {acc.plan}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {acc.status === 'Paused' && acc.remainingTimeMs ? (
                          <span className="text-yellow-500 font-medium">
                            Paused ({getRemainingDays(acc.remainingTimeMs)}d left)
                          </span>
                        ) : (
                          acc.expiresAt ? new Date(acc.expiresAt).toLocaleDateString() : 'N/A'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${acc.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                          acc.status === 'Revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          acc.status === 'Paused' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          'bg-gray-700 text-gray-300 border-gray-600'}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {acc.status !== 'Revoked' && (
                          <>
                            <button 
                              onClick={() => handleTogglePause(acc.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                acc.status === 'Paused' 
                                  ? 'bg-primary-600/20 text-primary-400 hover:bg-primary-600/30' 
                                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                              }`}
                              title={acc.status === 'Paused' ? "Resume Subscription" : "Pause Subscription"}
                            >
                              {acc.status === 'Paused' ? <PlayCircle size={16} /> : <Pause size={16} />}
                            </button>
                            <button 
                              onClick={() => handleRevoke(acc.id)}
                              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-red-400 hover:bg-red-900/10 transition-colors"
                              title="Revoke Account"
                            >
                              <Ban size={16} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => handleCopy(`${acc.email}:${acc.password}`, acc.id)}
                          disabled={acc.status === 'Paused'}
                          className={`p-2 rounded-lg transition-colors ${copiedId === acc.id ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'} ${acc.status === 'Paused' ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={acc.status === 'Paused' ? "Credentials Hidden" : "Copy Credentials"}
                        >
                          {copiedId === acc.id ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};