'use client';

import React from 'react';
import { ShoppingBag, Utensils, Shirt, Car, Sparkles, Home, Ticket, Wallet, Coins, Tag, Store, Headset } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const categories = [
    { id: 1, title: 'Chợ TQ', icon: ShoppingBag, color: 'from-blue-500 to-indigo-500' },
    { id: 2, title: 'Đặt Món 30P', icon: Utensils, color: 'from-amber-500 to-orange-500' },
    { id: 3, title: 'Thuê Trang Phục', icon: Shirt, color: 'from-pink-500 to-rose-500' },
    { id: 4, title: 'Gọi Xe Taxi', icon: Car, color: 'from-emerald-500 to-teal-500' },
    { id: 5, title: 'Spa & Beauty', icon: Sparkles, color: 'from-purple-500 to-violet-500' },
    { id: 6, title: 'Dịch Vụ Tại Nhà', icon: Home, color: 'from-cyan-500 to-blue-500' },
    { id: 7, title: 'Vé & Voucher', icon: Ticket, color: 'from-red-500 to-pink-500' },
    { id: 8, title: 'Ví TQ Pay', icon: Wallet, color: 'from-emerald-600 to-green-600' },
    { id: 9, title: 'Săn TQ Xu', icon: Coins, color: 'from-amber-400 to-yellow-500' },
    { id: 10, title: 'Khuyến Mãi', icon: Tag, color: 'from-orange-500 to-red-500' },
    { id: 11, title: 'Cửa Hàng Gần Bạn', icon: Store, color: 'from-sky-500 to-indigo-500' },
    { id: 12, title: 'Hỗ Trợ CSKH', icon: Headset, color: 'from-slate-600 to-slate-800' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h2 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">Danh Mục Tiện Ích TQ Platform</h2>
      
      {/* 3 rows x 4 columns = 12 utility icons */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          return (
            <div
              key={cat.id}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-sky-50 dark:hover:bg-slate-700/60 border border-slate-100 dark:border-slate-800 cursor-pointer transition-all hover:scale-105 group"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md mb-2 group-hover:rotate-6 transition-transform`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 text-center line-clamp-1">{cat.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
