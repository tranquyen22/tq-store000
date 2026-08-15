'use client';

import React, { useState } from 'react';
import { Users, FileText, Check, Lock } from 'lucide-react';
import { StaffUser, AuditLogItem } from '../types';

const mockStaffList: StaffUser[] = [
  { id: 'ST-01', fullName: 'Đỗ Thị Mai', email: 'mai.do@tqplatform.vn', phone: '0981112223', role: 'STAFF', permissions: ['RESOLVE_DISPUTE', 'UPDATE_PRODUCT'], isActive: true },
  { id: 'ST-02', fullName: 'Hoàng Văn Nam', email: 'nam.hoang@tqplatform.vn', phone: '0913334445', role: 'ADMIN', permissions: ['RESOLVE_DISPUTE', 'UPDATE_PRODUCT', 'MANAGE_WALLET', 'APPROVE_SHOP'], isActive: true }
];

const mockAuditLogs: AuditLogItem[] = [
  { id: 'LOG-901', operatorName: 'Đỗ Thị Mai', operatorRole: 'STAFF', action: 'FINANCIAL_TRANSFER', resource: '/payments/tickets/dispute/resolve-refund', ipAddress: '113.161.45.12', timestamp: '14:35:12 15/08/2026', oldValues: 'Ticket #TK-102 (OPEN)', newValues: 'Refunded 150.000 VND to Customer' },
  { id: 'LOG-902', operatorName: 'Super Admin', operatorRole: 'SUPER_ADMIN', action: 'UPDATE', resource: '/payments/deposit/approve', ipAddress: '14.232.18.90', timestamp: '14:20:00 15/08/2026', oldValues: 'Deposit Pending', newValues: 'Approved +1.000.000 VND to Wallet' }
];

export const StaffAuditLogsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'staff' | 'audit'>('staff');
  const [staffList, setStaffList] = useState<StaffUser[]>(mockStaffList);

  const togglePermission = (staffId: string, perm: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        const hasPerm = s.permissions.includes(perm);
        const newPerms = hasPerm ? s.permissions.filter(p => p !== perm) : [...s.permissions, perm];
        return { ...s, permissions: newPerms };
      }
      return s;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 ${
            activeTab === 'staff' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> <span>Quản Trị Phân Quyền Nhân Viên Granular</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" /> <span>Bảng Nhật Ký Audit Logs Chi Tiết</span>
        </button>
      </div>

      {activeTab === 'staff' ? (
        <div className="space-y-4 text-xs">
          {staffList.map(staff => (
            <div key={staff.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <strong className="text-sm font-extrabold text-slate-900 dark:text-white">{staff.fullName}</strong>
                  <span className="text-slate-400 ml-3">({staff.email}) - Role: <span className="text-sky-500 font-bold">{staff.role}</span></span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 font-bold text-[11px]">Đang hoạt động</span>
              </div>

              <div className="pt-3">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Ma trận cấp / tắt quyền theo module:</span>
                <div className="flex flex-wrap gap-2">
                  {['RESOLVE_DISPUTE', 'UPDATE_PRODUCT', 'MANAGE_WALLET', 'APPROVE_SHOP'].map(perm => {
                    const isGranted = staff.permissions.includes(perm);
                    return (
                      <button
                        key={perm}
                        onClick={() => togglePermission(staff.id, perm)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 border transition-all ${
                          isGranted ? 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-300 dark:border-slate-700'
                        }`}
                      >
                        {isGranted ? <Check className="w-3 h-3 text-sky-500" /> : <Lock className="w-3 h-3" />}
                        <span>{perm}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 text-xs max-h-80 overflow-y-auto pr-1">
          {mockAuditLogs.map(log => (
            <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                <div className="font-bold text-slate-900 dark:text-white">
                  Người thao tác: <span className="text-sky-500">{log.operatorName}</span> ({log.operatorRole})
                </div>
                <span className="text-slate-400 text-[11px]">{log.timestamp} - IP: {log.ipAddress}</span>
              </div>
              <div className="pt-2 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Tác vụ: <span className="text-purple-500 font-bold">{log.action}</span> ➔ Resource: <code className="bg-slate-200 dark:bg-slate-800 px-1 rounded">{log.resource}</code></p>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl text-[11px] border space-y-0.5">
                  <div><strong>Dữ liệu cũ:</strong> {log.oldValues}</div>
                  <div className="text-emerald-600 font-semibold"><strong>Dữ liệu mới:</strong> {log.newValues}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
