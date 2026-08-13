import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order, OrderItem } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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
  placeOrder: (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => Promise<{ success: boolean; message: string; order?: Order }>;
  userOrders: Order[];
  loadOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tq_cart_items');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  const [voucherCode, setVoucherCode] = useState<string>('');
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [isFreeShipVoucher, setIsFreeShipVoucher] = useState<boolean>(false);
  const [voucherMessage, setVoucherMessage] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    localStorage.setItem('tq_cart_items', JSON.stringify(cart));
  }, [cart]);

  // Load User Orders and subscribe to Supabase Realtime Orders channel
  const loadOrders = async () => {
    if (!user) {
      setUserOrders([]);
      return;
    }

    try {
      // Query orders from Supabase orders table
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const formattedOrders: Order[] = data.map((o: any) => ({
          id: o.id,
          user_id: o.user_id,
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          customer_email: o.customer_email,
          shipping_address: o.shipping_address,
          payment_method: o.payment_method,
          subtotal: o.subtotal,
          shipping_fee: o.shipping_fee,
          discount: o.discount,
          total: o.total,
          status: o.status || 'Đang xử lý',
          created_at: o.created_at,
          items: o.order_items || []
        }));
        setUserOrders(formattedOrders);
      } else {
        // Fallback to local storage saved orders
        const savedOrders = localStorage.getItem(`tq_orders_${user.id}`);
        if (savedOrders) {
          try { setUserOrders(JSON.parse(savedOrders)); } catch (e) { setUserOrders([]); }
        }
      }
    } catch (e) {
      const savedOrders = localStorage.getItem(`tq_orders_${user?.id}`);
      if (savedOrders) {
        try { setUserOrders(JSON.parse(savedOrders)); } catch (e) { setUserOrders([]); }
      }
    }
  };

  useEffect(() => {
    loadOrders();

    // Subscribe to Supabase Realtime changes on 'orders' table
    const ordersChannel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  const addToCart = (product: any, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const applyVoucher = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'GIAM10') {
      setVoucherCode(cleanCode);
      setDiscountRate(0.10);
      setIsFreeShipVoucher(false);
      setVoucherMessage({ text: '✓ Đã áp dụng voucher GIAM10 (Giảm 10% hóa đơn)!', type: 'success' });
    } else if (cleanCode === 'FREESHIP') {
      setVoucherCode(cleanCode);
      setIsFreeShipVoucher(true);
      setDiscountRate(0);
      setVoucherMessage({ text: '✓ Đã áp dụng voucher FREESHIP (Miễn phí vận chuyển)!', type: 'success' });
    } else {
      setVoucherMessage({ text: '✕ Mã giảm giá không hợp lệ. Thử: GIAM10 hoặc FREESHIP', type: 'error' });
    }
  };

  const getTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 1000000 || subtotal === 0 || isFreeShipVoucher ? 0 : 30000;
    const discount = Math.round(subtotal * discountRate);
    const total = Math.max(0, subtotal + shippingFee - discount);

    return { subtotal, shippingFee, discount, total };
  };

  // Place order: Save to Supabase 'orders' and 'order_items' tables
  const placeOrder = async (orderInfo: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, message: 'Giỏ hàng đang trống!' };
    }

    const { subtotal, shippingFee, discount, total } = getTotals();
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const userId = user ? user.id : 'guest-user';

    const orderPayload = {
      id: orderId,
      user_id: userId,
      customer_name: orderInfo.customerName,
      customer_phone: orderInfo.customerPhone,
      customer_email: orderInfo.customerEmail,
      shipping_address: orderInfo.shippingAddress,
      payment_method: orderInfo.paymentMethod,
      subtotal,
      shipping_fee: shippingFee,
      discount,
      total,
      status: 'Đang xử lý',
      created_at: new Date().toISOString()
    };

    const orderItemsPayload = cart.map(item => ({
      order_id: orderId,
      product_id: item.id,
      product_name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    try {
      // 1. Insert into Supabase `orders` table
      const { error: orderErr } = await supabase.from('orders').insert([orderPayload]);

      if (!orderErr) {
        // 2. Insert into Supabase `order_items` table
        await supabase.from('order_items').insert(orderItemsPayload);
      }

      // Local fallback for client persistence
      const newOrderObj: Order = {
        ...orderPayload,
        items: orderItemsPayload.map(i => ({
          product_id: i.product_id,
          product_name: i.product_name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        }))
      };

      const existingOrders = JSON.parse(localStorage.getItem(`tq_orders_${userId}`) || '[]');
      existingOrders.unshift(newOrderObj);
      localStorage.setItem(`tq_orders_${userId}`, JSON.stringify(existingOrders));

      setUserOrders(prev => [newOrderObj, ...prev]);
      clearCart();

      return {
        success: true,
        message: `Đặt hàng thành công! Mã đơn của bạn là: ${orderId}`,
        order: newOrderObj
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Có lỗi xảy ra khi tạo đơn hàng' };
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      voucherCode,
      discountRate,
      isFreeShipVoucher,
      voucherMessage,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyVoucher,
      clearCart,
      getTotals,
      placeOrder,
      userOrders,
      loadOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
