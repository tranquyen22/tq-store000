'use client';

import React, { useState } from 'react';
import { Navigation, MapPin, CheckCircle2, ArrowRight, PhoneCall } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export const ActiveTripNavigation: React.FC = () => {
  const [tripStep, setTripStep] = useState<'ARRIVED_PICKUP' | 'START_TRIP' | 'COMPLETED'>('ARRIVED_PICKUP');

  const advanceStep = () => {
    if (tripStep === 'ARRIVED_PICKUP') setTripStep('START_TRIP');
    else if (tripStep === 'START_TRIP') setTripStep('COMPLETED');
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 text-white mb-6">
      
      {/* Map View Simulation Canvas */}
      <div className="h-56 rounded-2xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-950 p-4 border border-slate-800 relative overflow-hidden flex flex-col justify-between mb-4">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex justify-between items-center text-xs">
          <span className="bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 font-bold flex items-center gap-1.5 text-sky-400">
            <Navigation className="w-3.5 h-3.5 animate-spin" /> Dẫn Đường Google Maps API
          </span>
          <span className="text-slate-400 font-semibold">Tốc độ: 42 km/h</span>
        </div>

        <div className="relative z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
          <div>
            <strong className="text-white block font-bold">Khách: Trần Văn Quyền</strong>
            <span className="text-slate-400 text-[11px]">SĐT Masked: 098*1234**</span>
          </div>
          <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/40">
            <PhoneCall className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trip Status Controller */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
          <span className="text-slate-400 font-bold">Trạng thái hành trình:</span>
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 font-black text-[11px]">
            {tripStep === 'ARRIVED_PICKUP' && '1/3: Đang đến điểm đón'}
            {tripStep === 'START_TRIP' && '2/3: Đang trong chuyến đi'}
            {tripStep === 'COMPLETED' && '3/3: Đã hoàn thành chuyến'}
          </span>
        </div>

        {tripStep !== 'COMPLETED' ? (
          <button
            onClick={advanceStep}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <span>
              {tripStep === 'ARRIVED_PICKUP' && 'CẬP NHẬT: ĐÃ ĐẾN ĐIỂM ĐÓN KHÁCH'}
              {tripStep === 'START_TRIP' && 'CẬP NHẬT: BẮT ĐẦU CHUYẾN ĐI'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-center text-xs font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ĐÃ HOÀN THÀNH CHUYẾN & CỘNG THU NHẬP VÀO VÍ</span>
          </div>
        )}
      </div>

    </div>
  );
};
