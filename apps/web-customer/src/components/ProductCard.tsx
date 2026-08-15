'use client';

import React from 'react';
import { Star, Clock, MapPin, ShieldCheck } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  serviceType: 'RENTAL' | 'FOOD' | 'PRODUCT' | 'TAXI';
  rating: number;
  reviewsCount: number;
  depositPrice?: number;
  distanceKm?: number;
  deliveryTimeMins?: number;
  shopName: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  serviceType,
  rating,
  reviewsCount,
  depositPrice,
  distanceKm = 1.2,
  deliveryTimeMins = 25,
  shopName
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      
      <div>
        {/* Badges based on Service Type */}
        <div className="flex justify-between items-center mb-2">
          {serviceType === 'RENTAL' && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-[10px] font-extrabold">
              Cho thuê trang phục
            </span>
          )}

          {serviceType === 'FOOD' && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-extrabold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> Giao 30P
            </span>
          )}

          {serviceType === 'PRODUCT' && (
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 text-[10px] font-extrabold">
              Sản phẩm chính hãng
            </span>
          )}

          <span className="text-[11px] text-slate-400 font-bold flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-slate-400" /> {distanceKm} km
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 mb-1 group-hover:text-sky-500 transition-colors">
          {title}
        </h3>
        <p className="text-[11px] text-slate-400 font-medium mb-3">{shopName}</p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating}</span>
          <span className="text-slate-400 font-normal">({reviewsCount} đánh giá)</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
        {/* Rental Specific Deposit Display */}
        {serviceType === 'RENTAL' && depositPrice && (
          <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-xl text-[11px] font-semibold text-purple-600 dark:text-purple-400 mb-2 border border-purple-500/20 flex items-center justify-between">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Tiền cọc:</span>
            <strong>{formatVND(depositPrice)}</strong>
          </div>
        )}

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block font-bold">Giá dịch vụ:</span>
            <strong className="text-sm font-black text-sky-500">{formatVND(price)}</strong>
          </div>

          <button className="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow transition-all">
            {serviceType === 'RENTAL' ? 'Thuê ngay' : 'Đặt hàng'}
          </button>
        </div>
      </div>

    </div>
  );
};
