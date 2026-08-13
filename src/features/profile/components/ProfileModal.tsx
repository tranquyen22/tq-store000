import React, { useState, useEffect } from 'react';
import { X, User, Clock, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';
import { profileSchema } from '@/features/auth/validation';
import { ProfileForm } from './ProfileForm';
import { OrderHistoryList } from './OrderHistoryList';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  defaultTab?: 'info' | 'orders';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onToast, defaultTab = 'info' }) => {
  const { user, signOut, updateProfile } = useAuth();
  const { userOrders, loadOrders } = useCart();
  const [activeTab, setActiveTab] = useState<'info' | 'orders'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      loadOrders();
    }
  }, [isOpen, defaultTab]);

  if (!isOpen || !user) return null;

  const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleUpdate = async (data: { fullName: string; phone: string; address: string }) => {
    try {
      const validation = profileSchema.safeParse(data);
      if (!validation.success) {
        onToast(validation.error.errors[0].message, 'info');
        return;
      }
      const res = await updateProfile(validation.data);
      if (res.success) onToast(res.message, 'success');
      else onToast(res.message, 'info');
    } catch (error) {
      console.error('[ERROR][ProfileModal.tsx - handleUpdate]:', error);
      onToast('Lỗi khi cập nhật hồ sơ', 'info');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onToast('Đã đăng xuất tài khoản.', 'info');
      onClose();
    } catch (error) {
      console.error('[ERROR][ProfileModal.tsx - handleLogout]:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-scaleUp">
        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4 border-r border-slate-200 dark:border-slate-700 pr-0 md:pr-6 flex flex-col">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white truncate">{user.fullName}</h3>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>

            <div className="space-y-1 mb-6">
              <button onClick={() => setActiveTab('info')} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === 'info' ? 'bg-sky-500/10 text-sky-500' : 'text-slate-600 dark:text-slate-400'}`}>
                <User className="w-4 h-4" /><span>Thông tin cá nhân</span>
              </button>
              <button onClick={() => { setActiveTab('orders'); loadOrders(); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs ${activeTab === 'orders' ? 'bg-sky-500/10 text-sky-500' : 'text-slate-600 dark:text-slate-400'}`}>
                <Clock className="w-4 h-4" /><span>Lịch sử đơn hàng Realtime</span>
              </button>
            </div>

            <button onClick={handleLogout} className="mt-auto w-full py-2.5 px-4 border border-red-500/30 text-red-500 font-bold text-xs rounded-xl flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /><span>Đăng xuất</span>
            </button>
          </div>

          <div className="md:col-span-8">
            {activeTab === 'info' ? (
              <ProfileForm user={user} onUpdate={handleUpdate} />
            ) : (
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Lịch sử Đơn hàng (Supabase Realtime)</h3>
                <OrderHistoryList orders={userOrders} formatVND={formatVND} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
