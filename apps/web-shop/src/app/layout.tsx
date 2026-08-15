import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'TQ Shop Portal - Quản Lý Gian Hàng & Vận Hành Đơn Hàng Realtime',
  description: 'Cổng điều hành dành cho Chủ Shop: Quản lý đơn hàng, dịch vụ cho thuê, kho hàng & Trợ lý AI CSKH.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
