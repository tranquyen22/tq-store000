import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ArrowDownCircle, Sparkles, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onToast
}) => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    applyVoucher,
    voucherMessage,
    getTotals
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isOpen) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const { subtotal, shippingFee, discount, total } = getTotals();

  const handleApplyVoucher = () => {
    if (!inputCode.trim()) return;
    applyVoucher(inputCode);
    onToast(`Đã kiểm tra mã voucher: ${inputCode}`, 'info');
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-slideLeft">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-sky-500" />
            <span>Giỏ hàng của bạn ({cartCount})</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Items or 3D Glowing Ring Empty State */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-28 h-28 rounded-full bg-sky-500/10 border-2 border-dashed border-sky-500/30 flex items-center justify-center mb-5 animate-pulseGlow">
                <ArrowDownCircle className="w-12 h-12 text-sky-500" />
                <Sparkles className="w-5 h-5 text-pink-500 absolute top-2 right-3 animate-floatSparkle" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                Giỏ hàng của bạn đang trống
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6 leading-relaxed">
                Hãy khám phá các dịch vụ & sản phẩm đa dạng trên TQ Store với ưu đãi hấp dẫn ngay hôm nay!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Khám phá sản phẩm ngay</span>
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-800/40"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-900"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-extrabold text-sky-600 dark:text-sky-400 mb-2">
                    {formatVND(item.price)}
                  </div>
                  <div className="flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-900 text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2 py-0.5 font-bold hover:bg-sky-500 hover:text-white transition-colors"
                      >-</button>
                      <span className="px-2 py-0.5 font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2 py-0.5 font-bold hover:bg-sky-500 hover:text-white transition-colors"
                      >+</button>
                    </div>

                    <button
                      onClick={() => { removeFromCart(item.id); onToast('Đã xóa món khỏi giỏ!', 'info'); }}
                      className="text-xs text-red-500 hover:text-red-600 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer: Voucher & Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
            
            {/* Voucher Box */}
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder="Mã giảm giá (Nhập: GIAM10)"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none uppercase font-semibold"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Áp dụng
                </button>
              </div>
              {voucherMessage.text && (
                <p className={`text-[11px] font-bold mt-1.5 ${voucherMessage.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {voucherMessage.text}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Giảm giá (Voucher):</span>
                  <span>- {formatVND(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Tổng thanh toán:</span>
                <span className="text-base text-sky-600 dark:text-sky-400">{formatVND(total)}</span>
              </div>
            </div>

            <button
              onClick={() => { onClose(); onOpenCheckout(); }}
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
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
