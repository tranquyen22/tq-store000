export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'rental' | 'fashion' | 'food_beverage' | 'beauty' | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: number;
  image: string;
  badge?: string;
  description: string;
  specs?: Record<string, string>;
}
