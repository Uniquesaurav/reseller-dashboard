
import React, { useState } from 'react';
import { ViewState, Account, GenerationStats, User } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Generator } from './components/Generator';
import { Inventory } from './components/Inventory';
import { LiveSupport } from './components/LiveSupport';
import { Auth } from './components/Auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [stats, setStats] = useState<GenerationStats>({
    totalGenerated: 1250,
    activeStock: 45,
    credits: 999999,
    revenue: 4200
  });

  const handleGenerate = (newAccounts: Account[]) => {
    setAccounts(prev => [...newAccounts, ...prev]);
    setStats(prev => ({
      ...prev,
      totalGenerated: prev.totalGenerated + newAccounts.length,
      activeStock: prev.activeStock + newAccounts.length,
      // No credit deduction
      revenue: prev.revenue
    }));
    setCurrentView(ViewState.INVENTORY);
  };

  const handleUpdateAccounts = (updatedAccounts: Account[]) => {
    setAccounts(updatedAccounts);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(ViewState.DASHBOARD);
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard stats={stats} recentAccounts={accounts} />;
      case ViewState.GENERATOR:
        return <Generator onGenerate={handleGenerate} />;
      case ViewState.INVENTORY:
        return <Inventory accounts={accounts} onUpdateAccounts={handleUpdateAccounts} />;
      case ViewState.LIVE_SUPPORT:
        return <LiveSupport />;
      default:
        return <Dashboard stats={stats} recentAccounts={accounts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 font-sans selection:bg-primary-500/30">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header 
          currentView={currentView} 
          onMenuClick={() => setIsSidebarOpen(true)}
          user={user}
        />
        
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;