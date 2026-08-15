'use client';

import React, { useState } from 'react';
import { UserCheck, FileCheck, FileCode, FileSpreadsheet, Check, X } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface KYCItem {
  id: string;
  applicantType: 'SHOP' | 'DRIVER';
  applicantName: string;
  taxCodeOrCitizenID: string;
  bankAccountInfo: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const mockKYCList: KYCItem[] = [
  { id: 'KYC-01', applicantType: 'SHOP', applicantName: 'Áo Dài TQ Boutique', taxCodeOrCitizenID: '036123456789 (CCCD)', bankAccountInfo: 'MBBank - 123456789 (Trần Văn Quyền)', status: 'PENDING' },
  { id: 'KYC-02', applicantType: 'DRIVER', applicantName: 'Tài xế Nguyễn Văn Hùng', taxCodeOrCitizenID: '038987654321 (CCCD)', bankAccountInfo: 'Vietcombank - 987654321 (Nguyễn Văn Hùng)', status: 'PENDING' }
];

export const KYCComplianceTaxExport: React.FC = () => {
  const [kycList, setKycList] = useState<KYCItem[]>(mockKYCList);
  const [exportMsg, setExportMsg] = useState('');

  const processKYC = (id: string, isApproved: boolean) => {
    setKycList(prev => prev.map(k => k.id === id ? { ...k, status: isApproved ? 'APPROVED' : 'REJECTED' } : k));
  };

  const exportTaxXML = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<TaxReport period="2026-Q3" platform="TQ Platform">
  <Seller shopName="Áo Dài TQ Boutique" taxID="036123456789" grossRevenue="150000000" vatWithheld="750000" pitWithheld="750000" bankNo="123456789" />
</TaxReport>`;
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tq_sellers_tax_report_${Date.now()}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportMsg('Đã xuất Báo cáo Thuế người bán định dạng XML chuẩn Tổng cục Thuế!');
    setTimeout(() => setExportMsg(''), 3000);
  };

  const exportTaxExcelCSV = () => {
    let csvContent = 'Tên Shop/Tài xế,MST/CCCD,Tổng Doanh Thu (VND),Thuế GTGT Khấu Trừ,Thuế TNCN Khấu Trừ,STK Ngân Hàng\n';
    csvContent += '"Áo Dài TQ Boutique","036123456789",150000000,750000,750000,"MBBank - 123456789"\n';

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tq_sellers_tax_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportMsg('Đã xuất Báo cáo Thuế người bán định dạng Excel (CSV) chuẩn UTF-8 BOM!');
    setTimeout(() => setExportMsg(''), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-500" />
          <span>Kiểm Duyệt Đối Tác KYC & Xuất Báo Cáo Thuế (XML / Excel)</span>
        </h2>

        {/* Tax Export Buttons */}
        <div className="flex items-center gap-2">
          <button onClick={exportTaxXML} className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow">
            <FileCode className="w-3.5 h-3.5" /> <span>Xuất XML Thuế</span>
          </button>
          <button onClick={exportTaxExcelCSV} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow">
            <FileSpreadsheet className="w-3.5 h-3.5" /> <span>Xuất Excel Thuế</span>
          </button>
        </div>
      </div>

      {exportMsg && <p className="text-emerald-500 font-bold text-xs mb-4">{exportMsg}</p>}

      {/* KYC Onboarding Queue */}
      <div className="space-y-3 text-xs">
        <strong className="block font-extrabold text-slate-900 dark:text-white">Danh sách hồ sơ KYC mới chờ duyệt:</strong>
        {kycList.map(kyc => (
          <div key={kyc.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <strong className="font-extrabold text-slate-900 dark:text-white text-sm">{kyc.applicantName}</strong>
                <span className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-500 font-bold text-[10px]">[{kyc.applicantType}]</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">MST/CCCD: <strong>{kyc.taxCodeOrCitizenID}</strong> | STK: <strong>{kyc.bankAccountInfo}</strong></p>
            </div>

            <div className="flex items-center gap-2">
              {kyc.status === 'PENDING' ? (
                <>
                  <button onClick={() => processKYC(kyc.id, true)} className="px-3.5 py-1.5 bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1">
                    <Check className="w-3 h-3" /> <span>Duyệt KYC</span>
                  </button>
                  <button onClick={() => processKYC(kyc.id, false)} className="px-3.5 py-1.5 bg-red-500 text-white font-bold rounded-xl flex items-center gap-1">
                    <X className="w-3 h-3" /> <span>Từ chối</span>
                  </button>
                </>
              ) : (
                <span className={`font-bold text-[11px] ${kyc.status === 'APPROVED' ? 'text-emerald-500' : 'text-red-500'}`}>
                  {kyc.status === 'APPROVED' ? 'Đã duyệt hồ sơ KYC' : 'Đã từ chối hồ sơ'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
