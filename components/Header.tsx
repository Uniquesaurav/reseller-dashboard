import React from 'react';
import { Menu, Bell, User as UserIcon, Infinity } from 'lucide-react';
import { ViewState, User } from '../types';

interface HeaderProps {
  currentView: ViewState;
  onMenuClick: () => void;
  user: User | null;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onMenuClick, user }) => {
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-white capitalize hidden md:block">
          {currentView.toLowerCase().replace('_', ' ')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Unlimited Credits Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-900/40 to-indigo-900/40 border border-primary-500/30 rounded-full">
            <Infinity size={16} className="text-primary-400" />
            <span className="text-xs font-bold text-primary-200">Unlimited Demo Credits</span>
        </div>

        <div className="relative group">
          <button className="p-2 text-gray-400 hover:text-white relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">{user?.name || 'Guest'}</p>
            <p className="text-xs text-primary-400 capitalize">{user?.role || 'Visitor'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full" />
            ) : (
              <UserIcon size={18} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};