'use client';

import React, { useState } from 'react';
import { Utensils, Plus, Check, X } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { MenuItem } from '../types';

const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Trà Sữa Ô Long Kem Trứng', price: 45000, isOutOfStockToday: false, options: ['Kem trứng nướng +10.000đ', 'Trân châu đen +5.000đ'] },
  { id: '2', name: 'Bánh Mì Bơ Tỏi Phô Mai Pháp', price: 60000, isOutOfStockToday: true, options: ['Thêm phô mai +15.000đ'] },
  { id: '3', name: 'Đầm Lụa Satin Cổ V Dáng Xòe', price: 890000, isOutOfStockToday: false, options: ['Size S', 'Size M', 'Size L'] }
];

export const InventoryMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(mockMenuItems);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const toggleStock = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isOutOfStockToday: !i.isOutOfStockToday } : i));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: newName,
      price: parseFloat(newPrice),
      isOutOfStockToday: false,
      options: ['Tùy chọn mặc định']
    };
    setItems(prev => [...prev, newItem]);
    setNewName('');
    setNewPrice('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Utensils className="w-5 h-5 text-amber-500" />
        <span>Quản Lý Thực Đơn & Kho Hàng Quán</span>
      </h3>

      {/* Add New Item Form */}
      <form onSubmit={handleAddItem} className="flex flex-wrap gap-2 mb-6 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border">
        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Tên món / sản phẩm mới..." className="flex-1 px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-800 outline-none" />
        <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Giá bán (VND)..." className="w-36 px-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-800 outline-none" />
        <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
          <Plus className="w-4 h-4" /> <span>Thêm món mới</span>
        </button>
      </form>

      {/* Item List with Out Of Stock Today Toggle */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                <span>{item.name}</span>
                {item.isOutOfStockToday && <span className="px-2 py-0.5 rounded bg-red-500/15 text-red-500 text-[10px] font-bold">Hết hàng hôm nay</span>}
              </div>
              <div className="text-xs font-extrabold text-sky-600 dark:text-sky-400 mt-0.5">{formatVND(item.price)}</div>
              <div className="text-[11px] text-slate-400 mt-1">Topping / Options: {item.options.join(' | ')}</div>
            </div>

            <button
              onClick={() => toggleStock(item.id)}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                item.isOutOfStockToday ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' : 'bg-red-500/10 text-red-600 border border-red-500/30'
              }`}
            >
              {item.isOutOfStockToday ? <><Check className="w-3.5 h-3.5" /> <span>Mở bán lại</span></> : <><X className="w-3.5 h-3.5" /> <span>Bật "Hết hàng hôm nay"</span></>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
