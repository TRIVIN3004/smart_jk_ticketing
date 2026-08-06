import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  CheckCircle, 
  XCircle, 
  Search
} from 'lucide-react';
import type { User, UserRole } from '../types';

interface UserManagementViewProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id'>) => void;
  onToggleUserStatus: (userId: number) => void;
  onResetPassword: (userId: number) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onToggleUserStatus,
  onResetPassword
}) => {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone] = useState('+91 98765 43219');
  const [role, setRole] = useState<UserRole>('JK Manager');
  const [department] = useState('Tire Manufacturing & Production');
  const [plantLocation] = useState('Chennai Plant 1');

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUser({
      username,
      fullName,
      email,
      phone,
      role,
      department,
      plantLocation,
      isActive: true,
      lastLoginAt: 'Never'
    });
    setShowAddModal(false);
    setUsername('');
    setFullName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 shadow-sm">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 font-outfit">
            <Users className="w-5 h-5 text-[#ffd600]" />
            <span>Master Admin User Control Center</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage plant personnel accounts, RBAC role permissions, and access logs</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#ffd600] text-slate-950 font-black text-xs shadow-md shadow-[#ffd600]/20 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add System User</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0c0f16] border border-slate-200 dark:border-white/10">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by User Name, Email, or Employee Username..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:border-[#ffd600] focus:outline-none font-mono"
          />
        </div>
      </div>

      {/* Users Data Grid */}
      <div className="bg-white dark:bg-[#12151e] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#0c0f16] border-b border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-3.5">User Identity</th>
                <th className="p-3.5">Role & Permissions</th>
                <th className="p-3.5">Department & Plant</th>
                <th className="p-3.5">Contact Email</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Last Activity</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-800 dark:text-slate-200 font-medium">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-[#ffd600] text-slate-950 font-black flex items-center justify-center text-xs font-outfit">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{user.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-[#ffd600]/20 text-amber-600 dark:text-[#ffd600] border border-[#ffd600]/30 font-mono">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-800 dark:text-slate-200">{user.department}</p>
                    <p className="text-[10px] text-slate-400">{user.plantLocation}</p>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">{user.email}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      user.isActive ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">{user.lastLoginAt || 'N/A'}</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onResetPassword(user.id)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#080a14] text-slate-600 dark:text-slate-300 hover:text-[#ffd600] transition-colors border border-slate-200 dark:border-white/10"
                        title="Reset Password"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`p-1.5 rounded-lg transition-colors border ${
                          user.isActive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20'
                        }`}
                        title={user.isActive ? "Deactivate Account" : "Activate Account"}
                      >
                        {user.isActive ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
          <div className="w-full max-w-lg glass-modal rounded-3xl p-6 border border-slate-200 dark:border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-outfit">Create System Personnel Account</h3>
            
            <form onSubmit={handleSubmitNewUser} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. skumar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role Assignment</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none font-mono font-bold"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="JKMANAGER">JKMANAGER</option>
                    <option value="SMARTADMIN">SMARTADMIN</option>
                    <option value="USER">USER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="skumar@jktyre.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-white/10">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-white/10 font-bold">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#ffd600] text-slate-950 font-black">Save Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
