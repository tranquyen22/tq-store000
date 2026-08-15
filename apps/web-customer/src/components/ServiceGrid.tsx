'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ServiceCardData, LocationState } from '../types';

interface ServiceGridProps {
  location: LocationState;
}

const initialMockItems: ServiceCardData[] = [
  {
    id: '1',
    type: 'RENTAL',
    title: 'Cho Thuê Váy Dạ Hội Luxury Kim Tuyến Sang Trọng (Gói 3 Ngày)',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    price: 450000,
    originalPrice: 650000,
    rating: 4.9,
    reviewsCount: 86,
    badge: 'Thuê nhiều nhất',
    depositAmount: 1000000,
    distanceKm: 1.2
  },
  {
    id: '2',
    type: 'FOOD',
    title: 'Set Trà Sữa Ô Long Kem Trứng Nướng Premium (Combo 4 Ly)',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
    price: 180000,
    originalPrice: 240000,
    rating: 4.9,
    reviewsCount: 150,
    badge: 'Giao 30 Phút',
    deliveryTime: '30 Phút',
    distanceKm: 0.8
  },
  {
    id: '3',
    type: 'BEAUTY',
    title: 'Gói Dưỡng Da Mặt & Massage Thảo Dược Căng Bóng Skin (60P)',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    price: 350000,
    originalPrice: 500000,
    rating: 4.8,
    reviewsCount: 64,
    badge: 'Spa Yêu Thích',
    distanceKm: 2.1
  },
  {
    id: '4',
    type: 'FASHION',
    title: 'Đầm Lụa Satin Cổ V Dáng Xòe Sang Trọng TQ Design',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    price: 890000,
    originalPrice: 1200000,
    rating: 4.8,
    reviewsCount: 112,
    badge: 'Bestseller',
    distanceKm: 3.5
  },
  {
    id: '5',
    type: 'TAXI',
    title: 'Đặt Xe Taxi 4 Chỗ Đi Tỉnh / Nội Thành Giá Rẻ TQ Ride',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    price: 12000,
    rating: 4.9,
    reviewsCount: 230,
    badge: 'Đưa đón tận nơi',
    vehicleType: 'Car 4 Chỗ',
    distanceKm: 0.5
  },
  {
    id: '6',
    type: 'RENTAL',
    title: 'Cho Thuê Áo Dài Thêu Tay Cổ Truyền Cao Cấp',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    price: 350000,
    originalPrice: 500000,
    rating: 4.8,
    reviewsCount: 42,
    badge: 'Hot Rental',
    depositAmount: 800000,
    distanceKm: 1.8
  }
];

export const ServiceGrid: React.FC<ServiceGridProps> = ({ location }) => {
  const [items, setItems] = useState<ServiceCardData[]>(initialMockItems);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Reload items when Geo Location changes
    setLoading(true);
    const timer = setTimeout(() => {
      setItems([...initialMockItems]);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [location.districtCode, location.provinceCode]);

  return (
    <section className="my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-extrabold text-xl text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-sky-500" />
          <span>Gợi Ý Hôm Nay Tại {location.districtName}, {location.provinceName}</span>
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">Đang tự động cập nhật gợi ý gần vị trí của bạn...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {items.map(item => (
            <ProductCard key={item.id} item={item} onAddToCart={(i) => alert(`Đã chọn: ${i.title}`)} />
          ))}
        </div>
      )}
    </section>
  );
};
