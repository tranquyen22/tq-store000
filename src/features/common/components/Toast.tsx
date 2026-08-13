import React, { useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getBorderColor = () => {
    if (type === 'success') return 'border-l-4 border-l-emerald-500';
    if (type === 'error') return 'border-l-4 border-l-red-500';
    return 'border-l-4 border-l-sky-500';
  };

  const getIcon = () => {
    if (type === 'success') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    if (type === 'error') return <AlertCircle className="w-5 h-5 text-red-500" />;
    return <Info className="w-5 h-5 text-sky-500" />;
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl ${getBorderColor()} animate-slideLeft text-sm font-semibold min-w-[280px]`}>
      {getIcon()}
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
