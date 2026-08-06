import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  MessageSquare, 
  Paperclip, 
  Send,
  History,
  ShieldCheck
} from 'lucide-react';
import type { Ticket, UserRole } from '../types';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
  onApproveTicket: (ticketId: number, comment: string) => void;
  onRejectTicket: (ticketId: number, comment: string) => void;
  onRequestInfo: (ticketId: number, comment: string) => void;
  onAddComment: (ticketId: number, commentText: string) => void;
  currentUserRole: UserRole;
  currentUserName: string;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  onClose,
  onApproveTicket,
  onRejectTicket,
  onRequestInfo,
  onAddComment,
  currentUserRole,
}) => {
  if (!ticket) return null;

  const [approvalComment, setApprovalComment] = useState('');
  const [newComment, setNewComment] = useState('');
  const [showApprovalBox, setShowApprovalBox] = useState(false);
  const [approvalActionType, setApprovalActionType] = useState<'Approve' | 'Reject' | 'RequestInfo'>('Approve');

  const canApprove = (currentUserRole === 'Master Admin' || currentUserRole === 'JK Manager' || currentUserRole === 'Smart Manager') && ticket.status === 'Pending Approval';

  const handleProcessAction = () => {
    if (approvalActionType === 'Approve') {
      onApproveTicket(ticket.id, approvalComment || 'Approved by Manager');
    } else if (approvalActionType === 'Reject') {
      onRejectTicket(ticket.id, approvalComment || 'Rejected by Manager');
    } else {
      onRequestInfo(ticket.id, approvalComment || 'Requested additional diagnostic details');
    }
    setShowApprovalBox(false);
    setApprovalComment('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(ticket.id, newComment);
    setNewComment('');
  };

  // Workflow pipeline step calculation
  const steps = [
    { label: 'Ticket Raised', status: 'completed' },
    { label: 'Manager Approval', status: ticket.status === 'Pending Approval' ? 'current' : ticket.status === 'Rejected' ? 'rejected' : 'completed' },
    { label: 'In Progress', status: ticket.status === 'Approved' || ticket.status === 'In Progress' ? 'current' : ticket.status === 'Closed' ? 'completed' : 'upcoming' },
    { label: 'Closed & Verified', status: ticket.status === 'Closed' ? 'completed' : 'upcoming' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-modal rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-black border border-amber-400/30">
              {ticket.ticketNumber}
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{ticket.title}</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Category: {ticket.category} • Location: {ticket.location}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
              ticket.status === 'Pending Approval' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' :
              ticket.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
              ticket.status === 'Rejected' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/30' :
              'bg-slate-500/20 text-slate-400'
            }`}>
              {ticket.status}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual ServiceNow Approval Pipeline */}
        <div className="px-6 py-4 bg-slate-100/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between relative">
            {steps.map((step, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                  step.status === 'completed' ? 'bg-emerald-500 text-white' :
                  step.status === 'current' ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 animate-pulse' :
                  step.status === 'rejected' ? 'bg-rose-500 text-white' :
                  'bg-slate-300 dark:bg-slate-800 text-slate-500'
                }`}>
                  {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> :
                   step.status === 'rejected' ? <XCircle className="w-4 h-4" /> :
                   idx + 1}
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mt-1">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Action Ribbon for Approvers */}
          {canApprove && (
            <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Approval Required</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">You hold approval permissions for this plant ticket.</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setApprovalActionType('Approve'); setShowApprovalBox(true); }}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center space-x-1 shadow-md shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => { setApprovalActionType('Reject'); setShowApprovalBox(true); }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex items-center space-x-1 shadow-md shadow-rose-500/20"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => { setApprovalActionType('RequestInfo'); setShowApprovalBox(true); }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Request Info</span>
                </button>
              </div>
            </div>
          )}

          {/* Approval Modal Box */}
          {showApprovalBox && (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-amber-400/40 space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Action: {approvalActionType}</span>
              </h4>
              <textarea
                rows={2}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="Enter mandatory approval / rejection reason..."
                className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowApprovalBox(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 font-bold">Cancel</button>
                <button onClick={handleProcessAction} className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-black">Confirm Action</button>
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Raised By</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{ticket.raisedBy}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Department</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{ticket.department}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Machine #</span>
              <p className="font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">{ticket.machineNumber || 'N/A'}</p>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Severity</span>
              <span className="inline-block font-extrabold text-rose-500 mt-0.5">{ticket.severity}</span>
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Issue Description</h4>
            <p className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
              {ticket.description}
            </p>
          </div>

          {/* Attachments Section */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center space-x-1">
                <Paperclip className="w-4 h-4 text-amber-500" />
                <span>Attachments ({ticket.attachments.length})</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map(att => (
                  <a
                    key={att.id}
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert(`Opening ${att.fileName}`); }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-400/10 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-all"
                  >
                    <Paperclip className="w-3.5 h-3.5 text-amber-500" />
                    <span>{att.fileName} ({att.fileSizeKb} KB)</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Audit History & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Approval Log Stream */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-1">
                <History className="w-4 h-4 text-amber-500" />
                <span>Audit & Approval Trail</span>
              </h4>
              <div className="space-y-2.5">
                {ticket.approvalHistory && ticket.approvalHistory.length > 0 ? (
                  ticket.approvalHistory.map(log => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{log.approverName} ({log.approverRole})</span>
                        <span>{log.actionDate}</span>
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">Action: <span className="text-emerald-500 font-bold">{log.action}</span></p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">"{log.comments}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-[11px]">No workflow transitions recorded yet.</p>
                )}
              </div>
            </div>

            {/* Comment Stream */}
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>Comment Thread</span>
              </h4>

              <div className="space-y-2.5 mb-3 max-h-40 overflow-y-auto pr-1">
                {ticket.comments && ticket.comments.length > 0 ? (
                  ticket.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{c.userName} ({c.userRole})</span>
                        <span>{c.createdAt}</span>
                      </div>
                      <p className="text-slate-800 dark:text-slate-200 mt-1">{c.commentText}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-[11px]">No comments posted yet.</p>
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handlePostComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Post comment or operational update..."
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none"
                />
                <button type="submit" className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-500">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
