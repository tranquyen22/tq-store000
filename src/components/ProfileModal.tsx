import React, { useState, useEffect } from 'react';
import { X, User, Clock, LogOut, Package, Calendar, MapPin, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { profileSchema } from '../lib/validation';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  defaultTab?: 'info' | 'orders';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onToast,
  defaultTab = 'info'
}) => {
  const { user, signOut, updateProfile } = useAuth();
  const { userOrders, loadOrders } = useCart();
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>(defaultTab);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      loadOrders();
    }
  }, [isOpen, defaultTab]);

  if (!isOpen || !user) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod Input Validation & XSS Sanitization
    const validation = profileSchema.safeParse({ fullName, phone, address });
    if (!validation.success) {
      onToast(validation.error.errors[0].message, 'info');
      return;
    }

    const res = await updateProfile(validation.data);
    if (res.success) {
      onToast(res.message, 'success');
    } else {
      onToast(res.message, 'info');
    }
  };

  const handleLogout = async () => {
    await signOut();
    onToast('Đã đăng xuất tài khoản.', 'info');
    onClose();
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

        <div className="grid md:grid-cols-12 gap-8">
          
          {/* Sidebar Menu */}
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-700 pr-0 md:pr-6 flex flex-col">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-500/30">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">{user.fullName}</h3>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>

            <div className="space-y-1 mb-6">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'info'
                    ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Thông tin cá nhân</span>
              </button>

              <button
                onClick={() => { setActiveTab('orders'); loadOrders(); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'orders'
                    ? 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Lịch sử đơn hàng Realtime</span>
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="mt-auto w-full py-2.5 px-4 border border-red-500/30 text-red-500 hover:bg-red-500/10 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất tài khoản</span>
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="md:col-span-8">
            {activeTab === 'info' ? (
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Cập nhật Thông tin cá nhân</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Họ và tên:</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Số điện thoại:</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Email (Cố định):</label>
                      <input
                        type="email"
                        readOnly
                        disabled
                        value={user.email}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-slate-400 opacity-75 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Địa chỉ giao hàng mặc định:</label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Nhập địa chỉ giao hàng thường dùng của bạn"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Lưu thay đổi
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">
                  Lịch sử Đơn hàng (Supabase Realtime)
                </h3>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Bạn chưa có đơn hàng nào đã đặt.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {userOrders.map(order => (
                      <div
                        key={order.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/40 space-y-3"
                      >
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
                          <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-sky-500" /> <strong>Địa chỉ giao:</strong> {order.shipping_address}</p>
                          <p className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-sky-500" /> <strong>Thanh toán:</strong> {order.payment_method}</p>
                        </div>

                        {/* Items breakdown */}
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
