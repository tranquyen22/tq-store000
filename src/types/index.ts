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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  payment_method: string;
  items: OrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  status: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}
