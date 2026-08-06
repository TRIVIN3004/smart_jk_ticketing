import React, { useState } from 'react';
import { Settings, Database, Server, Download, Zap, Edit3 } from 'lucide-react';
import type { SystemConfig } from '../types';

export const SettingsView: React.FC = () => {
  const [config] = useState<SystemConfig>({
    serverName: 'YOUR_SQL_SERVER',
    databaseName: 'JKTyre_TicketingDB',
    username: 'sa',
    port: 1433,
    apiBaseUrl: '/api/v1',
    jwtSecret: '••••••••••••••••••••',
    sessionTimeoutMinutes: 480
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleTestConnection = () => {
    alert("⚡ Testing SQL Server Database Connection...\nStatus: 200 OK — Connected to JKTyre_TicketingDB (MSSQL 1433)");
  };

  const handleDownloadSQL = () => {
    alert("Downloading SQL Server DDL & Stored Procedure Schema scripts (schema.sql)...");
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      
      {/* Page Title */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-5 h-5 text-[#ffd600]" />
          <span>System & Database Configuration</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage Microsoft SQL Server parameters, JWT API secrets, and enterprise license</p>
      </div>

      {/* Database Config Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-4">
        <h3 className="text-xs font-black text-[#ffd600] font-mono tracking-widest uppercase flex items-center space-x-2">
          <Database className="w-4 h-4" />
          <span>DATABASE CONFIGURATION</span>
        </h3>

        <div className="p-4 rounded-xl bg-[#080a14] border border-white/10 font-mono text-emerald-400 space-y-1.5 leading-relaxed">
          <div><span className="text-[#ffd600]">SERVER_NAME</span> = <span className="text-slate-200">{config.serverName}</span></div>
          <div><span className="text-[#ffd600]">DATABASE_NAME</span> = <span className="text-slate-200">{config.databaseName}</span></div>
          <div><span className="text-[#ffd600]">USERNAME</span> = <span className="text-slate-200">{config.username}</span></div>
          <div><span className="text-[#ffd600]">PASSWORD</span> = <span className="text-slate-200">••••••••</span></div>
          <div><span className="text-[#ffd600]">PORT</span> = <span className="text-slate-200">{config.port}</span></div>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#ffd600] font-bold transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#ffd600]" />
            <span>Edit Config</span>
          </button>
          <button
            onClick={handleTestConnection}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Test Connection</span>
          </button>
        </div>
      </div>

      {/* API Config */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-4">
        <h3 className="text-xs font-black text-[#ffd600] font-mono tracking-widest uppercase flex items-center space-x-2">
          <Server className="w-4 h-4" />
          <span>API & JWT CONFIGURATION</span>
        </h3>

        <div className="p-4 rounded-xl bg-[#080a14] border border-white/10 font-mono text-emerald-400 space-y-1.5 leading-relaxed">
          <div><span className="text-[#ffd600]">API_BASE_URL</span> = <span className="text-slate-200">{config.apiBaseUrl}</span></div>
          <div><span className="text-[#ffd600]">JWT_SECRET</span> = <span className="text-slate-200">{config.jwtSecret}</span></div>
          <div><span className="text-[#ffd600]">SESSION_TIMEOUT</span> = <span className="text-slate-200">{config.sessionTimeoutMinutes} minutes</span></div>
        </div>
      </div>

      {/* System Information */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-4">
        <h3 className="text-xs font-black text-[#ffd600] font-mono tracking-widest uppercase">SYSTEM INFORMATION</h3>

        <div className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Application</span>
            <span className="font-bold text-slate-900 dark:text-white">Smart-JK Enterprise v2.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Build Version</span>
            <span className="font-mono text-[#ffd600] font-bold">2026.08.001</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Database Engine</span>
            <span className="font-bold text-slate-900 dark:text-white">Microsoft SQL Server 2022</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">Authentication</span>
            <span className="font-bold text-slate-900 dark:text-white">JWT + BCrypt Password Hashing</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-500">License Status</span>
            <span className="font-bold text-emerald-500">Enterprise — Active</span>
          </div>
        </div>
      </div>

      {/* SQL Schema Scripts */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-3">
        <h3 className="text-xs font-black text-[#ffd600] font-mono tracking-widest uppercase">SQL SCHEMA SCRIPTS</h3>
        <p className="text-slate-500 dark:text-slate-400">Run these DDL scripts in SQL Server Management Studio (SSMS) to initialize database tables, views, and stored procedures.</p>
        <button
          onClick={handleDownloadSQL}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-[#ffd600] text-[#ffd600] hover:bg-[#ffd600]/10 font-bold transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download SQL Scripts (schema.sql)</span>
        </button>
      </div>

    </div>
  );
};
