import React from 'react';
import { 
  Bell, 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  PlusCircle, 
  CheckSquare, 
  BarChart3, 
  Users, 
  History,
  FileText
} from 'lucide-react';
import type { User, UserRole, NotificationItem } from '../types';

interface NavbarProps {
  currentUser: User;
  onSwitchUser: (role: UserRole) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenRaiseTicket: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSwitchUser,
  onLogout,
  darkMode,
  onToggleDarkMode,
  notifications,
  onOpenNotifications,
  activeTab,
  onTabChange,
  onOpenRaiseTicket,
}) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-500 to-amber-600 text-slate-900 font-extrabold shadow-md shadow-amber-500/20">
              <span className="text-xl tracking-tighter font-black">JK</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">JK TYRE</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/20 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-400/30">Smart Ticket</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Enterprise ServiceNow Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('tickets')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'tickets'
                  ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tickets</span>
            </button>

            {(currentUser.role === 'Master Admin' || currentUser.role === 'JK Manager' || currentUser.role === 'Smart Manager') && (
              <button
                onClick={() => onTabChange('approvals')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'approvals'
                    ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Approval Queue</span>
              </button>
            )}

            {currentUser.role === 'Master Admin' && (
              <button
                onClick={() => onTabChange('users')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'users'
                    ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </button>
            )}

            <button
              onClick={() => onTabChange('reports')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'reports'
                  ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Reports</span>
            </button>

            {currentUser.role === 'Master Admin' && (
              <button
                onClick={() => onTabChange('audit')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'audit'
                    ? 'bg-amber-400/15 text-amber-600 dark:text-amber-400 border border-amber-400/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                <span>Audit Trail</span>
              </button>
            )}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Raise Ticket Button */}
            <button
              onClick={onOpenRaiseTicket}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Raise Ticket</span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* User Profile & Demo Role Switcher */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 font-bold text-xs flex items-center justify-center">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div className="hidden lg:block text-left pr-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">{currentUser.fullName.split(' ')[0]}</p>
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-tight">{currentUser.role}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-56 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 hidden group-hover:block transition-all z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.fullName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                  <div className="mt-1 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{currentUser.role}</span>
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch Role (Testing)</p>
                  {(['Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => onSwitchUser(role)}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        currentUser.role === role
                          ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{role}</span>
                      {currentUser.role === role && <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1 px-2">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-2 py-1.5 rounded-md text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
