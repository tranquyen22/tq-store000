import React, { useState, useEffect } from 'react';
import { X, Truck, Wallet, Building2, Banknote } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '../CartContext';
import { checkoutSchema } from '../validation';
import { CheckoutOrderSummary } from './CheckoutOrderSummary';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProfileOrders: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOpenProfileOrders, onToast }) => {
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

  const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const { subtotal, shippingFee, discount, total } = getTotals();

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      const validation = checkoutSchema.safeParse({ customerName, customerPhone, customerEmail, shippingAddress, paymentMethod });
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
        if (user) onOpenProfileOrders();
      } else {
        onToast(res.message, 'info');
      }
    } catch (error) {
      console.error('[ERROR][CheckoutModal.tsx - handleSubmitOrder]:', error);
      setSubmitting(false);
      onToast('Có lỗi xảy ra khi tạo đơn hàng', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-scaleUp">
        
        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-6 border-b pb-4 border-slate-200 dark:border-slate-700">
          <Truck className="w-6 h-6 text-sky-500" />
          <span>Xác Nhận Đặt Hàng (Supabase Realtime)</span>
        </h2>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">1. Thông tin người nhận</h3>
              <div className="space-y-3">
                <input type="text" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Họ tên người nhận" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="tel" required value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="SĐT nhận hàng" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="Email nhận mã đơn" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
                </div>
                <textarea rows={3} required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Địa chỉ giao hàng chi tiết" className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">2. Phương thức thanh toán</h3>
              <div className="space-y-2">
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer ${paymentMethod === 'COD' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="pm" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1" />
                  <div className="flex items-center gap-3"><Banknote className="w-5 h-5 text-sky-500" /><div><strong className="block text-xs">Thanh toán khi nhận hàng (COD)</strong></div></div>
                </label>
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer ${paymentMethod === 'MoMo' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="pm" value="MoMo" checked={paymentMethod === 'MoMo'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1" />
                  <div className="flex items-center gap-3"><Wallet className="w-5 h-5 text-pink-500" /><div><strong className="block text-xs">Ví MoMo / VNPay QR</strong></div></div>
                </label>
                <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer ${paymentMethod === 'Banking' ? 'border-sky-500 bg-sky-50/50 dark:bg-slate-700/40' : 'border-slate-200 dark:border-slate-700'}`}>
                  <input type="radio" name="pm" value="Banking" checked={paymentMethod === 'Banking'} onChange={(e) => setPaymentMethod(e.target.value)} className="mt-1" />
                  <div className="flex items-center gap-3"><Building2 className="w-5 h-5 text-blue-600" /><div><strong className="block text-xs">Chuyển khoản Ngân hàng</strong></div></div>
                </label>
              </div>
            </div>
          </div>

          <CheckoutOrderSummary cart={cart} subtotal={subtotal} shippingFee={shippingFee} discount={discount} total={total} submitting={submitting} formatVND={formatVND} />
        </form>
      </div>
    </div>
  );
};
