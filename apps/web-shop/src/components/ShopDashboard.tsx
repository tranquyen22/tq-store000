'use client';

import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export const ShopDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      
      {/* 1. Pending Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400">Đơn hàng mới</span>
          <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <strong className="text-2xl font-black text-slate-900 dark:text-white block mb-1">8 Đơn</strong>
        <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-500 animate-bounce" /> SLA 15 phút xử lý
        </span>
      </div>

      {/* 2. Processing Orders */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400">Đang chuẩn bị món</span>
          <div className="w-9 h-9 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <strong className="text-2xl font-black text-slate-900 dark:text-white block mb-1">12 Đơn</strong>
        <span className="text-[11px] text-sky-500 font-semibold">Đang chế biến / Bàn giao</span>
      </div>

      {/* 3. Completed Today */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400">Đã hoàn tất hôm nay</span>
          <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <strong className="text-2xl font-black text-slate-900 dark:text-white block mb-1">45 Đơn</strong>
        <span className="text-[11px] text-emerald-500 font-semibold">Tỷ lệ hoàn thành 98%</span>
      </div>

      {/* 4. Today Revenue */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-slate-400">Doanh thu hôm nay</span>
          <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <strong className="text-2xl font-black text-purple-600 dark:text-purple-400 block mb-1">
          {formatVND(4850000)}
        </strong>
        <span className="text-[11px] text-purple-500 font-semibold">+18% so với hôm qua</span>
      </div>

    </div>
  );
};
