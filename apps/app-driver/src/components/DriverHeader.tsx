'use client';

import React, { useState } from 'react';
import { Car, Power, Filter, Zap } from 'lucide-react';
import { DriverServiceType } from '@tq-platform/types';

export const DriverHeader: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [autoAccept, setAutoAccept] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<DriverServiceType>(DriverServiceType.TAXI_4S);

  const serviceOptions = [
    { type: DriverServiceType.TAXI_4S, label: 'Taxi 4 chỗ' },
    { type: DriverServiceType.TAXI_7S, label: 'Taxi 7 chỗ' },
    { type: DriverServiceType.TAXI_ELECTRIC, label: 'Taxi điện' },
    { type: DriverServiceType.BIKE, label: 'Xe ôm công nghệ' },
    { type: DriverServiceType.DELIVERY, label: 'Giao hàng siêu tốc' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 p-4">
      <div className="max-w-md mx-auto space-y-3">
        
        {/* Driver Status Banner & Online Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <strong className="font-extrabold text-sm text-white block">Tài xế: Nguyễn Văn Hùng</strong>
              <span className="text-[11px] text-slate-400">Biển số: <strong>51H-888.99</strong></span>
            </div>
          </div>

          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all ${
              isOnline ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'ONLINE (Đang nhận)' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Vehicle Filter & Auto Accept Toggle */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value as DriverServiceType)}
              className="bg-transparent font-bold text-slate-200 outline-none cursor-pointer text-xs"
            >
              {serviceOptions.map(opt => (
                <option key={opt.type} value={opt.type} className="bg-slate-800 text-white">{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setAutoAccept(!autoAccept)}
            className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 border ${
              autoAccept ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{autoAccept ? 'Tự động nhận: BẬT' : 'Tự động nhận: TẮT'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
