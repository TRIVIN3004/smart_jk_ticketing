import React, { useState } from 'react';
import { Search, Bell, User as UserIcon, Sun, Moon, Menu, X, RefreshCw } from 'lucide-react';
import type { User } from '../types';

interface HeaderProps {
  activeTab: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotifCount: number;
  onNavigate: (tab: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User;
  isMobileSidebarOpen: boolean;
  onToggleMobileSidebar: () => void;
  onRefreshData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  searchQuery,
  onSearchChange,
  unreadNotifCount,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  isMobileSidebarOpen,
  onToggleMobileSidebar,
  onRefreshData
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Operations Overview';
      case 'tickets': return 'Ticket Management';
      case 'create-ticket': return 'Create Ticket';
      case 'approvals': return 'Approval Queue';
      case 'users': return 'User Control';
      case 'departments': return 'Departments';
      case 'categories': return 'Categories';
      case 'reports': return 'Analytics & Reports';
      case 'audit': return 'Audit Trail';
      case 'notifications': return 'Notifications';
      case 'profile': return 'User Profile';
      case 'settings': return 'System Settings';
      default: return 'Portal';
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshData) {
      onRefreshData();
    }
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="h-16 fixed top-0 right-0 left-0 md:left-64 z-30 bg-white/90 dark:bg-[#020408]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 md:px-8 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Mobile Menu Button & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 text-amber-600 dark:text-[#ffd600] hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
          title="Toggle Navigation Menu"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h2 className="text-sm md:text-base font-black uppercase tracking-wider text-slate-900 dark:text-[#ffd600] font-outfit truncate max-w-[150px] sm:max-w-none">
          {getTabTitle(activeTab)}
        </h2>
      </div>

      {/* Global Search */}
      <div className="relative flex-1 max-w-xs md:max-w-md mx-3 md:mx-8">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets, users..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:border-[#ffd600] focus:outline-none transition-all font-mono"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 md:space-x-3">
        
        {/* Refresh Data Button */}
        <button
          onClick={handleRefresh}
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 hover:border-[#ffd600] text-slate-600 dark:text-slate-300 hover:text-[#ffd600] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Refresh Data & Sync across tabs"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#ffd600]' : ''}`} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 hover:border-[#ffd600] text-amber-600 dark:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Toggle Dark/Light Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-[#ffd600]" /> : <Moon className="w-4 h-4 text-slate-800" />}
        </button>

        {/* Notifications */}
        <button
          onClick={() => onNavigate('notifications')}
          className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 hover:border-[#ffd600] text-slate-600 dark:text-slate-300 hover:text-[#ffd600] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotifCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0a0c12]" />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className="hidden sm:flex w-9 h-9 md:w-10 md:h-10 rounded-xl bg-slate-100 dark:bg-[#0a0c12] border border-slate-200 dark:border-white/10 hover:border-[#ffd600] text-slate-600 dark:text-slate-300 hover:text-[#ffd600] items-center justify-center transition-all cursor-pointer shadow-sm"
          title="Profile Settings"
        >
          <UserIcon className="w-4 h-4" />
        </button>

      </div>

    </header>
  );
};
