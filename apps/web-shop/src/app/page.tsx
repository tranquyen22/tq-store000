'use client';

import React, { useState } from 'react';
import { ShopHeader } from '../components/ShopHeader';
import { ShopDashboard } from '../components/ShopDashboard';
import { OrderManagement } from '../components/OrderManagement';
import { RentalManagement } from '../components/RentalManagement';
import { InventoryMenu } from '../components/InventoryMenu';
import { StoreHoursConfig } from '../components/StoreHoursConfig';
import { AIAssistantFAQ } from '../components/AIAssistantFAQ';
import { Branch } from '../types';

const mockBranches: Branch[] = [
  { id: 'b1', name: 'Chi Nhánh 1 - Quận 1', address: '123 Nguyễn Huệ, Q.1', isOpen: true },
  { id: 'b2', name: 'Chi Nhánh 2 - TP. Thủ Đức', address: '456 Võ Văn Ngân, Thủ Đức', isOpen: true }
];

export default function ShopOwnerPage() {
  const [activeBranchId, setActiveBranchId] = useState('b1');
  const [isReceivingOrders, setIsReceivingOrders] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Header & Branch Selector */}
      <ShopHeader
        branches={mockBranches}
        activeBranchId={activeBranchId}
        onSelectBranch={setActiveBranchId}
        shopName="TQ Luxury Fashion & Beverage"
      />

      {/* Main Dashboard & Operation Modules */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Receiving Orders & SLA Matrix */}
        <ShopDashboard
          isReceivingOrders={isReceivingOrders}
          onToggleReceiving={setIsReceivingOrders}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Processing */}
          <OrderManagement />

          {/* Rental Specialty Workflow */}
          <RentalManagement />
        </div>

        {/* Inventory & Operating Schedule */}
        <div className="grid lg:grid-cols-2 gap-6">
          <InventoryMenu />
          <StoreHoursConfig />
        </div>

        {/* AI FAQ Customer Service Assistant */}
        <AIAssistantFAQ />

      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 TQ Shop Management Portal. All rights reserved.</p>
      </footer>

    </div>
  );
}
