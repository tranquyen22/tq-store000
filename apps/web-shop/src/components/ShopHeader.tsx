'use client';

import React, { useState } from 'react';
import { Store, BellRing, GitBranch, Power, Volume2 } from 'lucide-react';

interface ShopHeaderProps {
  shopName: string;
}

export const ShopHeader: React.FC<ShopHeaderProps> = ({ shopName }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedBranch, setSelectedBranch] = useState<string>('B-01');

  const branches = [
    { id: 'B-01', name: 'Chi nhánh 1 - Quận 1 (Chính)' },
    { id: 'B-02', name: 'Chi nhánh 2 - Quận 7' },
    { id: 'B-03', name: 'Chi nhánh 3 - Thủ Đức' },
  ];

  const playChimeSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.log('Audio Context not allowed');
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Open/Closed Switch */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-extrabold shadow-md">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white">{shopName}</h1>
            <span className="text-[11px] text-slate-400">Cổng Quản Trị Vận Hành Shop</span>
          </div>
        </div>

        {/* Controls: Branch Switcher & Sound Test & Open Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Branch Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-200 outline-none cursor-pointer"
            >
              {branches.map(b => (
                <option key={b.id} value={b.id} className="bg-slate-800 text-white">{b.name}</option>
              ))}
            </select>
          </div>

          {/* Realtime Audio Chime Test */}
          <button
            onClick={playChimeSound}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-xs font-bold flex items-center gap-1"
            title="Thử âm thanh chuông báo đơn hàng mới"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden md:inline">Thử chuông</span>
          </button>

          {/* Open/Closed Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isOpen ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isOpen ? 'Đang Mở Cửa' : 'Đã Đóng Cửa'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
