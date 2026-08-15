'use client';

import React, { useState } from 'react';
import { Link, Sparkles, TrendingUp, Save } from 'lucide-react';

export const ContentAIControl: React.FC = () => {
  const [shopSlug, setShopSlug] = useState<string>('ao-dai-tq-luxury');
  const [syntheticSales, setSyntheticSales] = useState<number>(1280);
  const [aiCount, setAiCount] = useState<number>(5);
  const [noticeMsg, setNoticeMsg] = useState<string>('');

  const handleSaveSlug = () => {
    setNoticeMsg(`Đã cập nhật Link Slug riêng cho Shop: /shop/${shopSlug}`);
    setTimeout(() => setNoticeMsg(''), 3000);
  };

  const handleAdjustSales = () => {
    setNoticeMsg(`Đã cập nhật lượt mua hiển thị ảo: ${syntheticSales} lượt mua`);
    setTimeout(() => setNoticeMsg(''), 3000);
  };

  const handleGenerateAIReviews = () => {
    setNoticeMsg(`Đã kích hoạt AI sinh tự động ${aiCount} đánh giá sản phẩm ảo chất lượng cao!`);
    setTimeout(() => setNoticeMsg(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-purple-500" />
        <span>Kiểm Soát Nội Dung, Link Slug & Sinh Đánh Giá Ảo AI (Super Admin)</span>
      </h2>

      {noticeMsg && <p className="text-emerald-500 font-bold text-xs mb-4">{noticeMsg}</p>}

      <div className="grid sm:grid-cols-3 gap-4 text-xs">
        
        {/* 1. Custom Shop Link Slug */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
            <Link className="w-3.5 h-3.5 text-sky-500" /> 1. Đăng ký Link Slug Shop:
          </label>
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2 py-1.5 rounded-xl border">
            <span className="text-slate-400 font-mono text-[11px]">/shop/</span>
            <input
              type="text"
              value={shopSlug}
              onChange={(e) => setShopSlug(e.target.value)}
              className="bg-transparent font-bold outline-none flex-1"
            />
          </div>
          <button onClick={handleSaveSlug} className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl flex items-center justify-center gap-1">
            <Save className="w-3.5 h-3.5" /> <span>Lưu Link Slug</span>
          </button>
        </div>

        {/* 2. Synthetic Sales Volume Adjuster */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> 2. Điều chỉnh Lượt Mua Ảo:
          </label>
          <input
            type="number"
            value={syntheticSales}
            onChange={(e) => setSyntheticSales(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border rounded-xl font-bold outline-none"
          />
          <button onClick={handleAdjustSales} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1">
            <Save className="w-3.5 h-3.5" /> <span>Lưu Lượt Mua Hiển Thị</span>
          </button>
        </div>

        {/* 3. AI Synthetic Review Generator */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> 3. Sinh Đánh Giá Ảo Bằng AI:
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Số lượng:</span>
            <input
              type="number"
              value={aiCount}
              onChange={(e) => setAiCount(Number(e.target.value))}
              className="w-16 px-2 py-1 bg-white dark:bg-slate-800 border rounded-xl font-bold text-center outline-none"
            />
          </div>
          <button onClick={handleGenerateAIReviews} className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> <span>Kích Hoạt AI Sinh Review</span>
          </button>
        </div>

      </div>

    </div>
  );
};
