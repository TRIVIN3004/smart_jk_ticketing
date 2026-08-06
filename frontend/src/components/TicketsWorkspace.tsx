import React, { useState } from 'react';
import { 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Eye, 
  Plus
} from 'lucide-react';
import type { Ticket, UserRole } from '../types';

interface TicketsWorkspaceProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
  onOpenRaiseTicket: () => void;
  currentUserRole: UserRole;
  searchQuery: string;
}

export const TicketsWorkspace: React.FC<TicketsWorkspaceProps> = ({
  tickets,
  onSelectTicket,
  onOpenRaiseTicket,
  searchQuery: globalSearchQuery
}) => {
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');

  // Multi-select for Export
  const [selectedTicketIds, setSelectedTicketIds] = useState<number[]>([]);

  const activeSearch = globalSearchQuery || localSearchQuery;

  // Filtering Logic
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.ticketNumber.toLowerCase().includes(activeSearch.toLowerCase()) ||
      t.title.toLowerCase().includes(activeSearch.toLowerCase()) ||
      t.raisedBy.toLowerCase().includes(activeSearch.toLowerCase()) ||
      t.location.toLowerCase().includes(activeSearch.toLowerCase()) ||
      (t.machineNumber && t.machineNumber.toLowerCase().includes(activeSearch.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    const matchesType = ticketTypeFilter === 'All' || t.ticketType === ticketTypeFilter;
    const matchesDept = departmentFilter === 'All' || t.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesDept;
  });

  const toggleSelectAll = () => {
    if (selectedTicketIds.length === filteredTickets.length) {
      setSelectedTicketIds([]);
    } else {
      setSelectedTicketIds(filteredTickets.map(t => t.id));
    }
  };

  const toggleSelectTicket = (id: number) => {
    if (selectedTicketIds.includes(id)) {
      setSelectedTicketIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedTicketIds(prev => [...prev, id]);
    }
  };

  const handleExport = (type: 'Excel' | 'PDF' | 'CSV') => {
    const count = selectedTicketIds.length > 0 ? selectedTicketIds.length : filteredTickets.length;
    alert(`Exporting ${count} tickets to ${type} format. File download starting...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-[#00b4ff]/10 text-[#00b4ff] border-[#00b4ff]/30';
      case 'Pending Approval':
        return 'bg-[#ffd600]/10 text-[#ffd600] border-[#ffd600]/30';
      case 'Approved':
      case 'Resolved':
        return 'bg-[#00e676]/10 text-[#00e676] border-[#00e676]/30';
      case 'In Progress':
        return 'bg-[#bf00ff]/10 text-[#bf00ff] border-[#bf00ff]/30';
      case 'Rejected':
        return 'bg-[#ff3d3d]/10 text-[#ff3d3d] border-[#ff3d3d]/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'INCIDENT':
        return 'border border-red-500 text-red-500 bg-red-500/10';
      case 'RELEASE':
        return 'border border-[#ffd600] text-[#ffd600] bg-[#ffd600]/10';
      case 'DEPLOYMENT':
        return 'border border-emerald-500 text-emerald-400 bg-emerald-500/10';
      case 'CHANGE_REQUEST':
        return 'border border-purple-500 text-purple-400 bg-purple-500/10';
      case 'PROBLEM':
        return 'border border-orange-500 text-orange-400 bg-orange-500/10';
      case 'SERVICE_REQUEST':
        return 'border border-sky-500 text-sky-400 bg-sky-500/10';
      default:
        return 'border border-slate-500 text-slate-400 bg-slate-500/10';
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 font-outfit">
            <span>Smart-JK Tickets Workspace</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffd600]/20 text-amber-600 dark:text-[#ffd600] font-bold border border-[#ffd600]/30 font-mono">
              {filteredTickets.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Filter tickets by type, category, priority, and department</p>
        </div>

        <div className="flex items-center space-x-2">
          
          {/* Export Dropdown */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleExport('Excel')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>

          <button
            onClick={onOpenRaiseTicket}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#ffd600] text-slate-950 font-black text-xs shadow-md shadow-[#ffd600]/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-white/10">
        
        {/* Global Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            placeholder="Search Ticket #, Title, Machine..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-mono"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Ticket Type Filter */}
        <div>
          <select
            value={ticketTypeFilter}
            onChange={(e) => setTicketTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-medium font-mono"
          >
            <option value="All">All Ticket Types</option>
            <option value="INCIDENT">INCIDENT (IM)</option>
            <option value="PROBLEM">PROBLEM (PR)</option>
            <option value="SERVICE_REQUEST">SERVICE REQUEST (SR)</option>
            <option value="CHANGE_REQUEST">CHANGE REQUEST (CR)</option>
            <option value="DEPLOYMENT">DEPLOYMENT (DP)</option>
            <option value="RELEASE">RELEASE (RL)</option>
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Tire Manufacturing & Production">Manufacturing</option>
            <option value="Plant Machinery & Maintenance">Plant Maintenance</option>
            <option value="Quality Assurance & Testing">Quality QA</option>
            <option value="IT Infrastructure & Automation">IT Automation</option>
            <option value="Logistics & Supply Chain">Logistics</option>
            <option value="Environment, Health & Safety">EHS Safety</option>
          </select>
        </div>

      </div>

      {/* Main Sticky Header Data Table */}
      <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedTicketIds.length === filteredTickets.length && filteredTickets.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 dark:border-white/20 text-[#ffd600] focus:ring-[#ffd600]"
                  />
                </th>
                <th className="p-3.5 font-mono tracking-widest text-[#ffd600]">TICKET ID</th>
                <th className="p-3.5">TYPE</th>
                <th className="p-3.5">TITLE & LOCATION</th>
                <th className="p-3.5">PRIORITY</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">DEPARTMENT</th>
                <th className="p-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-800 dark:text-slate-200 font-medium">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No tickets match the selected filter query.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(ticket => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedTicketIds.includes(ticket.id)}
                        onChange={() => toggleSelectTicket(ticket.id)}
                        className="rounded border-slate-300 dark:border-white/20 text-[#ffd600] focus:ring-[#ffd600]"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-black text-white text-xs tracking-wider">
                      {ticket.ticketNumber}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-extrabold tracking-wider ${getTypeBadgeStyle(ticket.ticketType)}`}>
                        {ticket.ticketType}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{ticket.title}</p>
                      <p className="text-[10px] text-slate-400">{ticket.location} {ticket.machineNumber ? `• ${ticket.machineNumber}` : ''}</p>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        ticket.priority === 'Critical' ? 'bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse' :
                        ticket.priority === 'High' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' :
                        ticket.priority === 'Medium' ? 'bg-[#ffd600]/20 text-amber-600 dark:text-[#ffd600] border border-[#ffd600]/30' :
                        'bg-sky-500/20 text-sky-500 border border-sky-500/30'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{ticket.department}</p>
                      <p className="text-[10px] text-slate-400">By {ticket.raisedBy.split(' ')[0]}</p>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => onSelectTicket(ticket)}
                        className="px-3 py-1.5 rounded-lg bg-[#ffd600]/20 hover:bg-[#ffd600]/30 text-amber-600 dark:text-[#ffd600] font-bold transition-all flex items-center space-x-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
