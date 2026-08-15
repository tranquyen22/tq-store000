'use client';

import React, { useState } from 'react';
import { Shirt, Calendar, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';
import { RentalRecord } from '../types';

const mockRentals: RentalRecord[] = [
  {
    id: 'RNT-101',
    customerName: 'Nguyễn Thị Hoa',
    itemName: 'Váy Dạ Hội Luxury Kim Tuyến Sang Trọng',
    depositAmount: 1000000,
    startDate: '2026-08-20',
    returnDate: '2026-08-23',
    preRentalNotes: 'Đầm mới 99%, đính kim tuyến đầy đủ, giặt hấp thơm tho.',
    postReturnNotes: 'Trả đồ đúng hạn, không rách hỏng, hoàn cọc 100%.',
    status: 'RENTED'
  }
];

export const RentalManagement: React.FC = () => {
  const [rentals, setRentals] = useState<RentalRecord[]>(mockRentals);
  const [postNotesInput, setPostNotesInput] = useState<string>('');

  const handleReturnItem = (id: string) => {
    setRentals(prev => prev.map(r => r.id === id ? {
      ...r,
      status: 'RETURNED',
      postReturnNotes: postNotesInput || 'Đã kiểm tra trả đồ nguyên vẹn.'
    } : r));
    setPostNotesInput('');
  };

  const handleRefundDeposit = (id: string) => {
    setRentals(prev => prev.map(r => r.id === id ? { ...r, status: 'DEPOSIT_REFUNDED' } : r));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Shirt className="w-5 h-5 text-purple-500" />
        <span>Quản Lý Dịch Vụ Cho Thuê & Tiền Cọc</span>
      </h3>

      <div className="space-y-4">
        {rentals.map(record => (
          <div key={record.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-purple-50/20 dark:bg-purple-950/20 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <strong className="text-slate-900 dark:text-white">Mã thuê: <span className="text-purple-600 font-bold">{record.id}</span></strong>
                <span className="ml-3 text-slate-500 font-semibold">Khách: {record.customerName}</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                record.status === 'RENTED' ? 'bg-amber-500/15 text-amber-600' : record.status === 'RETURNED' ? 'bg-blue-500/15 text-blue-600' : 'bg-emerald-500/15 text-emerald-600'
              }`}>
                {record.status === 'RENTED' ? 'Đang cho thuê' : record.status === 'RETURNED' ? 'Đã trả đồ' : 'Đã hoàn cọc'}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <p className="font-bold text-slate-900 dark:text-white">Trang phục: {record.itemName}</p>
              <div className="flex flex-wrap items-center gap-4 text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-purple-500" /> Ngày thuê: <strong>{record.startDate}</strong> ➔ Trả: <strong>{record.returnDate}</strong></span>
                <span className="flex items-center gap-1 font-bold text-purple-600"><ShieldCheck className="w-3.5 h-3.5" /> Tiền cọc: {formatVND(record.depositAmount)}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border text-[11px] mt-2">
                <p><strong>Tình trạng giao trước thuê:</strong> {record.preRentalNotes}</p>
                {record.postReturnNotes && <p className="text-emerald-600 font-semibold mt-1"><strong>Tình trạng sau nhận trả:</strong> {record.postReturnNotes}</p>}
              </div>
            </div>

            {/* Return & Deposit Refund Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              {record.status === 'RENTED' && (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={postNotesInput}
                    onChange={(e) => setPostNotesInput(e.target.value)}
                    placeholder="Ghi nhận tình trạng khi nhận lại đồ..."
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                  <button onClick={() => handleReturnItem(record.id)} className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5" /> <span>Xác nhận trả đồ</span>
                  </button>
                </div>
              )}

              {record.status === 'RETURNED' && (
                <button onClick={() => handleRefundDeposit(record.id)} className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 ml-auto">
                  <CheckCircle2 className="w-3.5 h-3.5" /> <span>Hoàn tiền cọc cho khách ({formatVND(record.depositAmount)})</span>
                </button>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
