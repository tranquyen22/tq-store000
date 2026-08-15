'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, CheckCircle2, XCircle } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { DriverTrip } from '../types';

interface IncomingRideModalProps {
  trip: DriverTrip | null;
  onAccept: (trip: DriverTrip) => void;
  onDecline: () => void;
}

export const IncomingRideModal: React.FC<IncomingRideModalProps> = ({
  trip,
  onAccept,
  onDecline
}) => {
  const [countdown, setCountdown] = useState<number>(15);

  useEffect(() => {
    if (!trip) return;
    setCountdown(15);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [trip]);

  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl animate-scaleUp text-slate-900 dark:text-white">
        
        {/* Countdown Badge & Net Earnings */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 font-extrabold text-lg flex items-center justify-center border border-amber-500/30 animate-pulse">
            {countdown}s
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold">Thu nhập thực nhận</span>
            <strong className="text-2xl font-extrabold text-emerald-500">{formatVND(trip.netEarnings)}</strong>
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 text-xs mb-6">
          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border">
            <Navigation className="w-4 h-4 text-emerald-500 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block">Đón khách ({trip.distanceKm} km):</span>
              <strong className="text-slate-900 dark:text-white text-sm">{trip.pickupAddress}</strong>
            </div>
          </div>

          <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border">
            <MapPin className="w-4 h-4 text-pink-500 mt-0.5" />
            <div>
              <span className="text-slate-400 font-semibold block">Trả khách:</span>
              <strong className="text-slate-900 dark:text-white text-sm">{trip.dropoffAddress}</strong>
            </div>
          </div>

          <div className="flex justify-between items-center px-1 font-bold text-slate-500">
            <span>Thanh toán: <strong className="text-sky-500">{trip.paymentMethod === 'COD' ? 'Tiền mặt COD' : 'Ví online'}</strong></span>
            <span>Tổng cước: <strong>{formatVND(trip.fareAmount)}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Bỏ qua cuốc</span>
          </button>

          <button
            onClick={() => onAccept(trip)}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>NHẬN CUỐC NGAY</span>
          </button>
        </div>

      </div>
    </div>
  );
};
