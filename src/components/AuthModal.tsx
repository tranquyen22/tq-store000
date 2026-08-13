import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginSchema, registerSchema } from '../lib/validation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onToast }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const { signIn, signUp } = useAuth();

  // Login state
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Input Validation & XSS Sanitization
    const validation = loginSchema.safeParse({ identifier, password: loginPassword });
    if (!validation.success) {
      onToast(validation.error.errors[0].message, 'info');
      return;
    }

    const res = await signIn(validation.data.identifier, validation.data.password);
    if (res.success) {
      onToast(res.message, 'success');
      onClose();
    } else {
      onToast(res.message, 'info');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Zod Input Validation & XSS Sanitization
    const validation = registerSchema.safeParse({ fullName, email, phone, password: regPassword });
    if (!validation.success) {
      onToast(validation.error.errors[0].message, 'info');
      return;
    }

    const res = await signUp(validation.data);
    if (res.success) {
      onToast(res.message, 'success');
      onClose();
    } else {
      onToast(res.message, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center font-bold text-sm transition-all border-b-2 ${
              tab === 'login'
                ? 'border-sky-500 text-sky-500'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center font-bold text-sm transition-all border-b-2 ${
              tab === 'register'
                ? 'border-sky-500 text-sky-500'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email hoặc Số điện thoại:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Nhập email (vd: demo@gmail.com) hoặc SĐT"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold text-sm rounded-xl transition-all"
            >
              Đăng nhập ngay
            </button>

            <div className="p-3 bg-sky-50 dark:bg-slate-700/40 rounded-xl border border-sky-100 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Tài khoản mẫu: <strong>demo@gmail.com</strong> / pass: <strong>password123</strong></span>
            </div>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Họ và tên:
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ tên đầy đủ"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Số điện thoại:
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại (vd: 0912345678)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Địa chỉ Email:
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mật khẩu:
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tạo mật khẩu (tối thiểu 6 ký tự)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 hover:shadow-lg hover:shadow-sky-500/25 text-white font-bold text-sm rounded-xl transition-all"
            >
              Tạo tài khoản mới
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
