'use client';

import React, { useState } from 'react';
import { ShieldAlert, DollarSign, Ban, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { formatVND } from '@tq-platform/utils';

export interface DisputeTicketItem {
  id: string;
  senderType: 'CUSTOMER' | 'SHOP' | 'DRIVER';
  senderName: string;
  incidentType: 'Giao thiếu món' | 'Hàng bị hỏng' | 'Tài xế không đến' | 'Tính sai cước' | 'Tố cáo hàng giả/hàng cấm';
  description: string;
  evidenceUrl?: string;
  refundAmount: number;
  status: 'PENDING' | 'RESOLVED_REFUNDED' | 'PENALIZED';
}

const mockTickets: DisputeTicketItem[] = [
  {
    id: 'TK-101',
    senderType: 'CUSTOMER',
    senderName: 'Trần Văn Quyền (098*1234**)',
    incidentType: 'Giao thiếu món',
    description: 'Đơn hàng trà sữa thiếu 1 phần Bánh mì nướng trị giá 45.000đ. Đã đính kèm ảnh hóa đơn.',
    refundAmount: 45000,
    status: 'PENDING'
  },
  {
    id: 'TK-102',
    senderType: 'CUSTOMER',
    senderName: 'Lê Thu Hà (091*5678**)',
    incidentType: 'Tố cáo hàng giả/hàng cấm',
    description: 'Shop bán mỹ phẩm có dấu hiệu giả mạo tem nhãn hàng chính hãng.',
    refundAmount: 350000,
    status: 'PENDING'
  }
];

export const DisputeRefundCenter: React.FC = () => {
  const [tickets, setTickets] = useState<DisputeTicketItem[]>(mockTickets);

  const approveRefund = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED_REFUNDED' } : t));
  };

  const applyPenalty = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'PENALIZED' } : t));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm mb-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700 mb-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span>Trung Tâm Xử Lý Khiếu Nại Tranh Chấp & Duyệt Refund Tự Động</span>
        </h2>
        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/30">
          Dispute Resolution Center
        </span>
      </div>

      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 mb-3">
              <div>
                <strong className="font-extrabold text-slate-900 dark:text-white text-sm">{ticket.id}</strong>
                <span className="ml-2 font-bold text-sky-500">[{ticket.senderType}] {ticket.senderName}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-extrabold text-[10px]">
                {ticket.incidentType}
              </span>
            </div>

            <p className="text-slate-700 dark:text-slate-200 font-medium mb-3">{ticket.description}</p>

            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 mb-3">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Số tiền khiếu nại Refund:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black text-sm">{formatVND(ticket.refundAmount)}</strong>
              </div>

              <div className="flex items-center gap-2">
                {ticket.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => approveRefund(ticket.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Duyệt Refund Về Ví TQ Pay</span>
                    </button>

                    <button
                      onClick={() => applyPenalty(ticket.id)}
                      className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Xử Phạt Vi Phạm</span>
                    </button>
                  </>
                )}

                {ticket.status === 'RESOLVED_REFUNDED' && (
                  <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Đã Refund tự động về Ví TQ Pay & Ghi sổ</span>
                )}

                {ticket.status === 'PENALIZED' && (
                  <span className="text-red-500 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-red-500" /> Đã áp dụng chế tài xử phạt vi phạm</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
