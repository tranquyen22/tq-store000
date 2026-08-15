'use client';

import React, { useState } from 'react';
import { Sliders, ShieldAlert, Save, Check } from 'lucide-react';
import { SystemRatesConfig, MaintenanceConfig } from '../types';

export const SystemConfigMaintenance: React.FC = () => {
  const [rates, setRates] = useState<SystemRatesConfig>({
    platformCommissionRate: 15,
    xuCashbackRate: 2,
    tqPayDiscountRate: 5
  });

  const [maintenance, setMaintenance] = useState<MaintenanceConfig>({
    isGlobalMaintenance: false,
    isVietQrDepositPaused: false,
    isWithdrawalPaused: false,
    isRentalServicePaused: false,
    isTaxiBookingPaused: false
  });

  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveRates = () => {
    setSavedMessage('Đã lưu cấu hình tỷ lệ % phí sàn & ưu đãi thành công!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const toggleMaintenanceItem = (key: keyof MaintenanceConfig) => {
    setMaintenance(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* 1. Commission & Discount Rates Adjuster */}
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-500" />
            <span>Cấu Hình Tỷ Lệ % Phí Sàn & Ưu Đãi Toàn Hệ Thống</span>
          </h3>

          <div className="space-y-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">% Phí Sàn Mặc Định (% Commission):</label>
              <input type="number" value={rates.platformCommissionRate} onChange={(e) => setRates({ ...rates, platformCommissionRate: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 font-bold outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">% Hoàn TQ Xu:</label>
                <input type="number" value={rates.xuCashbackRate} onChange={(e) => setRates({ ...rates, xuCashbackRate: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 font-bold outline-none" />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">% GIảm giá Ví TQ Pay:</label>
                <input type="number" value={rates.tqPayDiscountRate} onChange={(e) => setRates({ ...rates, tqPayDiscountRate: Number(e.target.value) })} className="w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 font-bold outline-none" />
              </div>
            </div>

            <button onClick={handleSaveRates} className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-1.5">
              <Save className="w-4 h-4" /> <span>Lưu cấu hình tỷ lệ %</span>
            </button>
            {savedMessage && <p className="text-emerald-500 font-bold text-[11px] text-center">{savedMessage}</p>}
          </div>
        </div>

        {/* 2. Granular Maintenance Mode Switcher */}
        <div>
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Chế Độ Bảo Trì Hệ Thống Phân Cấp (Maintenance Mode)</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className={`flex items-center justify-between p-3 rounded-2xl border ${maintenance.isGlobalMaintenance ? 'bg-red-500/10 border-red-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <div>
                <strong className="block text-slate-900 dark:text-white">Bảo trì TOÀN BỘ Hệ thống:</strong>
                <span className="text-[11px] text-slate-400">Khóa truy cập tất cả ứng dụng Web & Mobile</span>
              </div>
              <input type="checkbox" checked={maintenance.isGlobalMaintenance} onChange={() => toggleMaintenanceItem('isGlobalMaintenance')} className="w-5 h-5 accent-red-500 cursor-pointer" />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl border ${maintenance.isVietQrDepositPaused ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <span className="font-bold">Tạm dừng cổng Nạp tiền VietQR</span>
              <input type="checkbox" checked={maintenance.isVietQrDepositPaused} onChange={() => toggleMaintenanceItem('isVietQrDepositPaused')} className="w-4 h-4 accent-amber-500 cursor-pointer" />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl border ${maintenance.isWithdrawalPaused ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <span className="font-bold">Tạm dừng tính năng Rút tiền về Ngân hàng</span>
              <input type="checkbox" checked={maintenance.isWithdrawalPaused} onChange={() => toggleMaintenanceItem('isWithdrawalPaused')} className="w-4 h-4 accent-amber-500 cursor-pointer" />
            </div>

            <div className={`flex items-center justify-between p-3 rounded-2xl border ${maintenance.isRentalServicePaused ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
              <span className="font-bold">Tạm dừng Dịch vụ Cho thuê trang phục</span>
              <input type="checkbox" checked={maintenance.isRentalServicePaused} onChange={() => toggleMaintenanceItem('isRentalServicePaused')} className="w-4 h-4 accent-amber-500 cursor-pointer" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
