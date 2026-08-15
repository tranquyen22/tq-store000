import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'TQ Driver Partner App - Siêu Ứng Dụng Đặt Xe & Giao Hàng',
  description: 'Ứng dụng di động dành cho Tài xế đối tác TQ Platform: Nhận cuốc 15s, định vị GPS, SOS & Quản lý ví ký quỹ.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-slate-950 text-slate-100 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
