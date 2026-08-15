export type SearchScope = 'ALL' | 'PRODUCTS' | 'SHOPS' | 'RENTAL' | 'TAXI' | 'FOOD' | 'BEAUTY';

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  provinceCode: string;
  provinceName: string;
  districtCode: string;
  districtName: string;
  isGpsActive: boolean;
  statusText: string;
}

export interface ServiceCardData {
  id: string;
  type: 'RENTAL' | 'FASHION' | 'FOOD' | 'BEAUTY' | 'TAXI';
  title: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  depositAmount?: number;      // Cho thuê quần áo (Tiền cọc)
  deliveryTime?: string;       // Đồ ăn (vd: "30 Phút")
  vehicleType?: string;        // Taxi / Xe ôm (vd: "Car 4 chỗ")
  distanceKm?: number;         // Khoảng cách từ vị trí GPS
  address?: string;
}
