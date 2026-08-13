import React, { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { registerSchema } from '../validation';

interface RegisterFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onError }) => {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validation = registerSchema.safeParse({ fullName, email, phone, password });
      if (!validation.success) {
        onError(validation.error.errors[0].message);
        return;
      }

      const res = await signUp(validation.data);
      if (res.success) {
        onSuccess(res.message);
      } else {
        onError(res.message);
      }
    } catch (error) {
      console.error('[ERROR][RegisterForm.tsx - handleSubmit]:', error);
      onError('Đã xảy ra lỗi không xác định khi đăng ký');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Họ và tên:</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nhập họ tên đầy đủ"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Số điện thoại:</label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="SĐT (vd: 0912345678)"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Địa chỉ Email:</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email của bạn"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mật khẩu:</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
      >
        Tạo tài khoản mới
      </button>
    </form>
  );
};
