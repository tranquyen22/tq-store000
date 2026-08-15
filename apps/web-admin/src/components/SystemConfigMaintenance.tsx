'use client';

import React, { useState } from 'react';
import { ShieldAlert, Clock, Save, ToggleLeft, ToggleRight } from 'lucide-react';

export interface MaintenanceFeatureMap {
  isGlobalMaintenance: boolean;
  isTqPayWalletPaused: boolean;
  isVietQrDepositPaused: boolean;
  isCashCodPaused: boolean;
  isXuRewardPaused: boolean;
  isRentalServicePaused: boolean;
  isTaxiBookingPaused: boolean;
}

export const SystemConfigMaintenance: React.FC = () => {
  const [maintenance, setMaintenance] = useState<MaintenanceFeatureMap>({
    isGlobalMaintenance: false,
    isTqPayWalletPaused: false,
    isVietQrDepositPaused: false,
    isCashCodPaused: false,
    isXuRewardPaused: false,
    isRentalServicePaused: false,
    isTaxiBookingPaused: false,
  });

  const [countdownMinutes, setCountdownMinutes] = useState<number>(30);
  const [savedMsg, setSavedMsg] = useState('');

  const toggleFeature = (key: keyof MaintenanceFeatureMap) => {
    setMaintenance(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveMaintenance = () => {
    setSavedMsg(`Đã đặt lịch đếm ngược bảo trì ${countdownMinutes} phút và lưu trạng thái công tắc!`);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span>Cấu Hình Bảo Trì Hệ Thống & Đóng/Mở Riêng Rẽ Từng Tính Năng</span>
        </h2>

        <button onClick={handleSaveMaintenance} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow">
          <Save className="w-4 h-4" /> <span>Lưu Cấu Hình Bảo Trì</span>
        </button>
      </div>

      {savedMsg && <p className="text-emerald-500 font-bold text-xs mb-4">{savedMsg}</p>}

      {/* Countdown Timer Scheduler */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 mb-6 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          <strong className="text-slate-900 dark:text-white">Lịch Đếm Ngược Bảo Trì (Countdown Schedule):</strong>
        </div>
        <div className="flex items-center gap-2">
          <span>Thời gian đếm ngược trước khi kích hoạt (phút):</span>
          <input
            type="number"
            value={countdownMinutes}
            onChange={(e) => setCountdownMinutes(Number(e.target.value))}
            className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded-lg font-bold text-center outline-none"
          />
        </div>
      </div>

      {/* Granular Feature Toggles Matrix */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
        
        {[
          { key: 'isGlobalMaintenance', label: 'Bảo Trì TOÀN BỘ Hệ Thống', desc: 'Khóa toàn bộ truy cập sàn' },
          { key: 'isTqPayWalletPaused', label: 'Tạm Dừng Cổng Ví TQ Pay', desc: 'Ngưng thanh toán qua Ví' },
          { key: 'isVietQrDepositPaused', label: 'Tạm Dừng Nạp Tiền VietQR', desc: 'Khóa sinh mã nạp VietQR' },
          { key: 'isCashCodPaused', label: 'Tạm Dừng Thanh Toán COD', desc: 'Chỉ nhận thanh toán online' },
          { key: 'isXuRewardPaused', label: 'Tạm Dừng Tích Điểm TQ Xu', desc: 'Khóa cộng xu thưởng' },
          { key: 'isRentalServicePaused', label: 'Tạm Dừng Dịch Vụ Cho Thuê Đồ', desc: 'Khóa giỏ hàng cho thuê' },
        ].map(item => {
          const isPaused = maintenance[item.key as keyof MaintenanceFeatureMap];
          return (
            <div key={item.key} className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${isPaused ? 'bg-red-500/10 border-red-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <div>
                <strong className={`block ${isPaused ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}>{item.label}</strong>
                <span className="text-[10px] text-slate-400">{item.desc}</span>
              </div>
              <button onClick={() => toggleFeature(item.key as keyof MaintenanceFeatureMap)} className="text-2xl outline-none">
                {isPaused ? <ToggleRight className="w-7 h-7 text-red-500" /> : <ToggleLeft className="w-7 h-7 text-slate-400" />}
              </button>
            </div>
          );
        })}

      </div>

    </div>
  );
};
