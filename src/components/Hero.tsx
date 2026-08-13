import React from 'react';
import { Sparkles, ShoppingBag, Clock, Utensils, Shirt, Wand2 } from 'lucide-react';

interface HeroProps {
  onSelectCategory: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectCategory }) => {
  return (
    <section className="relative my-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-slate-800 p-8 sm:p-12 shadow-2xl text-white">
        
        {/* Decorative Background Aura */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 font-semibold text-xs mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sàn Thương Mại Đa Ngành TQ Store</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight font-outfit mb-4">
              Mua Sắm & Dịch Vụ <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-pink-500 bg-clip-text text-transparent">
                Hiện Đại - Đa Dạng - Đẳng Cấp
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base mb-8 max-w-lg leading-relaxed">
              Trải nghiệm dịch vụ <strong>Thuê quần áo luxury</strong>, sắm đồ tại <strong>Shop thời trang trend</strong>, đặt <strong>Đồ ăn - Đồ uống giao nhanh 30P</strong> và mỹ phẩm <strong>Làm đẹp chính hãng</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#products-catalog"
                className="px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-sky-500 via-blue-600 to-pink-500 rounded-xl hover:shadow-lg hover:shadow-sky-500/30 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Khám phá ngay</span>
              </a>

              <button
                onClick={() => { onSelectCategory('rental'); document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="px-5 py-3 text-sm font-semibold text-slate-200 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Thuê quần áo ngay</span>
              </button>
            </div>
          </div>

          {/* Quick Category Feature Cards */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <button 
              onClick={() => { onSelectCategory('rental'); document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Thuê quần áo</h4>
              <p className="text-xs text-slate-400 mt-1">Đầm dạ hội, Áo dài, Vest</p>
            </button>

            <button 
              onClick={() => { onSelectCategory('fashion'); document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Shirt className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Shop thời trang</h4>
              <p className="text-xs text-slate-400 mt-1">Đầm lụa, Sơ mi, Sneaker</p>
            </button>

            <button 
              onClick={() => { onSelectCategory('food_beverage'); document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Đồ ăn - Đồ uống</h4>
              <p className="text-xs text-slate-400 mt-1">Trà sữa, Bánh mì bơ tỏi</p>
            </button>

            <button 
              onClick={() => { onSelectCategory('beauty'); document.getElementById('products-catalog')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-left group hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Wand2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white">Làm đẹp</h4>
              <p className="text-xs text-slate-400 mt-1">Serum, Son lì chính hãng</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
