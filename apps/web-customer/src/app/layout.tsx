import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'TQ Platform - Siêu Ứng Dụng TMĐT, Đặt Xe & Dịch Vụ Đa Ngành',
  description: 'Trải nghiệm Siêu ứng dụng TQ Platform: Thuê đồ, Mua sắm, Đồ ăn 30P, Spa/Beauty & Đặt xe Taxi công nghệ.',
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
