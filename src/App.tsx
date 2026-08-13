import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySidebar } from './components/CategorySidebar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProfileModal } from './components/ProfileModal';
import { Toast } from './components/Toast';
import { Category, Product } from './types';

const categoriesData: Category[] = [
  { id: "all", name: "Tất cả danh mục", icon: "fa-border-all" },
  { id: "rental", name: "Thuê quần áo", icon: "fa-clock-rotate-left" },
  { id: "fashion", name: "Shop thời trang", icon: "fa-shirt" },
  { id: "food_beverage", name: "Đồ ăn - Đồ uống", icon: "fa-utensils" },
  { id: "beauty", name: "Làm đẹp", icon: "fa-wand-magic-sparkles" }
];

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(50000000);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'orders'>('info');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(50000000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => { setProfileTab('info'); setIsProfileOpen(true); }}
        onResetFilters={handleResetFilters}
      />

      {/* Hero Banner Section */}
      <Hero onSelectCategory={(catId) => setSelectedCategory(catId)} />

      {/* Main Content Catalog */}
      <main id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <CategorySidebar
              categories={categoriesData}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Products Grid Section */}
          <section className="flex-1">
            <ProductGrid
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              maxPrice={maxPrice}
              onQuickView={(p) => setSelectedProduct(p)}
              onToast={showToast}
              onResetFilters={handleResetFilters}
            />
          </section>
        </div>
      </main>

      {/* Site Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <span className="text-xl font-extrabold font-outfit text-slate-900 dark:text-white block mb-3">
                TQ <span className="bg-gradient-to-r from-sky-500 to-pink-500 bg-clip-text text-transparent">Store</span>
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sàn thương mại điện tử mua sắm & dịch vụ hàng đầu Việt Nam. Tích hợp Supabase Realtime Full-Stack.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Về TQ Store</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-sky-500 transition-colors">Giới thiệu công ty</a></li>
                <li><a href="#" className="hover:text-sky-500 transition-colors">Hệ thống đối tác</a></li>
                <li><a href="#" className="hover:text-sky-500 transition-colors">Tuyển dụng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Chính sách</h4>
              <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <li><a href="#" className="hover:text-sky-500 transition-colors">Chính sách bảo hành</a></li>
                <li><a href="#" className="hover:text-sky-500 transition-colors">Giao hàng 2H & 30P</a></li>
                <li><a href="#" className="hover:text-sky-500 transition-colors">Bảo mật thông tin</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Tổng đài hỗ trợ</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Gọi mua hàng: <strong>1900 6868</strong></p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kỹ thuật: <strong>1900 6969</strong></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Email: support@tqstore.vn</p>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            <p>&copy; 2026 TQ Store E-Commerce Inc. Powered by React + Tailwind CSS + Supabase Realtime.</p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenCart={() => setIsCartOpen(true)}
        onToast={showToast}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onToast={showToast}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onToast={showToast}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOpenProfileOrders={() => { setProfileTab('orders'); setIsProfileOpen(true); }}
        onToast={showToast}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onToast={showToast}
        defaultTab={profileTab}
      />
    </div>
  );
};
