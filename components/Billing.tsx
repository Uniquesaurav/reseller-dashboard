import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Zap, History, DollarSign } from 'lucide-react';
import { Transaction } from '../types';

interface BillingProps {
  credits: number;
  onPurchase: (amount: number, credits: number) => void;
}

export const Billing: React.FC<BillingProps> = ({ credits, onPurchase }) => {
  const [loading, setLoading] = useState<string | null>(null);
  
  // Mock transaction history
  const [transactions] = useState<Transaction[]>([
    { id: 'tx_1', date: new Date().toISOString(), amount: 49.99, credits: 500, status: 'Completed', method: 'Credit Card' },
    { id: 'tx_2', date: new Date(Date.now() - 86400000).toISOString(), amount: 19.99, credits: 150, status: 'Completed', method: 'PayPal' },
  ]);

  const packages = [
    { id: 'starter', name: 'Starter Pack', credits: 100, price: 15, popular: false },
    { id: 'pro', name: 'Reseller Pro', credits: 500, price: 50, popular: true },
    { id: 'biz', name: 'Enterprise', credits: 2000, price: 150, popular: false },
  ];

  const handlePurchase = (pkgId: string, price: number, creditAmount: number) => {
    setLoading(pkgId);
    // Simulate payment gateway delay
    setTimeout(() => {
      onPurchase(price, creditAmount);
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Current Balance Card */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-primary-900/50 to-gray-900 border border-primary-500/20 rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap size={100} />
          </div>
          <h3 className="text-gray-400 font-medium mb-2">Available Balance</h3>
          <div className="text-4xl font-bold text-white mb-4">{credits} <span className="text-lg font-normal text-gray-400">Credits</span></div>
          <button className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1">
            <History size={14} /> View Usage History
          </button>
        </div>

        {/* Payment Methods Info */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold mb-2">Secure Payment Gateway</h3>
            <p className="text-sm text-gray-400 max-w-md">
              We support all major credit cards, PayPal, and Crypto payments. Transactions are encrypted and secure.
            </p>
          </div>
          <div className="flex gap-3 text-gray-500">
            <CreditCard size={32} />
            <ShieldCheck size={32} />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white">Purchase Credits</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`
              relative bg-gray-900 border rounded-xl p-6 flex flex-col transition-all hover:transform hover:-translate-y-1
              ${pkg.popular ? 'border-primary-500 shadow-lg shadow-primary-900/20' : 'border-gray-800 hover:border-gray-700'}
            `}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-white mb-2">{pkg.name}</h3>
              <div className="text-3xl font-bold text-white flex items-center justify-center">
                <DollarSign size={20} className="text-gray-400" />
                {pkg.price}
              </div>
              <p className="text-sm text-gray-500 mt-2">{(pkg.price / pkg.credits).toFixed(2)} per credit</p>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck size={16} className="text-green-500" />
                <span>{pkg.credits} Account Generations</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Instant Delivery</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300">
                <ShieldCheck size={16} className="text-green-500" />
                <span>Premium Support</span>
              </li>
            </ul>

            <button
              onClick={() => handlePurchase(pkg.id, pkg.price, pkg.credits)}
              disabled={loading !== null}
              className={`
                w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors
                ${pkg.popular 
                  ? 'bg-primary-600 hover:bg-primary-500 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-white'}
                ${loading !== null ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading === pkg.id ? 'Processing...' : 'Purchase Now'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="font-bold text-white">Recent Transactions</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-950/50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Credits</th>
              <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 text-sm text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm text-gray-300">{tx.method}</td>
                <td className="px-6 py-4 text-sm text-white font-medium">${tx.amount}</td>
                <td className="px-6 py-4 text-sm text-green-400">+{tx.credits}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};