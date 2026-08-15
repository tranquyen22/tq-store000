'use client';

import React, { useState } from 'react';
import { Package, Power, Plus, Trash2, Edit3 } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  isAvailableToday: boolean;
  toppings: string[];
}

const mockMenu: MenuItem[] = [
  { id: 'M-01', name: 'Trà Sữa Kem Trứng Nướng', price: 45000, isAvailableToday: true, toppings: ['Trân Châu Hoàng Kim (+5k)', 'Thạch Trái Cây (+5k)'] },
  { id: 'M-02', name: 'Váy Cưới Satin Đính Kim Tuyến Luxury', price: 450000, isAvailableToday: false, toppings: ['Kèm Mấn Che Mặt (+0k)', 'Kèm Giày Cưới (+50k)'] },
];

export const InventoryMenu: React.FC = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>(mockMenu);

  const toggleOutOfStockToday = (id: string) => {
    setMenuList(prev => prev.map(m => m.id === id ? { ...m, isAvailableToday: !m.isAvailableToday } : m));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-500" />
          <span>Quản Lý Thực Đơn / Sản Phẩm & Tùy Chọn Đi Kèm</span>
        </h2>
        <button className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow">
          <Plus className="w-3.5 h-3.5" /> <span>Thêm Món Mới</span>
        </button>
      </div>

      <div className="space-y-3">
        {menuList.map(item => (
          <div key={item.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <strong className="font-extrabold text-sm text-slate-900 dark:text-white">{item.name}</strong>
                <span className="font-black text-amber-500">{formatVND(item.price)}</span>
              </div>
              <p className="text-slate-400 text-[11px]">Option đi kèm: {item.toppings.join(', ')}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Quick Toggle "Hết hàng hôm nay" */}
              <button
                onClick={() => toggleOutOfStockToday(item.id)}
                className={`px-3 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center gap-1 transition-all ${
                  item.isAvailableToday ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30' : 'bg-red-500/15 text-red-500 border border-red-500/30'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{item.isAvailableToday ? 'Đang Bán Hôm Nay' : 'HẾT HÀNG HÔM NAY'}</span>
              </button>

              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Edit3 className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
