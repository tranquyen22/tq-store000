import React, { useState } from 'react';

interface CartVoucherBoxProps {
  onApply: (code: string) => void;
  message: { text: string; type: 'success' | 'error' | '' };
}

export const CartVoucherBox: React.FC<CartVoucherBoxProps> = ({ onApply, message }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    try {
      if (!code.trim()) return;
      onApply(code);
    } catch (error) {
      console.error('[ERROR][CartVoucherBox.tsx - handleApply]:', error);
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Mã giảm giá (Nhập: GIAM10)"
          className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none uppercase font-semibold"
        />
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition-colors"
        >
          Áp dụng
        </button>
      </div>
      {message.text && (
        <p className={`text-[11px] font-bold mt-1.5 ${message.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};
