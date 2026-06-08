import type { Metadata } from 'next';
import '@/app/globals.css';
import { AdminCursor } from '@/components/admin/admin-cursor';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · Talya Zaltsman',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        {children}
        <AdminCursor />
      </body>
    </html>
  );
}
