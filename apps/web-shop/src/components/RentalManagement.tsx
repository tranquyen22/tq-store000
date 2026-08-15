'use client';

import React, { useState } from 'react';
import { Shirt, ShieldCheck, Calendar, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface RentalItem {
  id: string;
  customerName: string;
  dressName: string;
  depositAmount: number;
  startDate: string;
  returnDate: string;
  preConditionNote: string;
  postConditionNote?: string;
  status: 'PENDING_DEPOSIT' | 'DEPOSITED' | 'IN_USE' | 'RETURNED_INSPECTED' | 'COMPLETED';
}

const mockRentals: RentalItem[] = [
  {
    id: 'RNT-8801',
    customerName: 'Lê Thị Thu Thảo',
    dressName: 'Váy Cưới Satin Đính Kim Tuyến Luxury Model #V-09',
    depositAmount: 1000000,
    startDate: '15/08/2026',
    returnDate: '18/08/2026',
    preConditionNote: 'Đầm mới 99%, đính đá nguyên vẹn, kèm mấn che mặt',
    status: 'IN_USE'
  }
];

export const RentalManagement: React.FC = () => {
  const [rentals, setRentals] = useState<RentalItem[]>(mockRentals);

  const completeRentalReturn = (id: string) => {
    setRentals(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: 'COMPLETED',
          postConditionNote: 'Đã nhận lại đầm: Tình trạng sặt sạch, không rách vải, hoàn trả đủ 100% tiền cọc 1.000.000 VNĐ'
        };
      }
      return r;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Shirt className="w-5 h-5 text-purple-500" />
          <span>Phân Hệ Vận Hành Cho Thuê Đồ (Quản Lý Tiền Cọc & Tình Trạng Hàng)</span>
        </h2>
        <span className="text-xs text-purple-600 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/30">
          Chuyên biệt Cho thuê
        </span>
      </div>

      <div className="space-y-4">
        {rentals.map(rental => (
          <div key={rental.id} className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/5 dark:bg-purple-950/20 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20 mb-3">
              <div>
                <strong className="font-extrabold text-slate-900 dark:text-white text-sm">{rental.id}</strong>
                <span className="ml-2 font-bold text-slate-700 dark:text-slate-200">- Khách thuê: {rental.customerName}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500 text-white font-extrabold text-[10px]">
                {rental.status}
              </span>
            </div>

            <p className="font-extrabold text-purple-700 dark:text-purple-300 text-xs mb-2">{rental.dressName}</p>

            <div className="grid sm:grid-cols-3 gap-3 mb-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Tiền Cọc Giữ Đồ:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">{formatVND(rental.depositAmount)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1"><Calendar className="w-3 h-3" /> Ngày bắt đầu:</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{rental.startDate}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block flex items-center gap-1"><Calendar className="w-3 h-3" /> Ngày trả đồ:</span>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">{rental.returnDate}</strong>
              </div>
            </div>

            <div className="space-y-1 mb-3">
              <p className="text-slate-600 dark:text-slate-300"><strong>Tình trạng TRƯỚC khi giao:</strong> {rental.preConditionNote}</p>
              {rental.postConditionNote && (
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold"><strong>Tình trạng SAU khi nhận trả:</strong> {rental.postConditionNote}</p>
              )}
            </div>

            {rental.status !== 'COMPLETED' ? (
              <button
                onClick={() => completeRentalReturn(rental.id)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow"
              >
                <ShieldCheck className="w-4 h-4" /> <span>Xác nhận Đồ nguyên vẹn & Hoàn Tiền Cọc 1.000.000 VNĐ</span>
              </button>
            ) : (
              <div className="text-emerald-500 font-bold flex items-center justify-center gap-1 py-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Đã hoàn tất luồng thuê & Hoàn tiền cọc thành công
              </div>
            )}

          </div>
        ))}
      </div>

    </div>
  );
};
