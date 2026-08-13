import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Moon, Sun, X } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useCart } from '@/features/cart/CartContext';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onOpenProfile: () => void;
  onResetFilters: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery, setSearchQuery, onOpenAuth, onOpenCart, onOpenProfile, onResetFilters
}) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const [isDark, setIsDark] = useState<boolean>(() => localStorage.getItem('tq_theme') === 'dark');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('tq_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('tq_theme', 'light');
      }
    } catch (error) {
      console.error('[ERROR][Navbar.tsx - themeEffect]:', error);
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 py-3">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onResetFilters(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 group transition-transform hover:-translate-y-0.5"
          title="TQ Store - Trang chủ"
        >
          <span className="text-2xl font-extrabold tracking-tight font-outfit text-slate-900 dark:text-white">
            TQ <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 bg-clip-text text-transparent">Store</span>
          </span>
        </a>

        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm trên TQ Store (vd: Váy dạ hội, Trà sữa, Serum...)"
            className="w-full pl-11 pr-10 py-2.5 text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-sky-50 transition-all"
            title={isDark ? "Giao diện Sáng" : "Giao diện Tối"}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={onOpenCart}
            className="relative w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all group"
            title="Xem giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button onClick={onOpenProfile} className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate hidden sm:inline">{user.fullName}</span>
            </button>
          ) : (
            <button onClick={onOpenAuth} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 rounded-full hover:shadow-lg transition-all">
              <User className="w-4 h-4" /><span>Đăng nhập</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
