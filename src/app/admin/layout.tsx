import type { Metadata } from 'next';
import '@/app/globals.css';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import { AdminCursor } from '@/components/admin/admin-cursor';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin · Talya Zaltsman',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="bg-cream-100 text-ink antialiased" style={{ fontFamily: 'var(--font-montserrat), system-ui, sans-serif' }}>
        {children}
        <AdminCursor />
      </body>
    </html>
  );
}
