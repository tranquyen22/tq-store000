import React, { useState, useEffect } from 'react';
import { UserProfile } from '@/features/auth/types';

interface ProfileFormProps {
  user: UserProfile;
  onUpdate: (data: { fullName: string; phone: string; address: string }) => Promise<void>;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({ user, onUpdate }) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onUpdate({ fullName, phone, address });
    } catch (error) {
      console.error('[ERROR][ProfileForm.tsx - handleSubmit]:', error);
    }
  };

  return (
    <div>
      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white mb-4">Cập nhật Thông tin cá nhân</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Họ và tên:</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
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
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
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
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
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
  );
};
