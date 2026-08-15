'use client';

import React from 'react';
import { Power, Car, Bike, PackageCheck, Utensils } from 'lucide-react';
import { DriverServiceType } from '@tq-platform/types';

interface DriverHeaderProps {
  isOnline: boolean;
  onToggleOnline: (status: boolean) => void;
  selectedService: DriverServiceType;
  onSelectService: (service: DriverServiceType) => void;
  driverName: string;
}

export const DriverHeader: React.FC<DriverHeaderProps> = ({
  isOnline,
  onToggleOnline,
  selectedService,
  onSelectService,
  driverName
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 p-4 sticky top-0 z-40">
      <div className="max-w-md mx-auto space-y-3">
        
        {/* Driver Name & Online Toggle Switch */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-extrabold text-base text-white">{driverName}</h1>
            <span className="text-xs text-sky-400 font-semibold">TQ Driver Partner App</span>
          </div>

          <button
            onClick={() => onToggleOnline(!isOnline)}
            className={`px-4 py-2 rounded-full font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              isOnline ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300'
            }`}
          >
            <Power className="w-4 h-4" />
            <span>{isOnline ? 'ĐANG ONLINE' : 'OFFLINE'}</span>
          </button>
        </div>

        {/* Vehicle Service Type Selector */}
        <div className="flex items-center justify-between gap-1 bg-slate-800 p-1 rounded-2xl border border-slate-700 text-[11px] font-bold">
          <button
            onClick={() => onSelectService(DriverServiceType.CAR_TAXI)}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 ${selectedService === DriverServiceType.CAR_TAXI ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
          >
            <Car className="w-3.5 h-3.5" /> Taxi 4-7
          </button>
          <button
            onClick={() => onSelectService(DriverServiceType.BIKE_TAXI)}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 ${selectedService === DriverServiceType.BIKE_TAXI ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
          >
            <Bike className="w-3.5 h-3.5" /> Xe ôm
          </button>
          <button
            onClick={() => onSelectService(DriverServiceType.EXPRESS_DELIVERY)}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 ${selectedService === DriverServiceType.EXPRESS_DELIVERY ? 'bg-sky-500 text-white' : 'text-slate-400'}`}
          >
            <PackageCheck className="w-3.5 h-3.5" /> Giao hàng
          </button>
        </div>

      </div>
    </header>
  );
};
