import React from 'react';

export const Button: React.FC<{ label: string; onClick?: () => void; variant?: 'primary' | 'secondary' }> = ({
  label, onClick, variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
        variant === 'primary' ? 'bg-sky-500 text-white hover:bg-sky-600' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
      }`}
    >
      {label}
    </button>
  );
};
