'use client';

import React, { useState } from 'react';
import { Search, Wallet, Coins, User as UserIcon, LogIn, ChevronDown } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

interface HeaderProps {
  isLoggedIn?: boolean;
  tqPayBalance?: number;
  tqXuBalance?: number;
  userName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = true,
  tqPayBalance = 1500000,
  tqXuBalance = 3500,
  userName = 'Trần Văn Quyền'
}) => {
  const [scope, setScope] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const scopeOptions = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'PRODUCT', label: 'Sản phẩm' },
    { key: 'SHOP', label: 'Shop' },
    { key: 'SERVICE', label: 'Dịch vụ' },
    { key: 'TAXI', label: 'Taxi/Xe ôm' },
    { key: 'SPA', label: 'Spa/Beauty' },
    { key: 'RENTAL', label: 'Cho thuê đồ' },
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white font-black text-xl flex items-center justify-center shadow-md">
            TQ
          </div>
          <span className="font-black text-lg text-slate-900 dark:text-white hidden sm:inline">TQ Platform</span>
        </div>

        {/* Scope Search Bar */}
        <div className="flex-1 max-w-2xl flex items-center rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <div className="relative group">
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className="appearance-none bg-transparent pl-3 pr-7 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              {scopeOptions.map(opt => (
                <option key={opt.key} value={opt.key} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm, váy cưới cho thuê, xe taxi, spa..."
            className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none"
          />

          <button className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tìm</span>
          </button>
        </div>

        {/* Header State (Unauthenticated vs Authenticated) */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Ví TQ Pay (Light Green Pill Badge) */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span>Ví TQ Pay: <strong>{formatVND(tqPayBalance)}</strong></span>
              </div>

              {/* TQ Xu (Orange/Yellow Pill Badge) */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Coins className="w-4 h-4 text-amber-500" />
                <span>TQ Xu: <strong>{tqXuBalance} Xu</strong></span>
              </div>

              {/* User Avatar Menu */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center shadow">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden xl:inline">{userName}</span>
              </div>
            </>
          ) : (
            <button className="px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
              <LogIn className="w-4 h-4" /> <span>Đăng nhập</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
