'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu } from 'lucide-react';

interface AdminHeaderProps {
  adminName: string;
  isMaintenanceActive: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName,
  isMaintenanceActive
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 text-white font-black flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>TQ Super Admin Command Center</span>
              {isMaintenanceActive && (
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 animate-pulse" /> ĐANG BẢO TRÌ
                </span>
              )}
            </h1>
            <span className="text-[11px] text-slate-400">Trung tâm Điều hành & Quản trị Tối cao</span>
          </div>
        </div>

        {/* Health Status & Admin User */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
            <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Hệ thống: <strong>100% Operational</strong></span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-xs flex items-center justify-center">
              SA
            </div>
            <span className="text-xs font-bold text-slate-200 hidden sm:inline">{adminName}</span>
          </div>
        </div>

      </div>
    </header>
  );
};
