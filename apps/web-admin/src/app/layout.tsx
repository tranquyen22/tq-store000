import React from 'react';
import '@/app/globals.css';

export const metadata = {
  title: 'TQ Super Admin Command Center - Cổng Quản Trị Tối Cao',
  description: 'Trung tâm điều hành tối cao TQ Platform: Giám sát vận hành Live Map, Báo động SOS, Phí sàn & Audit Logs.',
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
