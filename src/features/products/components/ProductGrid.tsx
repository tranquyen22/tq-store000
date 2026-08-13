import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductGridToolbar } from './ProductGridToolbar';
import { ProductGridEmpty } from './ProductGridEmpty';
import { fallbackProducts } from '../seedData';
import { supabase } from '@/lib/supabase';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  maxPrice: number;
  onQuickView: (p: Product) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  onResetFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery, selectedCategory, maxPrice, onQuickView, onToast, onResetFilters
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>('featured');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('[ERROR][ProductGrid.tsx - fetchProductsSupabase]:', error);
        setProducts(fallbackProducts);
      } else if (data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (error) {
      console.error('[ERROR][ProductGrid.tsx - fetchProductsCatch]:', error);
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesPrice = p.price <= maxPrice;
    return matchesSearch && matchesCat && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  return (
    <div className="flex-1">
      <ProductGridToolbar totalCount={filteredProducts.length} sortBy={sortBy} onSortChange={setSortBy} />

      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 text-sm font-semibold">Đang tải sản phẩm từ Supabase Realtime...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <ProductGridEmpty onResetFilters={onResetFilters} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} onQuickView={onQuickView} onToast={onToast} />
          ))}
        </div>
      )}
    </div>
  );
};
