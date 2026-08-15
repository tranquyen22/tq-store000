'use client';

import React from 'react';
import { ProductCard, ProductCardProps } from './ProductCard';
import { Sparkles } from 'lucide-react';

const mockRecommendations: ProductCardProps[] = [
  {
    id: 'P-01',
    title: 'Váy Cưới Dạ Hội Satin Lấp Lánh Đính Kim Tuyến Cao Cấp',
    price: 450000,
    depositPrice: 1000000,
    serviceType: 'RENTAL',
    rating: 4.9,
    reviewsCount: 128,
    distanceKm: 0.8,
    shopName: 'TQ Bridal & Luxury Dress Rental'
  },
  {
    id: 'P-02',
    title: 'Trà Sữa Kem Trứng Nướng Trân Châu Hoàng Kim Extra Topping',
    price: 45000,
    serviceType: 'FOOD',
    rating: 4.8,
    reviewsCount: 350,
    distanceKm: 1.2,
    deliveryTimeMins: 20,
    shopName: 'TQ Milk Tea & Dessert'
  },
  {
    id: 'P-03',
    title: 'Bộ Serum Phục Hồi Tái Tạo Da Chuyên Sâu TQ Beauty Clinic',
    price: 890000,
    serviceType: 'PRODUCT',
    rating: 5.0,
    reviewsCount: 89,
    distanceKm: 2.1,
    shopName: 'TQ Cosmetics & Spa Official'
  },
  {
    id: 'P-04',
    title: 'Áo Dài Cách Tân Thêu Tay Hoa Sen Sang Trọng Thuê Dự Tiệc',
    price: 250000,
    depositPrice: 500000,
    serviceType: 'RENTAL',
    rating: 4.7,
    reviewsCount: 64,
    distanceKm: 1.5,
    shopName: 'Áo Dài TQ Boutique'
  }
];

export const ServiceGrid: React.FC = () => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Gợi Ý Hôm Nay (Được Đề Xuất Theo Khu Vực Định Vị)</span>
        </h2>
        <span className="text-xs text-slate-400 font-medium">Tự động cập nhật mỗi 5 phút</span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mockRecommendations.map(item => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
