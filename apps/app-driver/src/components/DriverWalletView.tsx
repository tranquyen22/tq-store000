'use client';

import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export const DriverWalletView: React.FC = () => {
  const earningsBalance = 1250000;
  const depositBalance = 850000;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white mb-6">
      
      <h2 className="text-base font-extrabold mb-4 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-emerald-400" />
        <span>Hệ Thống 2 Ví Tài Xế TQ Platform</span>
      </h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        
        {/* 1. Ví Thu Nhập (Earnings Wallet) */}
        <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 p-4 rounded-2xl border border-emerald-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-extrabold text-emerald-400">1. VÍ THU NHẬP</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <strong className="text-xl font-black text-white block mb-1">
            {formatVND(earningsBalance)}
          </strong>
          <span className="text-[10px] text-slate-400 block font-medium">
            Nhận tiền cuốc online, chuyển khoản & tiền thưởng
          </span>
        </div>

        {/* 2. Ví Ký Quỹ (Deposit Wallet) */}
        <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 p-4 rounded-2xl border border-amber-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-extrabold text-amber-400">2. VÍ KÝ QUỸ (DEPOSIT)</span>
            <ArrowDownRight className="w-4 h-4 text-amber-400" />
          </div>
          <strong className="text-xl font-black text-white block mb-1">
            {formatVND(depositBalance)}
          </strong>
          <span className="text-[10px] text-slate-400 block font-medium">
            Tự động trừ 20% chiết khấu sàn khi thu tiền mặt COD
          </span>
        </div>

      </div>

      {/* Audit Log / Ledger Example */}
      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs">
        <span className="font-bold text-slate-400 block mb-1">Lịch sử trừ chiết khấu cuốc tiền mặt mới nhất:</span>
        <div className="flex justify-between items-center text-[11px] text-slate-300">
          <span>Cuốc #RIDE-4401 (Khách trả 100.000đ tiền mặt)</span>
          <span className="text-amber-400 font-extrabold">-20.000 VNĐ (Ví ký quỹ)</span>
        </div>
      </div>

    </div>
  );
};
