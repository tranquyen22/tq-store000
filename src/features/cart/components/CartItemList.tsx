import React from 'react';
import { Trash2, ArrowDownCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartItemListProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCloseDrawer: () => void;
  formatVND: (amount: number) => string;
}

export const CartItemList: React.FC<CartItemListProps> = ({
  cart,
  onUpdateQuantity,
  onRemove,
  onCloseDrawer,
  formatVND
}) => {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative w-28 h-28 rounded-full bg-sky-500/10 border-2 border-dashed border-sky-500/30 flex items-center justify-center mb-5 animate-pulseGlow">
          <ArrowDownCircle className="w-12 h-12 text-sky-500" />
          <Sparkles className="w-5 h-5 text-pink-500 absolute top-2 right-3 animate-floatSparkle" />
        </div>
        <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">Giỏ hàng của bạn đang trống</h4>
        <p className="text-xs text-slate-500 max-w-xs mb-6">Khám phá dịch vụ & sản phẩm đa dạng trên TQ Store ngay hôm nay!</p>
        <button
          onClick={onCloseDrawer}
          className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Khám phá sản phẩm ngay</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cart.map(item => (
        <div key={item.id} className="flex gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40">
          <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
          <div className="flex-1">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">{item.name}</h4>
            <div className="text-xs font-extrabold text-sky-600 dark:text-sky-400 mb-2">{formatVND(item.price)}</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden text-xs">
                <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-0.5 font-bold hover:bg-sky-500 hover:text-white">-</button>
                <span className="px-2 py-0.5 font-bold">{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-0.5 font-bold hover:bg-sky-500 hover:text-white">+</button>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-xs text-red-500 font-semibold flex items-center gap-1">
                <Trash2 className="w-3.5 h-3.5" /> Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
