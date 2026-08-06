import React, { useState } from 'react';
import { Tags, Plus } from 'lucide-react';
import type { CategoryItem } from '../types';

interface CategoriesViewProps {
  categories: CategoryItem[];
  onAddCategory: (cat: Omit<CategoryItem, 'id'>) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onAddCategory
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [subsText, setSubsText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const subcategories = subsText.split(',').map(s => s.trim()).filter(Boolean);
    onAddCategory({
      name,
      subcategories,
      status: 'Active'
    });
    setShowModal(false);
    setName('');
    setSubsText('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <Tags className="w-5 h-5 text-[#ffd600]" />
            <span>Ticket Categories & Subcategories</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Configure issue classification and sub-category taxonomies</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#ffd600] text-slate-950 font-extrabold text-xs shadow-md shadow-[#ffd600]/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-3.5 font-mono">#</th>
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">Sub-Categories</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 font-medium">
              {categories.map((cat, index) => (
                <tr key={cat.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                  <td className="p-3.5 font-mono text-[#ffd600] font-bold">{index + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{cat.name}</td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-mono text-[10px] border border-slate-200 dark:border-white/10">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                      {cat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-md glass-modal rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Add Ticket Category</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Electrical Automation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Sub-Categories (comma separated)</label>
                <input
                  type="text"
                  value={subsText}
                  onChange={(e) => setSubsText(e.target.value)}
                  placeholder="e.g. Solenoid Valve, Sensor Fault, PLC Relay"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#ffd600] text-slate-950 font-black">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
