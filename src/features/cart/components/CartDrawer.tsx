import React from 'react';
import { X, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../CartContext';
import { CartItemList } from './CartItemList';
import { CartVoucherBox } from './CartVoucherBox';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOpenCheckout, onToast }) => {
  const { cart, updateQuantity, removeFromCart, applyVoucher, voucherMessage, getTotals } = useCart();

  if (!isOpen) return null;

  const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const { subtotal, shippingFee, discount, total } = getTotals();

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-slideLeft">
        
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-500" />
            <span>Giỏ hàng ({cartCount})</span>
          </h3>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <CartItemList
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemove={(id) => { removeFromCart(id); onToast('Đã xóa món khỏi giỏ!', 'info'); }}
            onCloseDrawer={onClose}
            formatVND={formatVND}
          />
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            <CartVoucherBox onApply={(code) => { applyVoucher(code); onToast(`Đã kiểm tra voucher: ${code}`, 'info'); }} message={voucherMessage} />

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between"><span>Tạm tính:</span><span className="font-bold text-slate-900 dark:text-white">{formatVND(subtotal)}</span></div>
              <div className="flex justify-between"><span>Vận chuyển:</span><span className="font-bold text-slate-900 dark:text-white">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span></div>
              {discount > 0 && <div className="flex justify-between text-emerald-500 font-bold"><span>Giảm giá:</span><span>- {formatVND(discount)}</span></div>}
              <div className="pt-2 border-t flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Tổng cộng:</span><span className="text-base text-sky-600 dark:text-sky-400">{formatVND(total)}</span>
              </div>
            </div>

            <button
              onClick={() => { onClose(); onOpenCheckout(); }}
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Tiến hành thanh toán</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
