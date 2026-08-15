'use client';

import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Check, X } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface IncomingRideProps {
  id: string;
  pickupAddress: string;
  dropoffAddress: string;
  distanceKm: number;
  netEarnings: number;
  paymentMethod: 'CASH_COD' | 'TQ_PAY_ONLINE';
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingRideModal: React.FC<IncomingRideProps> = ({
  pickupAddress,
  dropoffAddress,
  distanceKm,
  netEarnings,
  paymentMethod,
  onAccept,
  onDecline
}) => {
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    if (countdown <= 0) {
      onDecline();
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown, onDecline]);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 w-full max-w-md shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        {/* Countdown Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 font-black text-sm flex items-center justify-center animate-ping">
              {countdown}
            </div>
            <span className="font-extrabold text-sm text-sky-400">Cuốc Xe Mới Đợi Nhận!</span>
          </div>

          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
            paymentMethod === 'CASH_COD' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            {paymentMethod === 'CASH_COD' ? 'Tiền Mặt (COD)' : 'TQ Pay Online'}
          </span>
        </div>

        {/* Pickup & Dropoff Route */}
        <div className="space-y-3 mb-6 bg-slate-800/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">ĐIỂM ĐÓN KHÁCH:</span>
              <strong className="font-extrabold text-white text-xs">{pickupAddress}</strong>
            </div>
          </div>

          <div className="h-4 border-l-2 border-dashed border-slate-700 ml-1.5" />

          <div className="flex items-start gap-2.5">
            <div className="w-3 h-3 rounded-full bg-red-500 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">ĐIỂM TRẢ KHÁCH:</span>
              <strong className="font-extrabold text-white text-xs">{dropoffAddress}</strong>
            </div>
          </div>
        </div>

        {/* Distance & Net Earnings */}
        <div className="flex items-center justify-between bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-6">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">Quãng đường:</span>
            <strong className="text-sm font-extrabold text-white">{distanceKm} km</strong>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold block">Thu nhập thực nhận:</span>
            <strong className="text-lg font-black text-emerald-400">{formatVND(netEarnings)}</strong>
          </div>
        </div>

        {/* Accept & Decline Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onDecline}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-1 border border-slate-700"
          >
            <X className="w-4 h-4" /> <span>Từ chối</span>
          </button>

          <button
            onClick={onAccept}
            className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/30"
          >
            <Check className="w-4 h-4" /> <span>NHẬN CUỐC NGAY</span>
          </button>
        </div>

      </div>
    </div>
  );
};
