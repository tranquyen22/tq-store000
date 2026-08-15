'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { ShopOrder } from '../types';

const mockOrders: ShopOrder[] = [
  {
    id: 'ORD-9821',
    customerName: 'Trần Thị B',
    customerPhone: '0981234567',
    total: 360000,
    status: 'PENDING',
    isOverdue: true,
    createdAt: '14:20 15/08/2026',
    items: [{ name: 'Trà Sữa Ô Long Kem Trứng', quantity: 2, price: 90000 }, { name: 'Bánh Mì Bơ Tỏi Phô Mai', quantity: 1, price: 180000 }]
  },
  {
    id: 'ORD-9822',
    customerName: 'Lê Văn C',
    customerPhone: '0912345678',
    total: 450000,
    status: 'CONFIRMED',
    isOverdue: false,
    createdAt: '14:25 15/08/2026',
    items: [{ name: 'Cho Thuê Váy Dạ Hội Luxury (3 Ngày)', quantity: 1, price: 450000 }]
  }
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<ShopOrder[]>(mockOrders);

  const handleUpdateStatus = (orderId: string, nextStatus: ShopOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus, isOverdue: false } : o));
  };

  const getStatusBadge = (status: ShopOrder['status']) => {
    switch (status) {
      case 'PENDING': return <span className="bg-amber-500/15 text-amber-600 font-bold px-2.5 py-1 rounded-full text-[11px]">Chờ xác nhận</span>;
      case 'CONFIRMED': return <span className="bg-sky-500/15 text-sky-600 font-bold px-2.5 py-1 rounded-full text-[11px]">Đã xác nhận</span>;
      case 'PROCESSING': return <span className="bg-purple-500/15 text-purple-600 font-bold px-2.5 py-1 rounded-full text-[11px]">Đang chuẩn bị</span>;
      case 'SHIPPED': return <span className="bg-blue-500/15 text-blue-600 font-bold px-2.5 py-1 rounded-full text-[11px]">Đang giao hàng</span>;
      case 'DELIVERED': return <span className="bg-emerald-500/15 text-emerald-600 font-bold px-2.5 py-1 rounded-full text-[11px]">Hoàn tất</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <ShoppingBag className="w-5 h-5 text-sky-500" />
        <span>Vận Hành Đơn Hàng Realtime</span>
      </h3>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className={`p-4 rounded-2xl border ${order.isOverdue ? 'border-red-500/40 bg-red-50/30 dark:bg-red-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <strong className="text-slate-900 dark:text-white">Mã đơn: <span className="text-sky-500">{order.id}</span></strong>
                <span className="text-slate-400 ml-3">{order.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                {order.isOverdue && <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Sắp quá hạn</span>}
                {getStatusBadge(order.status)}
              </div>
            </div>

            <div className="py-3 text-xs space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200">Khách hàng: {order.customerName} ({order.customerPhone})</div>
              <div className="text-slate-500">Món: {order.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold">Tổng đơn: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{formatVND(order.total)}</span></span>

              <div className="flex gap-2">
                {order.status === 'PENDING' && (
                  <button onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')} className="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> <span>Xác nhận đơn</span>
                  </button>
                )}
                {order.status === 'CONFIRMED' && (
                  <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')} className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                    <span>Chuẩn bị xong</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
                {order.status === 'PROCESSING' && (
                  <button onClick={() => handleUpdateStatus(order.id, 'SHIPPED')} className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> <span>Giao cho Shipper</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
