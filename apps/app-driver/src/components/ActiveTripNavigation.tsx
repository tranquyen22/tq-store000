'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, Phone, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { DriverTrip } from '../types';

interface ActiveTripNavigationProps {
  trip: DriverTrip;
  onCompleteTrip: (trip: DriverTrip) => void;
}

export const ActiveTripNavigation: React.FC<ActiveTripNavigationProps> = ({
  trip,
  onCompleteTrip
}) => {
  const [step, setStep] = useState<'ACCEPTED' | 'DRIVER_ARRIVED' | 'IN_PROGRESS'>('ACCEPTED');

  const handleNextStep = () => {
    if (step === 'ACCEPTED') {
      setStep('DRIVER_ARRIVED');
    } else if (step === 'DRIVER_ARRIVED') {
      setStep('IN_PROGRESS');
    } else if (step === 'IN_PROGRESS') {
      onCompleteTrip(trip);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      
      {/* Map View Simulation Header */}
      <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-800 to-sky-950 flex flex-col justify-between p-4 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="flex justify-between items-center relative z-10">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 animate-spin" /> GPS Bán kính Realtime
          </span>
          <span className="font-extrabold text-sm text-emerald-400">{formatVND(trip.netEarnings)}</span>
        </div>

        <div className="relative z-10">
          <span className="text-[11px] text-slate-300 block">Khách hàng:</span>
          <div className="flex items-center justify-between">
            <strong className="text-base font-extrabold text-white">{trip.customerName}</strong>
            <a href={`tel:${trip.customerPhone}`} className="p-2 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-1 text-xs">
              <Phone className="w-3.5 h-3.5" /> Gọi điện
            </a>
          </div>
        </div>
      </div>

      {/* Trip Address Details */}
      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border">
          <Navigation className="w-4 h-4 text-emerald-500 mt-0.5" />
          <div>
            <span className="text-slate-400 font-semibold block">Điểm đón khách:</span>
            <strong className="text-slate-800 dark:text-slate-200">{trip.pickupAddress}</strong>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border">
          <MapPin className="w-4 h-4 text-pink-500 mt-0.5" />
          <div>
            <span className="text-slate-400 font-semibold block">Điểm trả khách:</span>
            <strong className="text-slate-800 dark:text-slate-200">{trip.dropoffAddress}</strong>
          </div>
        </div>
      </div>

      {/* Controller Buttons: Step Progression */}
      <button
        onClick={handleNextStep}
        className="w-full py-3.5 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg"
      >
        {step === 'ACCEPTED' && <><Navigation className="w-4 h-4" /><span>1. XÁC NHẬN "ĐÃ ĐẾN ĐIỂM ĐÓN"</span></>}
        {step === 'DRIVER_ARRIVED' && <><ArrowRight className="w-4 h-4" /><span>2. BẮT ĐẦU CHUYẾN ĐI</span></>}
        {step === 'IN_PROGRESS' && <><CheckCircle2 className="w-5 h-5 text-emerald-300" /><span>3. HOÀN TẤT CHUYẾN ĐI</span></>}
      </button>

    </div>
  );
};
