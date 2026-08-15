'use client';

import React from 'react';
import { Store, Building2, Bell, User } from 'lucide-react';
import { Branch } from '../types';

interface ShopHeaderProps {
  branches: Branch[];
  activeBranchId: string;
  onSelectBranch: (id: string) => void;
  shopName: string;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({
  branches,
  activeBranchId,
  onSelectBranch,
  shopName
}) => {
  const activeBranch = branches.find(b => b.id === activeBranchId) || branches[0];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Shop Name & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-500 to-pink-500 text-white font-extrabold flex items-center justify-center shadow-md">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white">{shopName}</h1>
            <span className="text-[11px] text-sky-400 font-semibold">TQ Shop Owner Dashboard</span>
          </div>
        </div>

        {/* Branch Switcher & Owner Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Building2 className="w-4 h-4 text-sky-400" />
            <select
              value={activeBranchId}
              onChange={(e) => onSelectBranch(e.target.value)}
              className="bg-transparent text-slate-200 font-bold outline-none cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-800 text-white">
                  {b.name} ({b.isOpen ? 'Mở cửa' : 'Đóng cửa'})
                </option>
              ))}
            </select>
          </div>

          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 relative">
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          </button>
        </div>

      </div>
    </header>
  );
};
