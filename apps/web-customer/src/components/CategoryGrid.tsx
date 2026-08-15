'use client';

import React from 'react';
import { Shirt, Utensils, Wand2, Car, Bike, PackageCheck, Ticket, Wallet, Coins, Receipt, ShieldAlert, Sparkles } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const categories = [
    { id: 'rental', label: 'Thuê quần áo', icon: Shirt, color: 'bg-purple-500/10 text-purple-500' },
    { id: 'fashion', label: 'Shop thời trang', icon: Sparkles, color: 'bg-pink-500/10 text-pink-500' },
    { id: 'food', label: 'Đồ ăn 30P', icon: Utensils, color: 'bg-amber-500/10 text-amber-500' },
    { id: 'beauty', label: 'Spa / Làm đẹp', icon: Wand2, color: 'bg-rose-500/10 text-rose-500' },
    { id: 'taxi', label: 'Đặt xe Taxi', icon: Car, color: 'bg-sky-500/10 text-sky-500' },
    { id: 'bike', label: 'Xe ôm công nghệ', icon: Bike, color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 'express', label: 'Giao hàng siêu tốc', icon: PackageCheck, color: 'bg-blue-500/10 text-blue-500' },
    { id: 'voucher', label: 'Mã Voucher', icon: Ticket, color: 'bg-orange-500/10 text-orange-500' },
    { id: 'wallet', label: 'Ví TQ Pay', icon: Wallet, color: 'bg-teal-500/10 text-teal-500' },
    { id: 'xu', label: 'Đổi điểm Xu', icon: Coins, color: 'bg-yellow-500/10 text-yellow-500' },
    { id: 'invoice', label: 'Hóa đơn VAT', icon: Receipt, color: 'bg-indigo-500/10 text-indigo-500' },
    { id: 'sos', label: 'Báo động SOS', icon: ShieldAlert, color: 'bg-red-500/10 text-red-500' }
  ];

  return (
    <section className="my-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500" />
          <span>Danh Mục Tiện Ích TQ Platform</span>
        </h3>

        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="flex flex-col items-center text-center group p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 line-clamp-2 leading-tight">
                  {cat.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
