'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, RefreshCw, CheckCircle2 } from 'lucide-react';
import { LocationState } from '../types';

interface GeoFilterProps {
  location: LocationState;
  onLocationChange: (provinceCode: string, provinceName: string, districtCode: string, districtName: string) => void;
  onRefreshGeo: () => void;
}

const mockProvinces = [
  { code: '79', name: 'TP. Hồ Chí Minh' },
  { code: '01', name: 'TP. Hà Nội' },
  { code: '48', name: 'TP. Đà Nẵng' },
  { code: '92', name: 'TP. Cần Thơ' }
];

const mockDistrictsMap: Record<string, Array<{ code: string; name: string }>> = {
  '79': [{ code: '760', name: 'Quận 1' }, { code: '769', name: 'TP. Thủ Đức' }, { code: '770', name: 'Quận 3' }, { code: '778', name: 'Quận 7' }],
  '01': [{ code: '001', name: 'Quận Ba Đình' }, { code: '002', name: 'Quận Hoàn Kiếm' }, { code: '003', name: 'Quận Tây Hồ' }],
  '48': [{ code: '490', name: 'Quận Hải Châu' }, { code: '491', name: 'Quận Thanh Khê' }],
  '92': [{ code: '916', name: 'Quận Ninh Kiều' }, { code: '917', name: 'Quận Bình Thủy' }]
};

export const GeoFilter: React.FC<GeoFilterProps> = ({ location, onLocationChange, onRefreshGeo }) => {
  const [selectedProvince, setSelectedProvince] = useState(location.provinceCode);
  const [selectedDistrict, setSelectedDistrict] = useState(location.districtCode);

  const districts = mockDistrictsMap[selectedProvince] || [];

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provCode = e.target.value;
    const provObj = mockProvinces.find(p => p.code === provCode);
    const newDistricts = mockDistrictsMap[provCode] || [];
    const defaultDist = newDistricts[0] || { code: '', name: '' };

    setSelectedProvince(provCode);
    setSelectedDistrict(defaultDist.code);

    if (provObj) {
      onLocationChange(provCode, provObj.name, defaultDist.code, defaultDist.name);
    }
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distCode = e.target.value;
    const provObj = mockProvinces.find(p => p.code === selectedProvince);
    const distObj = districts.find(d => d.code === distCode);

    setSelectedDistrict(distCode);
    if (provObj && distObj) {
      onLocationChange(selectedProvince, provObj.name, distCode, distObj.name);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* GPS Status Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full font-bold inline-flex items-center gap-1.5 ${
            location.isGpsActive ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30'
          }`}>
            {location.isGpsActive ? <Navigation className="w-3.5 h-3.5 animate-pulse" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>{location.statusText}</span>
          </div>
          <span className="text-slate-400 hidden sm:inline">| Gợi ý theo tọa độ thực tế</span>
        </div>

        {/* Cascading Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 dark:text-slate-300">Khu vực:</span>
          
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-none cursor-pointer"
          >
            {mockProvinces.map(p => (
              <option key={p.code} value={p.code}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={handleDistrictChange}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold outline-none cursor-pointer"
          >
            {districts.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>

          <button
            onClick={onRefreshGeo}
            className="p-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-sky-500 hover:text-white rounded-xl text-slate-600 dark:text-slate-300 transition-all"
            title="Reload gợi ý theo vị trí này"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
