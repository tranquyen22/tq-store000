'use client';

import React, { useState } from 'react';
import { Navigation, Car, ShieldAlert, MapPin, Radio, CheckCircle2 } from 'lucide-react';

export interface SOSSignal {
  id: string;
  senderName: string;
  senderRole: 'DRIVER' | 'CUSTOMER';
  locationName: string;
  coordinates: string;
  timestamp: string;
  status: 'PENDING' | 'RESOLVED';
}

const mockSOSList: SOSSignal[] = [
  {
    id: 'SOS-8801',
    senderName: 'Tài xế Nguyễn Văn Hùng',
    senderRole: 'DRIVER',
    locationName: '456 Lê Duẩn, Quận 1, TP.HCM',
    coordinates: '10.7769, 106.7009',
    timestamp: '14:32:05',
    status: 'PENDING'
  }
];

export const LiveMapCenter: React.FC = () => {
  const [sosList, setSosList] = useState<SOSSignal[]>(mockSOSList);

  const resolveSOS = (id: string) => {
    setSosList(prev => prev.map(s => s.id === id ? { ...s, status: 'RESOLVED' } : s));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Radio className="w-5 h-5 text-red-500 animate-pulse" />
          <span>Bản Đồ Điều Hành Live Map & Trung Tâm Tiếp Nhận Cảnh Báo SOS</span>
        </h2>

        <div className="flex items-center gap-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> 128 Tài xế Online
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 border border-sky-500/30 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" /> 42 Cuốc đang chạy
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/30 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> Q.1 Thiếu 8 xe
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Realtime Live Map Canvas */}
        <div className="lg:col-span-7 h-64 rounded-2xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-950 p-4 border border-slate-800 relative overflow-hidden flex flex-col justify-between text-white">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10 flex justify-between items-center text-xs">
            <span className="bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700 font-bold flex items-center gap-1.5 text-sky-400">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-ping" /> PostGIS Spatial Radar Active
            </span>
            <span className="text-slate-400">Cập nhật mỗi 2 giây</span>
          </div>

          <div className="relative z-10 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs">
            <strong className="text-sky-400 block mb-1">Cảnh báo vùng nóng thiếu xe:</strong>
            <p className="text-slate-300">📍 Phố đi bộ Nguyễn Huệ, Q.1 - Nhu cầu gọi xe tăng 180%</p>
          </div>
        </div>

        {/* SOS Alert Panel */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
          <h3 className="font-extrabold text-xs text-red-600 dark:text-red-400 uppercase mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
            <span>Cảnh Báo Khẩn Cấp SOS ({sosList.filter(s => s.status === 'PENDING').length})</span>
          </h3>

          <div className="flex-1 space-y-3 max-h-48 overflow-y-auto pr-1">
            {sosList.map(sos => (
              <div key={sos.id} className={`p-3 rounded-xl border text-xs ${sos.status === 'PENDING' ? 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>{sos.senderName} ({sos.senderRole})</span>
                  <span className="text-[10px]">{sos.timestamp}</span>
                </div>
                <p className="text-[11px] mb-2">Vị trí: <strong>{sos.locationName}</strong> ({sos.coordinates})</p>
                {sos.status === 'PENDING' ? (
                  <button onClick={() => resolveSOS(sos.id)} className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] rounded-xl shadow">
                    XÁC NHẬN ĐÃ XỬ LÝ & BẢO VỆ AN TOÀN
                  </button>
                ) : (
                  <span className="text-emerald-500 font-bold flex items-center gap-1 text-[11px]"><CheckCircle2 className="w-3.5 h-3.5" /> Đã hỗ trợ sự cố</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
