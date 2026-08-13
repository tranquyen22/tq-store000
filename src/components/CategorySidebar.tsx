import React from 'react';
import { SlidersHorizontal, RotateCcw, LayoutGrid, Clock, Shirt, Utensils, Wand2 } from 'lucide-react';
import { Category } from '../types';

interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  onReset: () => void;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  setMaxPrice,
  onReset
}) => {

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'rental': return <Clock className="w-4 h-4" />;
      case 'fashion': return <Shirt className="w-4 h-4" />;
      case 'food_beverage': return <Utensils className="w-4 h-4" />;
      case 'beauty': return <Wand2 className="w-4 h-4" />;
      default: return <LayoutGrid className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-6 shadow-sm sticky top-24">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-sky-500" />
          <span>Bộ lọc sản phẩm</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 flex items-center gap-1 hover:underline transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Category Pills List */}
      <div className="mb-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Danh mục sản phẩm</h4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700/50 hover:text-sky-600'
                }`}
              >
                {getIcon(cat.id)}
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Khoảng giá tối đa</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-sky-100 dark:border-slate-700">
            <span>Đến:</span>
            <span>{formatVND(maxPrice)}</span>
          </div>
          <input
            type="range"
            min="50000"
            max="50000000"
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-sky-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
