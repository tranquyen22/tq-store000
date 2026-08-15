'use client';

import React from 'react';
import { Header } from '../components/Header';
import { GeoFilter } from '../components/GeoFilter';
import { CategoryGrid } from '../components/CategoryGrid';
import { ServiceGrid } from '../components/ServiceGrid';
import { useGeolocation } from '../hooks/useGeolocation';

export default function CustomerHomePage() {
  const { location, updateManualLocation } = useGeolocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Header & Scope Search */}
      <Header
        isLoggedIn={true}
        userName="Nguyễn Văn A"
        walletBalance={1500000}
        xuBalance={250}
        onSearch={(query, scope) => {
          alert(`Tìm kiếm [Scope: ${scope}]: "${query}" tại ${location.districtName}`);
        }}
      />

      {/* Geolocation Filter */}
      <GeoFilter
        location={location}
        onLocationChange={updateManualLocation}
        onRefreshGeo={() => alert(`Đã làm mới gợi ý vị trí ${location.districtName}`)}
      />

      {/* Hero Banner & Categories Grid */}
      <main className="flex-1">
        <CategoryGrid />
        <ServiceGrid location={location} />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-400 mt-12">
        <p>&copy; 2026 TQ Platform Super App. All rights reserved.</p>
      </footer>

    </div>
  );
}
