'use client';

import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, Check, Clock } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface OrderItem {
  id: string;
  customerName: string;
  customerPhone: string;
  itemsText: string;
  totalPrice: number;
  status: 'PENDING' | 'PROCESSING' | 'READY' | 'SHIPPED' | 'DELIVERED';
  createdAt: string;
}

const mockOrders: OrderItem[] = [
  { id: 'ORD-9901', customerName: 'Nguyễn Thu Hà', customerPhone: '0981234567', itemsText: '2x Trà Sữa Kem Trứng (Trân Châu Hoàng Kim), 1x Bánh Mì Nướng', totalPrice: 135000, status: 'PENDING', createdAt: '14:30' },
  { id: 'ORD-9902', customerName: 'Phạm Minh Tuấn', customerPhone: '0912345678', itemsText: '1x Cơm Gà Mắm Tỏi, 1x Canh Khổ Qua Thịt Băm', totalPrice: 85000, status: 'PROCESSING', createdAt: '14:22' },
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>(mockOrders);

  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        let nextStatus: OrderItem['status'] = order.status;
        if (order.status === 'PENDING') nextStatus = 'PROCESSING';
        else if (order.status === 'PROCESSING') nextStatus = 'READY';
        else if (order.status === 'READY') nextStatus = 'SHIPPED';
        else if (order.status === 'SHIPPED') nextStatus = 'DELIVERED';
        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'PENDING': return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-extrabold text-[10px]">Chờ xác nhận</span>;
      case 'PROCESSING': return <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-600 font-extrabold text-[10px]">Đang chuẩn bị</span>;
      case 'READY': return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-600 font-extrabold text-[10px]">Đã chuẩn bị xong</span>;
      case 'SHIPPED': return <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 font-extrabold text-[10px]">Đang giao hàng</span>;
      case 'DELIVERED': return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 font-extrabold text-[10px]">Đã hoàn tất</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-sky-500" />
          <span>Vận Hành Đơn Hàng Realtime (Luồng Chuyển Trạng Thái)</span>
        </h2>
        <span className="text-xs text-slate-400 font-medium">Tự động nhận đơn hàng mới</span>
      </div>

      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <strong className="font-extrabold text-slate-900 dark:text-white">{order.id}</strong>
                {getStatusBadge(order.status)}
                <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-slate-400" /> {order.createdAt}
                </span>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1">{order.customerName} ({order.customerPhone})</p>
              <p className="text-slate-500 dark:text-slate-400 line-clamp-1">{order.itemsText}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block">Tổng tiền đơn:</span>
                <strong className="text-sm font-black text-sky-500">{formatVND(order.totalPrice)}</strong>
              </div>

              {order.status !== 'DELIVERED' && (
                <button
                  onClick={() => advanceOrderStatus(order.id)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow transition-all"
                >
                  <span>Chuyển bước tiếp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
