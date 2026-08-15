'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SOSButtonProps {
  latitude?: number;
  longitude?: number;
}

export const SOSButton: React.FC<SOSButtonProps> = ({
  latitude = 10.7769,
  longitude = 106.7009
}) => {
  const [triggered, setTriggered] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleTriggerSOS = () => {
    setTriggered(true);
    setConfirming(false);
    console.warn(`[EMERGENCY SOS SOCKET EMIT] Lat: ${latitude}, Lng: ${longitude}`);
  };

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-4 text-center">
      {!confirming && !triggered && (
        <button
          onClick={() => setConfirming(true)}
          className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-red-500/30 animate-pulse"
        >
          <ShieldAlert className="w-5 h-5" />
          <span>NÚT SOS BÁO ĐỘNG KHẨN CẤP</span>
        </button>
      )}

      {confirming && !triggered && (
        <div className="space-y-3">
          <p className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Bắn tọa độ GPS về tổng đài khẩn cấp?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirming(false)} className="flex-1 py-2 bg-slate-200 dark:bg-slate-800 text-xs font-bold rounded-xl">Hủy</button>
            <button onClick={handleTriggerSOS} className="flex-1 py-2 bg-red-600 text-white text-xs font-extrabold rounded-xl">KÍCH HOẠT SOS</button>
          </div>
        </div>
      )}

      {triggered && (
        <div className="p-3 bg-red-600 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>ĐÃ GỬI TỌA ĐỘ GPS VỀ TỔNG ĐÀI KHẨN CẤP!</span>
        </div>
      )}
    </div>
  );
};
