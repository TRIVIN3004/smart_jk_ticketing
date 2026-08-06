import React from 'react';
import { X, Bell, ShieldAlert } from 'lucide-react';
import type { NotificationItem } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotificationTicket: (ticketId: number) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotificationTicket
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h3 className="font-black text-slate-900 dark:text-white text-base">Real-time Notifications</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mark read toolbar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">{notifications.filter(n => !n.isRead).length} unread alerts</span>
          <button onClick={onMarkAllAsRead} className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
            Mark all read
          </button>
        </div>

        {/* Stream */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => {
                if (n.ticketId) onSelectNotificationTicket(n.ticketId);
                onClose();
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                !n.isRead
                  ? 'bg-amber-400/10 border-amber-400/30'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>{n.title}</span>
                </span>
                <span className="text-[10px] text-slate-400">{n.createdAt}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
