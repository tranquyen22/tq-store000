'use client';

import React, { useState } from 'react';
import { Clock, Save } from 'lucide-react';

export interface DaySchedule {
  dayName: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export const StoreHoursConfig: React.FC = () => {
  const [schedule, setSchedule] = useState<DaySchedule[]>([
    { dayName: 'Thứ Hai', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { dayName: 'Thứ Ba', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { dayName: 'Thứ Tư', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { dayName: 'Thứ Năm', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { dayName: 'Thứ Sáu', openTime: '08:00', closeTime: '22:00', isOpen: true },
    { dayName: 'Thứ Bảy', openTime: '08:00', closeTime: '23:00', isOpen: true },
    { dayName: 'Chủ Nhật', openTime: '08:00', closeTime: '23:00', isOpen: true },
  ]);

  const [savedMsg, setSavedMsg] = useState('');

  const handleSaveSchedule = () => {
    setSavedMsg('Đã lưu lịch mở cửa 7 ngày trong tuần!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <span>Cấu Hình Giờ Mở Cửa Theo Lịch Các Ngày Trong Tuần</span>
        </h2>
        <button onClick={handleSaveSchedule} className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow">
          <Save className="w-3.5 h-3.5" /> <span>Lưu Lịch Mở Cửa</span>
        </button>
      </div>

      {savedMsg && <p className="text-emerald-500 font-bold text-xs mb-3">{savedMsg}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {schedule.map((day, idx) => (
          <div key={day.dayName} className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white mb-2">
              <span>{day.dayName}</span>
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={(e) => {
                  const updated = [...schedule];
                  updated[idx].isOpen = e.target.checked;
                  setSchedule(updated);
                }}
                className="w-4 h-4 accent-sky-500 cursor-pointer"
              />
            </div>
            {day.isOpen ? (
              <div className="flex items-center gap-1 text-[11px]">
                <input type="text" value={day.openTime} className="w-14 px-1.5 py-1 rounded bg-white dark:bg-slate-800 border text-center font-bold" />
                <span>đến</span>
                <input type="text" value={day.closeTime} className="w-14 px-1.5 py-1 rounded bg-white dark:bg-slate-800 border text-center font-bold" />
              </div>
            ) : (
              <span className="text-red-500 font-bold text-[11px]">Đóng cửa nghỉ</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
