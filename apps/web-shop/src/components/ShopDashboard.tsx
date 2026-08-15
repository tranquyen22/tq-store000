'use client';

import React, { useState } from 'react';
import { Power, AlertTriangle, Clock, CheckCircle2, Volume2, ShoppingBag } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

interface ShopDashboardProps {
  isReceivingOrders: boolean;
  onToggleReceiving: (status: boolean) => void;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({
  isReceivingOrders,
  onToggleReceiving
}) => {
  const [audioNotification, setAudioNotification] = useState(true);

  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note chime
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn('[WARN][ShopDashboard.tsx - playChimeSound]: Audio Context not allowed', e);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      {/* Top Controls: Receiving Switch & Audio Notification Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Power className={`w-5 h-5 ${isReceivingOrders ? 'text-emerald-500' : 'text-red-500'}`} />
            <span>Bảng Điều Hành Shop Realtime</span>
          </h2>
          <p className="text-xs text-slate-500">Tự động nhận đơn hàng & cảnh báo âm thanh tức thì</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playChimeSound();
              setAudioNotification(!audioNotification);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              audioNotification ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-700 border-slate-300 text-slate-400'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>Âm thanh cảnh báo: {audioNotification ? 'BẬT' : 'TẮT'}</span>
          </button>

          {/* Toggle Receiving Switch */}
          <button
            onClick={() => {
              onToggleReceiving(!isReceivingOrders);
              if (!isReceivingOrders) playChimeSound();
            }}
            className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs flex items-center gap-2 transition-all shadow-md ${
              isReceivingOrders ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isReceivingOrders ? 'ĐANG BẬT NHẬN ĐƠN' : 'ĐÃ TẮT NHẬN ĐƠN'}</span>
          </button>
        </div>
      </div>

      {/* Order Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Đơn chờ xác nhận</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <strong className="text-2xl font-extrabold text-amber-600 dark:text-amber-300">5 đơn</strong>
          <span className="text-[10px] text-amber-600/80 block mt-1">Cần xác nhận trong 5 phút</span>
        </div>

        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-red-700 dark:text-red-400">Sắp quá hạn SLA (15P)</span>
            <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <strong className="text-2xl font-extrabold text-red-600 dark:text-red-300">2 đơn</strong>
          <span className="text-[10px] text-red-600/80 block mt-1">Gần hết thời gian chuẩn bị</span>
        </div>

        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Doanh thu hôm nay</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <strong className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-300">{formatVND(4850000)}</strong>
          <span className="text-[10px] text-emerald-600/80 block mt-1">Đã hoàn tất 18 đơn</span>
        </div>
      </div>

    </div>
  );
};
