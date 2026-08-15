'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, CheckCircle2, RefreshCw } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

export const GeoFilter: React.FC = () => {
  const { location, requestGPS } = useGeolocation();

  const [selectedProvince, setSelectedProvince] = useState<string>('79'); // TP.HCM
  const [selectedDistrict, setSelectedDistrict] = useState<string>('760'); // Quận 1

  const mockProvinces = [
    { code: '79', name: 'Thành phố Hồ Chí Minh' },
    { code: '01', name: 'Thành phố Hà Nội' },
    { code: '48', name: 'Thành phố Đà Nẵng' }
  ];

  const mockDistricts: Record<string, { code: string; name: string }[]> = {
    '79': [
      { code: '760', name: 'Quận 1' },
      { code: '769', name: 'Quận 2 (TP. Thủ Đức)' },
      { code: '770', name: 'Quận 3' },
      { code: '771', name: 'Quận 7' }
    ],
    '01': [
      { code: '001', name: 'Quận Ba Đình' },
      { code: '002', name: 'Quận Hoàn Kiếm' },
      { code: '003', name: 'Quận Cầu Giấy' }
    ],
    '48': [
      { code: '490', name: 'Quận Hải Châu' },
      { code: '491', name: 'Quận Thanh Khê' }
    ]
  };

  const handleProvinceChange = (provCode: string) => {
    setSelectedProvince(provCode);
    const districts = mockDistricts[provCode] || [];
    if (districts.length > 0) {
      setSelectedDistrict(districts[0].code);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
      
      {/* GPS Status Pill Badge */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
          <MapPin className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white">Vị Trí Định Vị</span>
            {location.status === 'SUCCESS' ? (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> GPS Đã Nhận
              </span>
            ) : (
              <button onClick={requestGPS} className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 text-[10px] font-bold flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Lấy GPS
              </button>
            )}
          </div>
          <span className="text-[11px] text-slate-400">Tự động gợi ý Shop/Tài xế trong bán kính gần bạn nhất</span>
        </div>
      </div>

      {/* Cascading Dropdowns (Tỉnh/Thành -> Quận/Huyện) */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="flex-1 sm:w-52">
          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Tỉnh / Thành phố:</label>
          <select
            value={selectedProvince}
            onChange={(e) => handleProvinceChange(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            {mockProvinces.map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 sm:w-48">
          <label className="block text-[10px] font-bold text-slate-400 mb-0.5">Quận / Huyện:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
          >
            {(mockDistricts[selectedProvince] || []).map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

    </div>
  );
};
