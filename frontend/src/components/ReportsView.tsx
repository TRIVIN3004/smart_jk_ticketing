import React from 'react';
import { 
  BarChart3, 
  FileSpreadsheet, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Award,
  Calendar
} from 'lucide-react';
import type { Ticket } from '../types';

interface ReportsViewProps {
  tickets: Ticket[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ tickets }) => {

  const total = tickets.length;
  const approved = tickets.filter(t => t.status === 'Approved' || t.status === 'In Progress').length;

  const handleExport = (type: string) => {
    alert(`Generating & Exporting Enterprise Analytics Report to ${type}... Download starting.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 font-outfit">
            <BarChart3 className="w-5 h-5 text-[#ffd600]" />
            <span>Smart-JK Enterprise Ticket & Approval Analytics</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Plant performance metrics, manager resolution times, and SLA compliance reports</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* High Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>SLA Compliance</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2 font-mono">94.2%</p>
          <span className="text-[10px] text-emerald-500 font-bold">Within 24hr Target</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Resolution Time</span>
            <Clock className="w-4 h-4 text-[#ffd600]" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-[#ffd600] mt-2 font-mono">6.4 Hrs</p>
          <span className="text-[10px] text-amber-500 font-bold">-1.2 hrs vs last month</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Approval Rate</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-2 font-mono">88.5%</p>
          <span className="text-[10px] text-sky-500 font-bold">{approved} Approved Requests</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Plant Line</span>
            <Building2 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2 font-outfit">Chennai #1</p>
          <span className="text-[10px] text-purple-500 font-bold">Most Active Facility</span>
        </div>
      </div>

      {/* Performance Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Manager Performance Matrix */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-outfit">
            <Award className="w-5 h-5 text-[#ffd600]" />
            <span>Manager Approval Resolution Metrics</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Vikramaditya Singh (JK Manager)</p>
                <p className="text-[10px] text-slate-400">Tire Manufacturing & Production</p>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-400">18 Tickets Approved</p>
                <p className="text-[10px] text-slate-400 font-mono">Avg Response: 3.2 Hrs</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white">Ananya Deshmukh (Smart Manager)</p>
                <p className="text-[10px] text-slate-400">Plant Machinery & Maintenance</p>
              </div>
              <div className="text-right">
                <p className="font-black text-emerald-400">24 Tickets Approved</p>
                <p className="text-[10px] text-slate-400 font-mono">Avg Response: 2.1 Hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend Summary */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 font-outfit">
            <Calendar className="w-5 h-5 text-[#ffd600]" />
            <span>Monthly Equipment Ticket Volumes</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-semibold">
              <span>August 2026 (Current)</span>
              <span className="font-black text-[#ffd600] font-mono">{total} Logged</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#080a14] h-3 rounded-full overflow-hidden border border-white/5">
              <div className="bg-[#ffd600] h-full rounded-full" style={{ width: '85%' }}></div>
            </div>

            <div className="flex justify-between items-center text-slate-700 dark:text-slate-300 font-semibold pt-2">
              <span>July 2026</span>
              <span className="font-black text-slate-400 font-mono">142 Logged</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#080a14] h-3 rounded-full overflow-hidden border border-white/5">
              <div className="bg-slate-600 h-full rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
