import React, { useState } from 'react';
import { Mail, Lock, Lightbulb } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { loginSchema } from '../validation';

interface LoginFormProps {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validation = loginSchema.safeParse({ identifier, password });
      if (!validation.success) {
        onError(validation.error.errors[0].message);
        return;
      }

      const res = await signIn(validation.data.identifier, validation.data.password);
      if (res.success) {
        onSuccess(res.message);
      } else {
        onError(res.message);
      }
    } catch (error) {
      console.error('[ERROR][LoginForm.tsx - handleSubmit]:', error);
      onError('Đã xảy ra lỗi không xác định khi đăng nhập');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email hoặc SĐT:</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Email (vd: demo@gmail.com) hoặc SĐT"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white font-bold text-sm rounded-xl hover:shadow-lg transition-all"
      >
        Đăng nhập ngay
      </button>

      <div className="p-3 bg-sky-50 dark:bg-slate-700/40 rounded-xl border border-sky-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <span>Tài khoản mẫu: <strong>demo@gmail.com</strong> / <strong>password123</strong></span>
      </div>
    </form>
  );
};
