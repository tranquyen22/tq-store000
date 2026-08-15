'use client';

import React from 'react';
import { Star, Clock, ShieldCheck, MapPin, Car, ShoppingCart } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { ServiceCardData } from '../types';

interface ProductCardProps {
  item: ServiceCardData;
  onAddToCart?: (item: ServiceCardData) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onAddToCart }) => {
  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden hover:shadow-xl hover:border-sky-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col">
      
      {/* Card Image Banner */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        
        {item.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
            {item.badge}
          </span>
        )}

        {item.distanceKm && (
          <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <MapPin className="w-3 h-3 text-sky-400" /> Cách {item.distanceKm} km
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-2 mb-1.5 h-8 leading-snug group-hover:text-sky-500 transition-colors">
          {item.title}
        </h4>

        {/* Dynamic Service Meta Info */}
        {item.type === 'RENTAL' && item.depositAmount && (
          <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded-md mb-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tiền cọc: <strong>{formatVND(item.depositAmount)}</strong></span>
          </div>
        )}

        {item.type === 'FOOD' && item.deliveryTime && (
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md mb-2 inline-flex items-center gap-1 w-max">
            <Clock className="w-3.5 h-3.5" /> Giao hàng trong {item.deliveryTime}
          </div>
        )}

        {item.type === 'TAXI' && item.vehicleType && (
          <div className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded-md mb-2 inline-flex items-center gap-1 w-max">
            <Car className="w-3.5 h-3.5" /> Dịch vụ: {item.vehicleType}
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">{item.rating}</span>
          <span className="text-slate-400">({item.reviewsCount})</span>
        </div>

        {/* Price & Action Button */}
        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">{formatVND(item.price)}</span>
            {item.originalPrice && <span className="text-[10px] text-slate-400 line-through block">{formatVND(item.originalPrice)}</span>}
          </div>

          <button
            onClick={() => onAddToCart && onAddToCart(item)}
            className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl transition-colors"
            title="Thêm giỏ hàng / Chọn dịch vụ"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
