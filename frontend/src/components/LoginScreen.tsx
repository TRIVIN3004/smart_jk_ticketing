import React, { useState } from 'react';
import { Lock, User as UserIcon, Sun, Moon, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (username: string, role: UserRole) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  darkMode,
  onToggleDarkMode
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const uUpper = username.trim().toUpperCase();

    // Role mapping based on requested User Credentials
    let role: UserRole = 'ADMIN';
    if (uUpper === 'RAGHAV' || uUpper === 'JEYAPRAKASH') {
      role = 'JKMANAGER';
    } else if (uUpper === 'RAHUL') {
      role = 'SMARTADMIN';
    } else if (['SACHIN', 'THARUN', 'JEYAPRAKASH_RE', 'SHANMUGHAM'].includes(uUpper)) {
      role = 'USER';
    } else if (uUpper === 'ADMIN') {
      role = 'ADMIN';
    }

    setTimeout(() => {
      setIsLoading(false);
      onLogin(username.trim(), role);
    }, 500);
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 transition-colors duration-500 overflow-hidden font-outfit ${
      darkMode 
        ? 'bg-[#020408] text-white' 
        : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* Background Radial Glow */}
      <div className={`absolute inset-0 pointer-events-none ${
        darkMode ? 'bg-[radial-gradient(circle_at_center,#111827_0%,#020408_100%)]' : 'bg-[radial-gradient(circle_at_center,#e2e8f0_0%,#f1f5f9_100%)]'
      }`}></div>

      {/* Top Header Logo */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="SMART CONTROLS" className="h-10 w-auto object-contain filter drop-shadow-md" />
          <span className="text-xs px-2.5 py-1 rounded bg-[#ffd600]/20 text-amber-600 dark:text-[#ffd600] font-bold border border-[#ffd600]/30 font-mono">Ticket Portal</span>
        </div>

        <button
          onClick={onToggleDarkMode}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            darkMode 
              ? 'bg-white/10 hover:bg-white/20 border-white/10 text-[#ffd600]' 
              : 'bg-slate-200 hover:bg-slate-300 border-slate-300 text-slate-800'
          }`}
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-[#ffd600]" /> : <Moon className="w-5 h-5 text-slate-800" />}
        </button>
      </div>

      {/* Login Card */}
      <div className={`w-full max-w-[440px] relative z-10 glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl border ${
        darkMode ? 'border-white/10 bg-[#12151e]/90 text-white' : 'border-slate-200 bg-white/95 text-slate-900'
      }`}>
        
        {/* Header Logo */}
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="SMART CONTROLS" 
            className="h-20 w-auto max-w-full object-contain mx-auto mb-3 filter drop-shadow-lg" 
          />
          <p className={`text-xs uppercase tracking-widest font-semibold mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ticket Management System</p>
        </div>

        {/* Error alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Username</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd600]/30 transition-all font-mono ${
                  darkMode
                    ? 'bg-[#080a14] border border-white/10 focus:border-[#ffd600] text-white placeholder-slate-500'
                    : 'bg-slate-50 border border-slate-300 focus:border-[#ffd600] text-slate-900 placeholder-slate-400'
                }`}
                placeholder="Enter username (e.g. RAGHAV)"
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#ffd600]/30 transition-all font-mono ${
                  darkMode
                    ? 'bg-[#080a14] border border-white/10 focus:border-[#ffd600] text-white placeholder-slate-500'
                    : 'bg-slate-50 border border-slate-300 focus:border-[#ffd600] text-slate-900 placeholder-slate-400'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className={`flex items-center space-x-2 cursor-pointer ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-[#ffd600] focus:ring-[#ffd600]"
              />
              <span>Remember session</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-[#ffd600] hover:bg-[#e6c200] text-black font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-[#ffd600]/25 transition-all transform active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>▶ LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
