import React, { useEffect, useState } from 'react';
import { PackageSearch, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { supabase } from '../lib/supabase';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  maxPrice: number;
  onQuickView: (p: Product) => void;
  onToast: (msg: string, type?: 'success' | 'info') => void;
  onResetFilters: () => void;
}

// Fallback seed data in case Supabase table is newly created
const fallbackProducts: Product[] = [
  {
    id: "prod-rental-1",
    name: "Cho Thuê Váy Dạ Hội Luxury Kim Tuyến Sang Trọng (Gói 3 Ngày)",
    category: "rental",
    price: 450000,
    originalPrice: 650000,
    rating: 4.9,
    reviewsCount: 86,
    inStock: 10,
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    badge: "Thuê nhiều nhất",
    description: "Dịch vụ cho thuê đầm dạ hội thiết kế độc quyền đính kim tuyến lấp lánh.",
    specs: { "Thời gian thuê": "3 Ngày", "Size": "S, M, L", "Dịch vụ": "Giặt hấp spa" }
  },
  {
    id: "prod-rental-2",
    name: "Cho Thuê Áo Dài Thêu Tay Cổ Truyền Cao Cấp",
    category: "rental",
    price: 350000,
    originalPrice: 500000,
    rating: 4.8,
    reviewsCount: 42,
    inStock: 15,
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Rental",
    description: "Áo dài truyền thống chất lụa tơ tằm thêu hoa sen tỉ mỉ bằng tay.",
    specs: { "Thời gian thuê": "3 Ngày", "Chất liệu": "Lụa tơ tằm" }
  },
  {
    id: "prod-fashion-1",
    name: "Đầm Lụa Satin Cổ V Dáng Xòe Sang Trọng",
    category: "fashion",
    price: 890000,
    originalPrice: 1200000,
    rating: 4.8,
    reviewsCount: 112,
    inStock: 25,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80",
    badge: "Bestseller",
    description: "Thiết kế váy đầm lụa Satin cao cấp tôn dáng mềm mại, đường may tinh tế.",
    specs: { "Chất liệu": "Lụa Satin", "Form": "Chiết eo dáng xòe" }
  },
  {
    id: "prod-fashion-2",
    name: "Áo Sơ Mi Nam Lụa Ý Cao Cấp Form Slim-Fit",
    category: "fashion",
    price: 550000,
    originalPrice: 750000,
    rating: 4.7,
    reviewsCount: 78,
    inStock: 40,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    badge: "Mới",
    description: "Áo sơ mi nam chống nhăn độc quyền, chất liệu lụa Ý mỏng nhẹ thoáng mát.",
    specs: { "Vải": "Cotton Lụa Ý", "Form": "Slim-Fit" }
  },
  {
    id: "prod-food-1",
    name: "Set Trà Sữa Ô Long Kem Trứng Nướng Premium (Combo 4 Ly)",
    category: "food_beverage",
    price: 180000,
    originalPrice: 240000,
    rating: 4.9,
    reviewsCount: 150,
    inStock: 50,
    image: "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80",
    badge: "Giao 30 Phút",
    description: "Trà sữa Ô long lá trà đậm đà kết hợp với lớp kem trứng nướng cháy thơm béo ngậy.",
    specs: { "Combo": "4 Ly Trà sữa 700ml", "Độ ngọt": "Tùy chọn 30%-100%" }
  },
  {
    id: "prod-food-2",
    name: "Bánh Mì Nướng Bơ Tỏi Phô Mai Pháp Handmade",
    category: "food_beverage",
    price: 120000,
    originalPrice: 150000,
    rating: 4.8,
    reviewsCount: 94,
    inStock: 30,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    badge: "Nóng Hổi",
    description: "Ổ bánh mì nướng bơ tỏi giòn rụm đẫm phô mai Mozzarella tan chảy ngậy béo.",
    specs: { "Set": "2 Ổ bánh mì lớn", "Phô mai": "Mozzarella Pháp" }
  },
  {
    id: "prod-beauty-1",
    name: "Bộ Serum Căng Bóng Dưỡng Trắng Da Hàn Quốc (50ml)",
    category: "beauty",
    price: 790000,
    originalPrice: 1100000,
    rating: 4.9,
    reviewsCount: 135,
    inStock: 20,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    badge: "Chính Hãng",
    description: "Serum chiết xuất Niacinamide 10% & Hyaluronic Acid cấp ẩm sâu, phục hồi da.",
    specs: { "Dung tích": "50ml", "Thành phần": "Niacinamide 10%, HA 2%", "Xuất xứ": "Korea" }
  },
  {
    id: "prod-beauty-2",
    name: "Son Thỏi Hiệu Ứng Lì Mịn Như Nhung Matte Lipstick",
    category: "beauty",
    price: 420000,
    originalPrice: 550000,
    rating: 4.8,
    reviewsCount: 67,
    inStock: 45,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    badge: "Hot Color",
    description: "Son lì mềm môi không gây khô ráp, lên màu chuẩn ngay từ lần quẹt đầu tiên.",
    specs: { "Tông màu": "Đỏ Đất Rạng Rỡ", "Độ bám": "8-10 tiếng" }
  }
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery,
  selectedCategory,
  maxPrice,
  onQuickView,
  onToast,
  onResetFilters
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
      // Query products from Supabase 'products' table
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (e) {
      setProducts(fallbackProducts);
    } finally {
      setLoading(false);
    }
  };

  // Filter products by Search, Category, Price Range, and Sort Order
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
      {/* Toolbar (Count & Sort) */}
      <div className="bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Hiển thị <strong className="text-slate-900 dark:text-white">{filteredProducts.length}</strong> sản phẩm
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ArrowUpDown className="w-4 h-4 text-sky-500" />
          <span>Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-sm cursor-pointer"
          >
            <option value="featured">Nổi bật nhất</option>
            <option value="price-asc">Giá: Thấp đến Cao</option>
            <option value="price-desc">Giá: Cao đến Thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>
      </div>

      {/* Grid or Skeleton or Empty View */}
      {loading ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-slate-500 text-sm font-semibold">Đang tải sản phẩm từ Supabase Realtime...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <PackageSearch className="w-14 h-14 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Không tìm thấy sản phẩm nào</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc để thấy nhiều sản phẩm hơn.</p>
          <button
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-all"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onQuickView={onQuickView}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  );
};
