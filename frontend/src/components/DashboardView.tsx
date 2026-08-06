import React from 'react';
import { 
  Ticket as TicketIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Plus,
  RotateCw,
  Eye,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import type { Ticket, User } from '../types';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Filler
);

interface DashboardViewProps {
  currentUser: User;
  tickets: Ticket[];
  onOpenRaiseTicket: () => void;
  onSelectTicket: (ticket: Ticket) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  tickets,
  onOpenRaiseTicket,
  onSelectTicket,
  onNavigateTab
}) => {

  const totalCount = tickets.length;
  const pendingCount = tickets.filter(t => t.status === 'Pending Approval').length;
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const approvedCount = tickets.filter(t => t.status === 'Approved' || t.status === 'In Progress').length;
  const rejectedCount = tickets.filter(t => t.status === 'Rejected').length;
  const criticalCount = tickets.filter(t => t.priority === 'Critical' || t.severity === 'Critical').length;

  // Detect dark mode for ChartJS text colors
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#cbd5e1' : '#334155';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  // 1. Tickets by Status Data
  const statusCounts = {
    Open: tickets.filter(t => t.status === 'Open').length,
    Pending: tickets.filter(t => t.status === 'Pending Approval').length,
    Approved: tickets.filter(t => t.status === 'Approved').length,
    'In Progress': tickets.filter(t => t.status === 'In Progress').length,
    Resolved: tickets.filter(t => t.status === 'Resolved').length,
    Closed: tickets.filter(t => t.status === 'Closed').length,
    Rejected: tickets.filter(t => t.status === 'Rejected').length,
  };

  const statusChartData = {
    labels: ['Open', 'Pending', 'Approved', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
    datasets: [
      {
        data: [
          statusCounts['Open'],
          statusCounts['Pending'],
          statusCounts['Approved'],
          statusCounts['In Progress'],
          statusCounts['Resolved'],
          statusCounts['Closed'],
          statusCounts['Rejected']
        ],
        backgroundColor: [
          '#00b4ff', // Open (Blue)
          '#ffd600', // Pending (Yellow)
          '#00e676', // Approved (Green)
          '#bf00ff', // In Progress (Purple)
          '#00e676', // Resolved (Green)
          '#ff6d00', // Closed (Orange)
          '#ff3d3d'  // Rejected (Red)
        ],
        borderWidth: 0,
      }
    ]
  };

  // 2. Tickets by Priority Data
  const priorityCounts = {
    Low: tickets.filter(t => t.priority === 'Low').length,
    Medium: tickets.filter(t => t.priority === 'Medium').length,
    High: tickets.filter(t => t.priority === 'High').length,
    Critical: tickets.filter(t => t.priority === 'Critical').length,
  };

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [
          priorityCounts['Low'],
          priorityCounts['Medium'],
          priorityCounts['High'],
          priorityCounts['Critical']
        ],
        backgroundColor: [
          '#00b4ff', // Low (Blue)
          '#ffd600', // Medium (Yellow)
          '#ff6d00', // High (Orange)
          '#ff3d3d'  // Critical (Red)
        ],
        borderWidth: 0,
      }
    ]
  };

  // 3. Monthly Trend Line Data
  const trendChartData = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'Tickets',
        data: [0, 0, 0, 0, 0, totalCount],
        borderColor: '#ffd600',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(255, 214, 0, 0.4)');
          gradient.addColorStop(1, 'rgba(255, 214, 0, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffd600',
        pointBorderColor: isDark ? '#ffffff' : '#000000',
        pointRadius: 5,
        pointHoverRadius: 7,
      }
    ]
  };

  // 4. Tickets by Department Bar Data
  const deptCounts: Record<string, number> = {};
  tickets.forEach(t => {
    const deptName = t.department.replace('Tire Manufacturing & Production', 'Manufacturing')
      .replace('Plant Machinery & Maintenance', 'Plant Maintenance')
      .replace('Quality Assurance & Testing', 'Quality QA')
      .replace('IT Infrastructure & Automation', 'IT Automation')
      .replace('Logistics & Supply Chain', 'Logistics')
      .replace('Environment, Health & Safety', 'EHS Safety');
    deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
  });

  const deptChartData = {
    labels: Object.keys(deptCounts).length > 0 ? Object.keys(deptCounts) : ['Manufacturing', 'Plant Maintenance', 'Quality QA', 'IT Automation'],
    datasets: [
      {
        label: 'Volume',
        data: Object.values(deptCounts).length > 0 ? Object.values(deptCounts) : [2, 2, 1, 1],
        backgroundColor: '#00b4ff',
        borderRadius: 6,
      }
    ]
  };

  const chartOptionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: textColor,
          font: { family: 'Outfit, sans-serif', size: 11 },
          usePointStyle: true,
          boxWidth: 8,
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#12151e' : '#ffffff',
        titleColor: isDark ? '#ffd600' : '#0f172a',
        bodyColor: isDark ? '#ffffff' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      }
    },
    cutout: '68%',
  };

  const chartOptionsLine = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#12151e' : '#ffffff',
        titleColor: isDark ? '#ffd600' : '#0f172a',
        bodyColor: isDark ? '#ffffff' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 11 } },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 11 }, stepSize: 2 },
        grid: { color: gridColor }
      }
    }
  };

  const chartOptionsBar = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#12151e' : '#ffffff',
        titleColor: isDark ? '#ffd600' : '#0f172a',
        bodyColor: isDark ? '#ffffff' : '#334155',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 10 } },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, font: { family: 'Outfit, sans-serif', size: 11 }, stepSize: 1 },
        grid: { color: gridColor }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffd600]/10 border border-[#ffd600]/30 text-amber-600 dark:text-[#ffd600] text-xs font-mono font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Active Role: {currentUser.role}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-outfit">
            Operations <span className="text-amber-600 dark:text-[#ffd600]">Overview</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time plant ticketing metrics, SLA compliance, and equipment queue</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:border-[#ffd600] font-bold transition-all cursor-pointer"
          >
            <RotateCw className="w-4 h-4 text-amber-600 dark:text-[#ffd600]" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenRaiseTicket}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#ffd600] text-slate-950 font-black shadow-md shadow-[#ffd600]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Ticket</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Total Tickets */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#ffd600] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">Total Tickets</span>
            <TicketIcon className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-2">{totalCount}</p>
          <span className="text-[10px] text-slate-400">System Scope</span>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#ffd600] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">Pending</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-[#ffd600]" />
          </div>
          <p className="text-3xl font-black text-amber-600 dark:text-[#ffd600] font-mono mt-2">{pendingCount}</p>
          <span className="text-[10px] text-amber-500 font-bold">Action Required</span>
        </div>

        {/* Open Tickets */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#ffd600] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">Open</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-black text-sky-500 font-mono mt-2">{openCount}</p>
          <span className="text-[10px] text-sky-400">Logged Issues</span>
        </div>

        {/* Approved */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#ffd600] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-500 font-mono mt-2">{approvedCount}</p>
          <span className="text-[10px] text-emerald-400 font-bold">Work In Progress</span>
        </div>

        {/* Rejected */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:border-[#ffd600] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">Rejected</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-rose-500 font-mono mt-2">{rejectedCount}</p>
          <span className="text-[10px] text-slate-400">Returned</span>
        </div>

        {/* Critical SLA */}
        <div className="bg-white dark:bg-[#12151e] p-5 rounded-2xl border border-rose-500/30 shadow-sm hover:border-rose-500 transition-all bg-rose-500/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase text-rose-500">Critical SLA</span>
            <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <p className="text-3xl font-black text-rose-500 font-mono mt-2">{criticalCount}</p>
          <span className="text-[10px] text-rose-500 font-bold">2 Hr Escalation</span>
        </div>

      </div>

      {/* 2x2 Grid Charts - Fully Responsive to Light and Dark Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Tickets by Status */}
        <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#ffd600] font-outfit uppercase tracking-wider">
            Tickets by Status
          </h3>
          <div className="h-60 relative flex items-center justify-center">
            <Doughnut data={statusChartData} options={chartOptionsDoughnut} />
          </div>
        </div>

        {/* 2. Tickets by Priority */}
        <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#ffd600] font-outfit uppercase tracking-wider">
            Tickets by Priority
          </h3>
          <div className="h-60 relative flex items-center justify-center">
            <Doughnut data={priorityChartData} options={chartOptionsDoughnut} />
          </div>
        </div>

        {/* 3. Monthly Trend */}
        <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#ffd600] font-outfit uppercase tracking-wider">
            Monthly Trend
          </h3>
          <div className="h-60 relative flex items-center justify-center">
            <Line data={trendChartData} options={chartOptionsLine} />
          </div>
        </div>

        {/* 4. Tickets by Department */}
        <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-[#ffd600] font-outfit uppercase tracking-wider">
            Tickets by Department
          </h3>
          <div className="h-60 relative flex items-center justify-center">
            <Bar data={deptChartData} options={chartOptionsBar} />
          </div>
        </div>

      </div>

      {/* Action Bar / Recent Tickets Queue */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-outfit uppercase tracking-wider">Recent Tickets Queue</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Latest equipment breakdown and approval logs</p>
          </div>
          <button
            onClick={() => onNavigateTab('tickets')}
            className="flex items-center space-x-1 text-xs font-bold text-amber-600 dark:text-[#ffd600] hover:underline"
          >
            <span>View All Tickets</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
          {tickets.slice(0, 4).map(ticket => (
            <div key={ticket.id} className="py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] px-2 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-amber-600 dark:text-[#ffd600] bg-[#ffd600]/10 px-2 py-0.5 rounded border border-[#ffd600]/30 text-[11px]">
                  {ticket.ticketNumber}
                </span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{ticket.title}</p>
                  <p className="text-slate-400 text-[10px]">{ticket.location} • {ticket.department}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  ticket.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                  ticket.status === 'Pending Approval' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
                  ticket.status === 'In Progress' ? 'bg-purple-500/20 text-purple-500 border border-purple-500/30' :
                  'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                }`}>
                  {ticket.status}
                </span>
                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-[#ffd600] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
