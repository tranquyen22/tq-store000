'use client';

import React from 'react';
import { ShopHeader } from '../components/ShopHeader';
import { ShopDashboard } from '../components/ShopDashboard';
import { OrderManagement } from '../components/OrderManagement';
import { RentalManagement } from '../components/RentalManagement';
import { InventoryMenu } from '../components/InventoryMenu';
import { StoreHoursConfig } from '../components/StoreHoursConfig';
import { AIAssistantFAQ } from '../components/AIAssistantFAQ';

export default function ShopAdminDashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Shop Header with Open/Closed Switch, Branch Switcher & Sound Chime */}
      <ShopHeader shopName="TQ Milk Tea & Luxury Bridal Rental" />

      {/* Main Operational Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Operational SLA Metrics Dashboard */}
        <ShopDashboard />

        {/* Realtime Order State Lifecycle Management */}
        <OrderManagement />

        {/* Specialized Rental Management (Deposit & Pre/Post Condition Notes) */}
        <RentalManagement />

        {/* Menu/Products & "Hết hàng hôm nay" Quick Switcher */}
        <InventoryMenu />

        {/* 7-Day Store Opening Hours Configuration */}
        <StoreHoursConfig />

        {/* AI CSKH Auto-Reply FAQ Knowledge Base */}
        <AIAssistantFAQ />

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 TQ Platform Shop Operational Portal. Clean Architecture & Modular Monorepo.</p>
      </footer>

    </div>
  );
}
