import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onToast }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  const handleSuccess = (msg: string) => {
    onToast(msg, 'success');
    onClose();
  };

  const handleError = (msg: string) => {
    onToast(msg, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-scaleUp">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-3 text-center font-bold text-sm transition-all border-b-2 ${
              tab === 'login' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400'
            }`}
          >
            Đăng nhập
          </button>

          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-center font-bold text-sm transition-all border-b-2 ${
              tab === 'register' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400'
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onSuccess={handleSuccess} onError={handleError} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onError={handleError} />
        )}
      </div>
    </div>
  );
};
