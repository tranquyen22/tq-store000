import React, { useState } from 'react';
import { Navbar } from '@/features/common/components/Navbar';
import { Toast } from '@/features/common/components/Toast';
import { Hero } from '@/features/products/components/Hero';
import { CategorySidebar } from '@/features/products/components/CategorySidebar';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { ProductDetailModal } from '@/features/products/components/ProductDetailModal';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { CartDrawer } from '@/features/cart/components/CartDrawer';
import { CheckoutModal } from '@/features/cart/components/CheckoutModal';
import { ProfileModal } from '@/features/profile/components/ProfileModal';
import { Category, Product } from '@/features/products/types';

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

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'info' | 'orders'>('info');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'info') => setToast({ message, type });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(50000000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenProfile={() => { setProfileTab('info'); setIsProfileOpen(true); }}
        onResetFilters={handleResetFilters}
      />

      <Hero onSelectCategory={(catId) => setSelectedCategory(catId)} />

      <main id="products-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">
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

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-400">
          <p>&copy; 2026 TQ Store E-Commerce Inc. Feature-Based Architecture + Supabase Realtime.</p>
        </div>
      </footer>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onOpenCart={() => setIsCartOpen(true)} onToast={showToast} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onToast={showToast} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} onOpenCheckout={() => setIsCheckoutOpen(true)} onToast={showToast} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onOpenProfileOrders={() => { setProfileTab('orders'); setIsProfileOpen(true); }} onToast={showToast} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} onToast={showToast} defaultTab={profileTab} />
    </div>
  );
};
