import React from 'react';
import { History } from 'lucide-react';
import type { AuditLogItem } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 font-outfit">
          <History className="w-5 h-5 text-[#ffd600]" />
          <span>System Security & Audit Trail Logs</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Immutable security event history, ticket state mutations, and user administrative actions</p>
      </div>

      <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 font-mono">Log ID</th>
                <th className="p-3.5">User</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-medium text-slate-800 dark:text-slate-200">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5 font-mono text-[#ffd600] font-bold">#{log.id}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.user} ({log.role})</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-slate-100 dark:bg-[#080a14] border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">{log.entity} ({log.entityId})</td>
                  <td className="p-3.5 font-mono text-slate-400">{log.ipAddress}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{log.timestamp}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
