'use client';

import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';

interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const defaultSchedule: DaySchedule[] = [
  { day: 'Thứ Hai', isOpen: true, openTime: '08:00', closeTime: '22:30' },
  { day: 'Thứ Ba', isOpen: true, openTime: '08:00', closeTime: '22:30' },
  { day: 'Thứ Tư', isOpen: true, openTime: '08:00', closeTime: '22:30' },
  { day: 'Thứ Năm', isOpen: true, openTime: '08:00', closeTime: '22:30' },
  { day: 'Thứ Sáu', isOpen: true, openTime: '08:00', closeTime: '23:00' },
  { day: 'Thứ Bảy', isOpen: true, openTime: '08:00', closeTime: '23:00' },
  { day: 'Chủ Nhật', isOpen: true, openTime: '08:00', closeTime: '23:00' }
];

export const StoreHoursConfig: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>(defaultSchedule);

  const toggleDay = (idx: number) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, isOpen: !s.isOpen } : s));
  };

  const handleTimeChange = (idx: number, field: 'openTime' | 'closeTime', val: string) => {
    setSchedule(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <span>Cấu Hình Lịch Mở Cửa Quán Theo Khung Giờ</span>
        </h3>
        <button onClick={() => alert('Đã lưu cấu hình lịch mở cửa thành công!')} className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
          <Save className="w-3.5 h-3.5" /> <span>Lưu lịch mở cửa</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {schedule.map((item, idx) => (
          <div key={idx} className={`p-3.5 rounded-2xl border ${item.isOpen ? 'border-sky-500/30 bg-sky-50/20 dark:bg-sky-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 opacity-60'}`}>
            <div className="flex justify-between items-center mb-2">
              <strong className="text-xs text-slate-900 dark:text-white">{item.day}</strong>
              <input type="checkbox" checked={item.isOpen} onChange={() => toggleDay(idx)} className="w-4 h-4 accent-sky-500 cursor-pointer" />
            </div>

            {item.isOpen ? (
              <div className="flex items-center gap-1.5 text-xs">
                <input type="time" value={item.openTime} onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)} className="w-20 px-2 py-1 rounded-lg border text-center outline-none bg-white dark:bg-slate-800" />
                <span>➔</span>
                <input type="time" value={item.closeTime} onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)} className="w-20 px-2 py-1 rounded-lg border text-center outline-none bg-white dark:bg-slate-800" />
              </div>
            ) : (
              <span className="text-xs text-red-500 font-bold">Nghỉ mở cửa</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
