import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  CheckSquare, 
  Users, 
  Building2, 
  Tags, 
  BarChart3, 
  History, 
  Bell, 
  User as UserIcon, 
  Settings, 
  LogOut,
  X
} from 'lucide-react';
import type { User } from '../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  unreadNotifCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onLogout,
  unreadNotifCount,
  isMobileOpen,
  onCloseMobile
}) => {

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'tickets', label: 'My Tickets', icon: FileText, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'create-ticket', label: 'New Ticket', icon: PlusCircle, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'Master Admin', 'JK Manager', 'Smart Manager'] },
    { id: 'users', label: 'User Control', icon: Users, roles: ['ADMIN', 'Master Admin'] },
    { id: 'departments', label: 'Departments', icon: Building2, roles: ['ADMIN', 'Master Admin', 'JKMANAGER', 'JK Manager'] },
    { id: 'categories', label: 'Categories', icon: Tags, roles: ['ADMIN', 'Master Admin', 'JKMANAGER', 'JK Manager'] },
    { id: 'reports', label: 'Analytics', icon: BarChart3, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'audit', label: 'Audit Trail', icon: History, roles: ['ADMIN', 'Master Admin'] },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount > 0 ? unreadNotifCount : undefined, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'profile', label: 'Profile', icon: UserIcon, roles: ['ADMIN', 'JKMANAGER', 'SMARTADMIN', 'USER', 'Master Admin', 'JK Manager', 'Smart Manager', 'RE User'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN', 'Master Admin'] },
  ];

  return (
    <>
      {/* Mobile Dark Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
        />
      )}

      {/* Responsive Sidebar Drawer */}
      <aside className={`w-64 bg-white dark:bg-[#080a10] border-r border-slate-200 dark:border-white/10 flex flex-col h-screen fixed left-0 top-0 bottom-0 z-50 text-slate-800 dark:text-white select-none transition-all duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        
        {/* Sidebar Header Branding Logo */}
        <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <img 
            src="/logo.png" 
            alt="SMART CONTROLS" 
            className="h-12 w-auto max-w-[170px] object-contain filter drop-shadow-md mx-auto" 
          />
          <button 
            onClick={onCloseMobile} 
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Badge */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 flex items-center space-x-3 bg-slate-50 dark:bg-white/[0.02]">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-[#ffd600]/30 text-amber-600 dark:text-[#ffd600] font-black text-sm flex items-center justify-center shadow-inner font-outfit">
            {getInitials(currentUser.fullName)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{currentUser.fullName}</p>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffd600]/20 text-amber-700 dark:text-[#ffd600] font-mono uppercase tracking-wider border border-[#ffd600]/30 font-bold">
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems
            .filter(item => item.roles.includes(currentUser.role))
            .map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#ffd600]/20 text-amber-700 dark:text-[#ffd600] border-r-4 border-[#ffd600] shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600 dark:text-[#ffd600]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={() => {
              onLogout();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-white border border-red-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
