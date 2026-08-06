import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import type { DepartmentItem } from '../types';

interface DepartmentsViewProps {
  departments: DepartmentItem[];
  onAddDepartment: (dept: Omit<DepartmentItem, 'id'>) => void;
}

export const DepartmentsView: React.FC<DepartmentsViewProps> = ({
  departments,
  onAddDepartment
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddDepartment({
      name,
      description,
      status: 'Active'
    });
    setShowModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#ffd600]" />
            <span>Plant Departments Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage plant operational divisions and routing matrices</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#ffd600] text-slate-950 font-extrabold text-xs shadow-md shadow-[#ffd600]/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 font-mono">#</th>
                <th className="p-3.5">Department Name</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-medium">
              {departments.map((dept, index) => (
                <tr key={dept.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono text-[#ffd600] font-bold">{index + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{dept.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400">{dept.description}</td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                      {dept.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Dept Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-md glass-modal rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Add Plant Department</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Department Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chemical & Solvent Mixing Bay"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of department responsibility..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#ffd600] text-slate-950 font-black">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
