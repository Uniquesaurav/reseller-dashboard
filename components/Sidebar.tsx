import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Zap, Package, MessageCircle, LogOut, Disc } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isOpen, setIsOpen, onLogout }) => {
  const navItems = [
    { view: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { view: ViewState.GENERATOR, label: 'Generator', icon: Zap },
    { view: ViewState.INVENTORY, label: 'Inventory', icon: Package },
    { view: ViewState.LIVE_SUPPORT, label: 'Live Support', icon: MessageCircle },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-800">
          <div className="w-8 h-8 rounded bg-primary-600 flex items-center justify-center text-white font-bold">
            <Disc size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-white">
            AccountBot
          </span>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onChangeView(item.view);
                setIsOpen(false); // Close on mobile on selection
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                ${currentView === item.view 
                  ? 'bg-primary-600/10 text-primary-500 border border-primary-600/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-900/10"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};