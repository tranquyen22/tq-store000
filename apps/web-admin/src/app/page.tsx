'use client';

import React from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { LiveMapCenter } from '../components/LiveMapCenter';
import { SystemConfigMaintenance } from '../components/SystemConfigMaintenance';
import { StaffAuditLogsManager } from '../components/StaffAuditLogsManager';

export default function SuperAdminPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      
      {/* Super Admin Header */}
      <AdminHeader
        adminName="Super Admin Trần Văn Quyền"
        isMaintenanceActive={false}
      />

      {/* Main Command Center Modules */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Realtime Live Operations Radar Map & SOS Alert Center */}
        <LiveMapCenter />

        {/* System Rates, Feature Toggles & Granular Maintenance Mode */}
        <SystemConfigMaintenance />

        {/* Staff CRUD, Granular RBAC Permissions & Audit Logs Inspector */}
        <StaffAuditLogsManager />

      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        <p>&copy; 2026 TQ Super Admin Command Center. Clean Architecture & Modular Monorepo.</p>
      </footer>

    </div>
  );
}
