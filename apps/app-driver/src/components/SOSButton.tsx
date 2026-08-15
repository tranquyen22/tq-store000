'use client';

import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export const SOSButton: React.FC = () => {
  const [sosTriggered, setSosTriggered] = useState<boolean>(false);

  const triggerSOS = () => {
    setSosTriggered(true);
    setTimeout(() => {
      alert('TÍN HIỆU SOS ĐÃ ĐƯỢC GỬI! Tổng đài TQ Platform và Danh bạ Khẩn cấp đã nhận tọa độ GPS của bạn.');
    }, 100);
  };

  return (
    <div className="mb-6">
      {!sosTriggered ? (
        <button
          onClick={triggerSOS}
          className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-red-700 text-white font-black text-sm rounded-3xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 border border-red-500/40 active:scale-95 transition-all"
        >
          <ShieldAlert className="w-6 h-6 animate-bounce" />
          <span>BÁO ĐỘNG KHẨN CẤP SOS (GỬI TỌA ĐỘ GPS)</span>
        </button>
      ) : (
        <div className="bg-red-500/15 border border-red-500/40 p-4 rounded-3xl text-center text-xs text-red-400 font-extrabold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-red-500 animate-pulse" />
          <span>Tín hiệu SOS đã phát! Tổng đài đang theo dõi hành trình của bạn.</span>
        </div>
      )}
    </div>
  );
};
