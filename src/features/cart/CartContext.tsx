import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order } from './types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';

interface CartContextType {
  cart: CartItem[];
  voucherCode: string;
  discountRate: number;
  isFreeShipVoucher: boolean;
  voucherMessage: { text: string; type: 'success' | 'error' | '' };
  addToCart: (product: any, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  applyVoucher: (code: string) => void;
  clearCart: () => void;
  getTotals: () => { subtotal: number; shippingFee: number; discount: number; total: number };
  placeOrder: (info: { customerName: string; customerPhone: string; customerEmail: string; shippingAddress: string; paymentMethod: string }) => Promise<{ success: boolean; message: string; order?: Order }>;
  userOrders: Order[];
  loadOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tq_cart_items');
    if (saved) {
      try { return JSON.parse(saved); }
      catch (error) {
        console.error('[ERROR][CartContext.tsx - parseLocalCart]:', error);
        return [];
      }
    }
    return [];
  });

  const [voucherCode, setVoucherCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [isFreeShipVoucher, setIsFreeShipVoucher] = useState(false);
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    localStorage.setItem('tq_cart_items', JSON.stringify(cart));
  }, [cart]);

  const loadOrders = async () => {
    if (!user) { setUserOrders([]); return; }
    try {
      const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false });
      if (!error && data) {
        setUserOrders(data.map((o: any) => ({ ...o, items: o.order_items || [] })));
      } else {
        if (error) console.error('[ERROR][CartContext.tsx - loadOrdersSupabase]:', error);
        const saved = localStorage.getItem(`tq_orders_${user.id}`);
        if (saved) setUserOrders(JSON.parse(saved));
      }
    } catch (error) {
      console.error('[ERROR][CartContext.tsx - loadOrdersCatch]:', error);
      const saved = localStorage.getItem(`tq_orders_${user?.id}`);
      if (saved) {
        try { setUserOrders(JSON.parse(saved)); } 
        catch (e) { console.error('[ERROR][CartContext.tsx - parseLocalOrders]:', e); }
      }
    }
  };

  useEffect(() => {
    loadOrders();
    const ordersChannel = supabase.channel('public:orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
      loadOrders();
    }).subscribe();
    return () => { supabase.removeChannel(ordersChannel); };
  }, [user]);

  const addToCart = (product: any, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? (item.quantity + delta > 0 ? { ...item, quantity: item.quantity + delta } : null) : item).filter(Boolean) as CartItem[]);
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(item => item.id !== id));
  const clearCart = () => setCart([]);

  const applyVoucher = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'GIAM10') {
      setVoucherCode(clean); setDiscountRate(0.10); setIsFreeShipVoucher(false);
      setVoucherMessage({ text: '✓ Áp dụng GIAM10 thành công (-10%)!', type: 'success' });
    } else if (clean === 'FREESHIP') {
      setVoucherCode(clean); setIsFreeShipVoucher(true); setDiscountRate(0);
      setVoucherMessage({ text: '✓ Áp dụng FREESHIP thành công (Freeship)!', type: 'success' });
    } else {
      setVoucherMessage({ text: '✕ Mã không hợp lệ. Thử: GIAM10 hoặc FREESHIP', type: 'error' });
    }
  };

  const getTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 1000000 || subtotal === 0 || isFreeShipVoucher ? 0 : 30000;
    const discount = Math.round(subtotal * discountRate);
    return { subtotal, shippingFee, discount, total: Math.max(0, subtotal + shippingFee - discount) };
  };

  const placeOrder = async (info: any) => {
    if (cart.length === 0) return { success: false, message: 'Giỏ hàng đang trống!' };
    const { subtotal, shippingFee, discount, total } = getTotals();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const userId = user ? user.id : 'guest-user';
    const orderPayload = { id: orderId, user_id: userId, customer_name: info.customerName, customer_phone: info.customerPhone, customer_email: info.customerEmail, shipping_address: info.shippingAddress, payment_method: info.paymentMethod, subtotal, shipping_fee: shippingFee, discount, total, status: 'Đang xử lý', created_at: new Date().toISOString() };
    const orderItemsPayload = cart.map(item => ({ order_id: orderId, product_id: item.id, product_name: item.name, price: item.price, quantity: item.quantity, image: item.image }));

    try {
      const { error: orderErr } = await supabase.from('orders').insert([orderPayload]);
      if (orderErr) console.error('[ERROR][CartContext.tsx - insertOrderSupabase]:', orderErr);
      else await supabase.from('order_items').insert(orderItemsPayload);

      const newOrderObj: Order = { ...orderPayload, items: orderItemsPayload };
      const existing = JSON.parse(localStorage.getItem(`tq_orders_${userId}`) || '[]');
      existing.unshift(newOrderObj);
      localStorage.setItem(`tq_orders_${userId}`, JSON.stringify(existing));
      setUserOrders(prev => [newOrderObj, ...prev]);
      clearCart();
      return { success: true, message: `Đặt hàng thành công! Mã đơn: ${orderId}`, order: newOrderObj };
    } catch (error) {
      console.error('[ERROR][CartContext.tsx - placeOrderCatch]:', error);
      return { success: false, message: 'Có lỗi xảy ra khi tạo đơn hàng' };
    }
  };

  return (
    <CartContext.Provider value={{ cart, voucherCode, discountRate, isFreeShipVoucher, voucherMessage, addToCart, updateQuantity, removeFromCart, applyVoucher, clearCart, getTotals, placeOrder, userOrders, loadOrders }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
