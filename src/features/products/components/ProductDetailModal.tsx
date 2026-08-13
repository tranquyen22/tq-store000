import React, { useState } from 'react';
import { X, Star, ShoppingCart, Bolt, CheckCircle2 } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '@/features/cart/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCart: () => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product, onClose, onOpenCart, onToast
}) => {
  const [qty, setQty] = useState<number>(1);
  const { addToCart } = useCart();

  if (!product) return null;

  const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const handleAddToCart = () => {
    try {
      addToCart(product, qty);
      onToast(`Đã thêm ${qty} x "${product.name}" vào giỏ!`, 'success');
      onClose();
    } catch (error) {
      console.error('[ERROR][ProductDetailModal.tsx - handleAddToCart]:', error);
      onToast('Có lỗi xảy ra khi thêm vào giỏ hàng', 'info');
    }
  };

  const handleBuyNow = () => {
    try {
      addToCart(product, qty);
      onClose();
      onOpenCart();
    } catch (error) {
      console.error('[ERROR][ProductDetailModal.tsx - handleBuyNow]:', error);
      onToast('Có lỗi xảy ra khi xử lý mua ngay', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-scaleUp">
        <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500 flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 sm:h-96 rounded-2xl bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.badge && <span className="absolute top-4 left-4 bg-gradient-to-r from-sky-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">{product.badge}</span>}
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">{product.name}</h2>
            <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" /><span className="text-slate-800 dark:text-slate-200 font-bold">{product.rating || 5.0}</span><span className="text-slate-400">({product.reviewsCount || 0} đánh giá)</span>
              </div>
              <span className="text-emerald-500 flex items-center gap-1 font-bold"><CheckCircle2 className="w-3.5 h-3.5" /> Còn {product.inStock || 10} món</span>
            </div>

            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-600 dark:text-sky-400">{formatVND(product.price)}</span>
              {product.originalPrice && <span className="text-sm text-slate-400 line-through">{formatVND(product.originalPrice)}</span>}
            </div>

            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">{product.description}</p>

            {product.specs && (
              <div className="mb-6 border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v], idx) => (
                      <tr key={idx} className="border-b last:border-0 border-slate-200 dark:border-slate-700">
                        <td className="p-2.5 font-bold text-slate-500 bg-slate-50 dark:bg-slate-900/50 w-1/3">{k}</td>
                        <td className="p-2.5 font-semibold text-slate-800 dark:text-slate-200">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Số lượng:</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1.5 font-bold hover:bg-sky-500 hover:text-white">-</button>
                <span className="px-4 py-1.5 font-bold text-sm text-slate-900 dark:text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-1.5 font-bold hover:bg-sky-500 hover:text-white">+</button>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button onClick={handleAddToCart} className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /><span>Thêm vào giỏ</span>
              </button>
              <button onClick={handleBuyNow} className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
                <Bolt className="w-4 h-4" /><span>Mua ngay</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
