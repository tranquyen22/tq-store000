import React from 'react';
import { Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Order } from '@/features/cart/types';

interface OrderHistoryListProps {
  orders: Order[];
  formatVND: (amount: number) => string;
}

export const OrderHistoryList: React.FC<OrderHistoryListProps> = ({ orders, formatVND }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p className="text-xs">Bạn chưa có đơn hàng nào đã đặt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
      {orders.map(order => (
        <div key={order.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
            <div>
              <strong className="text-slate-900 dark:text-white">Mã đơn: <span className="text-sky-500">{order.id}</span></strong>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{new Date(order.created_at).toLocaleString('vi-VN')}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[11px]">
              {order.status || 'Đang xử lý'}
            </span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-500" /> <strong>Địa chỉ:</strong> {order.shipping_address}</p>
            <p className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-sky-500" /> <strong>Thanh toán:</strong> {order.payment_method}</p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl space-y-2">
            {order.items && order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.product_name} className="w-8 h-8 rounded-md object-cover" />
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.product_name} <strong>x{item.quantity}</strong></span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{formatVND(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs border-t border-slate-200 dark:border-slate-700 pt-2 font-bold">
            <span>Tổng thanh toán:</span>
            <span className="text-sm font-extrabold text-sky-600 dark:text-sky-400">{formatVND(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
