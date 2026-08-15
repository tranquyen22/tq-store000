'use client';

import React from 'react';
import { Wallet, Coins, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { DriverWalletsState } from '../types';

interface DriverWalletViewProps {
  wallets: DriverWalletsState;
}

export const DriverWalletView: React.FC<DriverWalletViewProps> = ({ wallets }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
        <Wallet className="w-4 h-4 text-sky-500" />
        <span>Hệ Thống 2 Ví Tài Xế TQ Partner</span>
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {/* Earnings Wallet */}
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <Coins className="w-3.5 h-3.5" />
            <span>Ví Thu Nhập</span>
          </div>
          <strong className="text-lg font-extrabold text-emerald-600 dark:text-emerald-300 block">
            {formatVND(wallets.earningsBalance)}
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">Cuốc online & Thưởng</span>
        </div>

        {/* Deposit Wallet */}
        <div className="bg-sky-500/10 border border-sky-500/30 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ví Ký Quỹ</span>
          </div>
          <strong className="text-lg font-extrabold text-sky-600 dark:text-sky-300 block">
            {formatVND(wallets.depositBalance)}
          </strong>
          <span className="text-[10px] text-slate-400 block mt-0.5">Tự động trừ 20% cuốc COD</span>
        </div>
      </div>

      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border text-xs text-slate-500 space-y-1">
        <div className="flex justify-between font-semibold">
          <span>Lịch sử cuốc COD gần nhất:</span>
          <span className="text-red-500 font-bold flex items-center gap-0.5">
            <ArrowDownLeft className="w-3 h-3" /> -{formatVND(24000)} (Chiết khấu 20%)
          </span>
        </div>
      </div>
    </div>
  );
};
