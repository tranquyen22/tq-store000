'use client';

import React from 'react';
import { Header } from '../components/Header';
import { GeoFilter } from '../components/GeoFilter';
import { CategoryGrid } from '../components/CategoryGrid';
import { ServiceGrid } from '../components/ServiceGrid';

export default function CustomerHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Header with Scope Search Bar & Wallet Badges */}
      <Header
        isLoggedIn={true}
        tqPayBalance={1500000}
        tqXuBalance={3500}
        userName="Trần Văn Quyền"
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* Geolocation Filter & Cascading Dropdowns */}
        <GeoFilter />

        {/* 3x4 Utility Category Matrix (12 Icons) */}
        <CategoryGrid />

        {/* "Gợi Ý Hôm Nay" Recommendations Grid */}
        <ServiceGrid />

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 TQ Platform Customer Web Application. All rights reserved.</p>
      </footer>

    </div>
  );
}
