import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface ProductGridToolbarProps {
  totalCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const ProductGridToolbar: React.FC<ProductGridToolbarProps> = ({ totalCount, sortBy, onSortChange }) => {
  return (
    <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
      <div className="text-sm text-slate-600 dark:text-slate-300">
        Hiển thị <strong className="text-slate-900 dark:text-white">{totalCount}</strong> sản phẩm
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <ArrowUpDown className="w-4 h-4 text-sky-500" />
        <span>Sắp xếp:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold text-sm cursor-pointer"
        >
          <option value="featured">Nổi bật nhất</option>
          <option value="price-asc">Giá: Thấp đến Cao</option>
          <option value="price-desc">Giá: Cao đến Thấp</option>
          <option value="rating">Đánh giá cao nhất</option>
        </select>
      </div>
    </div>
  );
};
