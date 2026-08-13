import React, { useState, useEffect } from 'react';
import { X, Truck, Check, Wallet, Building2, Banknote } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { checkoutSchema } from '../lib/validation';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileOrders: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOpenProfileOrders,
  onToast
}) => {
  const { user } = useAuth();
  const { cart, getTotals, placeOrder } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomerName(user.fullName || '');
      setCustomerPhone(user.phone || '');
      setCustomerEmail(user.email || '');
      setShippingAddress(user.address || '');
    }
  }, [user]);

  if (!isOpen) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const { subtotal, shippingFee, discount, total } = getTotals();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Zod Input Validation & XSS Sanitization
    const validation = checkoutSchema.safeParse({
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      paymentMethod
    });

    if (!validation.success) {
      onToast(validation.error.errors[0].message, 'info');
      return;
    }

    setSubmitting(true);

    const res = await placeOrder(validation.data);

    setSubmitting(false);

    if (res.success) {
      onToast(res.message, 'success');
      onClose();
      if (user) {
        onOpenProfileOrders();
      }
    } else {
      onToast(res.message, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">
          <Truck className="w-6 h-6 text-sky-500" />
          <span>Xác Nhận Đặt Hàng (Lưu Supabase orders & order_items)</span>
        </h2>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Form: Receiver Info & Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">1. Thông tin người nhận hàng</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Họ tên người nhận (*):</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nhập tên người nhận hàng"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Số điện thoại (*):</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="SĐT nhận hàng"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Email nhận thông báo:</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="Email nhận mã đơn"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Địa chỉ giao hàng chi tiết (*):</label>
                  <textarea
                    rows={3}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">2. Phương thức thanh toán</h3>
              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    <div>
                      <strong className="block text-xs text-slate-900 dark:text-white">Thanh toán khi nhận hàng (COD)</strong>
                      <span className="text-[11px] text-slate-500">Nhận hàng kiểm tra đầy đủ mới thanh toán cho shipper.</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'MoMo' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MoMo"
                    checked={paymentMethod === 'MoMo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <div>
                      <strong className="block text-xs text-slate-900 dark:text-white">Ví MoMo / VNPay QR</strong>
                      <span className="text-[11px] text-slate-500">Quét mã QR tự động bằng MoMo hoặc app ngân hàng.</span>
                    </div>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'Banking' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                }`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Banking"
                    checked={paymentMethod === 'Banking'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 accent-sky-500"
                  />
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <strong className="block text-xs text-slate-900 dark:text-white">Chuyển khoản Ngân hàng (MB / VCB)</strong>
                      <span className="text-[11px] text-slate-500">Hệ thống xử lý tự động qua mã định danh đơn hàng.</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Preview Card */}
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
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-bold text-slate-900 dark:text-white">{shippingFee === 0 ? 'Miễn phí' : formatVND(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-500 font-bold">
                  <span>Giảm giá:</span>
                  <span>- {formatVND(discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Cần thanh toán:</span>
                <span className="text-base text-sky-600 dark:text-sky-400">{formatVND(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <span>Đang tạo đơn hàng...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Xác nhận Đặt hàng</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
