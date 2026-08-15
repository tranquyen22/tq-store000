'use client';

import React, { useState } from 'react';
import { Search, Wallet, Coins, User, ShoppingBag, LogOut, ChevronDown } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { SearchScope } from '../types';

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  walletBalance?: number;
  xuBalance?: number;
  onSearch?: (query: string, scope: SearchScope) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isLoggedIn = true,
  userName = 'Nguyễn Văn A',
  walletBalance = 1500000,
  xuBalance = 250,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('ALL');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery, scope);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl font-extrabold tracking-tight font-outfit text-white">
            TQ <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">Platform</span>
          </span>
        </a>

        {/* Scope Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center bg-slate-800 rounded-full border border-slate-700 overflow-hidden focus-within:border-sky-500 transition-all">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value as SearchScope)}
            className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-2.5 outline-none border-r border-slate-700 cursor-pointer"
          >
            <option value="ALL">Tất cả</option>
            <option value="PRODUCTS">Sản phẩm</option>
            <option value="RENTAL">Thuê đồ</option>
            <option value="FOOD">Đồ ăn 30P</option>
            <option value="BEAUTY">Spa/Beauty</option>
            <option value="TAXI">Đặt xe Taxi</option>
            <option value="SHOPS">Gian hàng</option>
          </select>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm đầm thuê, trà sữa, mỹ phẩm, đặt taxi..."
            className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none"
          />

          <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </form>

        {/* Dynamic Header State */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {isLoggedIn ? (
            <>
              {/* TQ Pay Wallet Balance */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Ví TQ Pay</span>
                  <strong className="text-emerald-400 font-bold">{formatVND(walletBalance)}</strong>
                </div>
              </div>

              {/* TQ Xu Balance */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
                <Coins className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Điểm Xu</span>
                  <strong className="text-amber-400 font-bold">{xuBalance} Xu</strong>
                </div>
              </div>

              {/* User Avatar Menu */}
              <div className="relative">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-full bg-slate-800 border border-slate-700 hover:border-sky-500 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-pink-500 text-white font-extrabold text-xs flex items-center justify-center">
                    {userName.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline max-w-[100px] truncate">{userName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-2xl shadow-xl py-2 z-50 text-xs">
                    <a href="/profile" className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-700 text-slate-200"><User className="w-4 h-4 text-sky-400" /> Hồ sơ cá nhân</a>
                    <a href="/orders" className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-700 text-slate-200"><ShoppingBag className="w-4 h-4 text-pink-400" /> Đơn hàng & Đặt xe</a>
                    <button onClick={() => alert('Đã đăng xuất')} className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-700 text-red-400 text-left border-t border-slate-700 mt-1"><LogOut className="w-4 h-4" /> Đăng xuất</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <a href="/login" className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white">Đăng nhập</a>
              <a href="/register" className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-full">Đăng ký</a>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
