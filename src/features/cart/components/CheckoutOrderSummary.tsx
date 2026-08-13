import React from 'react';
import { Check } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutOrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  submitting: boolean;
  formatVND: (amount: number) => string;
}

export const CheckoutOrderSummary: React.FC<CheckoutOrderSummaryProps> = ({
  cart,
  subtotal,
  shippingFee,
  discount,
  total,
  submitting,
  formatVND
}) => {
  return (
    <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
      <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Đơn hàng của bạn</h3>
      
      <div className="flex-1 max-h-56 overflow-y-auto space-y-2 mb-4 pr-1">
        {cart.map(item => (
          <div key={item.id} className="flex items-center gap-3 text-xs">
            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1 truncate">
              <div className="font-bold truncate text-slate-800 dark:text-slate-200">{item.name}</div>
              <div className="text-slate-400">SL: {item.quantity} x {formatVND(item.price)}</div>
            </div>
            <div className="font-bold text-slate-900 dark:text-white">{formatVND(item.price * item.quantity)}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3 mb-4">
        <div className="flex justify-between"><span>Tạm tính:</span><span className="font-bold text-slate-900 dark:text-white">{formatVND(subtotal)}</span></div>
        <div className="flex justify-between"><span>Vận chuyển:</span><span className="font-bold text-slate-900 dark:text-white">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span></div>
        {discount > 0 && <div className="flex justify-between text-emerald-500 font-bold"><span>Giảm giá:</span><span>- {formatVND(discount)}</span></div>}
        <div className="pt-2 border-t flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
          <span>Cần thanh toán:</span><span className="text-base text-sky-600 dark:text-sky-400">{formatVND(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? <span>Đang tạo đơn...</span> : <><Check className="w-4 h-4" /><span>Xác nhận Đặt hàng</span></>}
      </button>
    </div>
  );
};
