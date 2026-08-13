import React from 'react';
import { Star, ShoppingCart, Eye, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (p: Product) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onToast }) => {
  const { addToCart } = useCart();

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'rental': return 'Thuê quần áo';
      case 'fashion': return 'Shop thời trang';
      case 'food_beverage': return 'Đồ ăn - Đồ uống';
      case 'beauty': return 'Làm đẹp';
      default: return cat;
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    onToast(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
  };

  return (
    <div className="group bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-sky-500/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
      
      {/* Product Image Thumbnail */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative h-52 bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Content Body */}
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 mb-1">
          {getCategoryLabel(product.category)}
        </span>

        <h3 
          onClick={() => onQuickView(product)}
          className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-2 cursor-pointer hover:text-sky-500 transition-colors h-10 leading-snug"
        >
          {product.name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-bold text-slate-700 dark:text-slate-300">{product.rating || 5.0}</span>
          <span className="text-slate-400">({product.reviewsCount || 0})</span>
        </div>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 mt-auto mb-4">
          <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Thêm giỏ hàng</span>
          </button>

          <button
            onClick={() => onQuickView(product)}
            className="p-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
