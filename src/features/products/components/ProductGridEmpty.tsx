import React from 'react';
import { PackageSearch } from 'lucide-react';

interface ProductGridEmptyProps {
  onResetFilters: () => void;
}

export const ProductGridEmpty: React.FC<ProductGridEmptyProps> = ({ onResetFilters }) => {
  return (
    <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
      <PackageSearch className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Không tìm thấy sản phẩm nào</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc để thấy nhiều sản phẩm hơn.</p>
      <button
        onClick={onResetFilters}
        className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl"
      >
        Xóa tất cả bộ lọc
      </button>
    </div>
  );
};
