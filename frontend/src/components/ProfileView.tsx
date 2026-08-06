import React, { useState } from 'react';
import { Building2, MapPin, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react';
import type { User } from '../types';

interface ProfileViewProps {
  currentUser: User;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ currentUser }) => {
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully.");
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl text-xs">
      
      {/* User Info Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffd600] to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-[#ffd600]/20 font-outfit">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white font-outfit">{currentUser.fullName}</h2>
            <p className="text-xs text-slate-500 font-mono">@{currentUser.username}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded bg-[#ffd600]/10 text-[#ffd600] font-mono font-bold text-[10px] uppercase border border-[#ffd600]/30">
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-white/5 space-y-2">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-[#ffd600]" />
              <span>Email Address</span>
            </span>
            <span className="font-bold font-mono text-slate-900 dark:text-white">{currentUser.email}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center space-x-2">
              <Phone className="w-4 h-4 text-[#ffd600]" />
              <span>Phone Number</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.phone || '+91 98765 43210'}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#ffd600]" />
              <span>Department</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.department}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-500 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#ffd600]" />
              <span>Plant Location</span>
            </span>
            <span className="font-bold text-slate-900 dark:text-white">{currentUser.plantLocation}</span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-white/10 space-y-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center space-x-2">
          <Lock className="w-4 h-4 text-[#ffd600]" />
          <span>Security & Password Reset</span>
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#080a14] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#ffd600] text-slate-950 font-black flex items-center space-x-2 cursor-pointer shadow-md shadow-[#ffd600]/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Update Password</span>
          </button>
        </form>
      </div>

    </div>
  );
};
