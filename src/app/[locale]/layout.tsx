import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { Cormorant_Garamond, Frank_Ruhl_Libre, Heebo, Playfair_Display, Montserrat } from 'next/font/google';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { I18nProvider } from '@/lib/i18n-context';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/ui/whatsapp-fab';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { BackToTop } from '@/components/ui/back-to-top';
import { SmoothScroll } from '@/components/ui/smooth-scroll';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif',
  display: 'swap',
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-serif-he',
  display: 'swap',
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Talya Zaltsman | Interior Architecture',
    template: '%s · Talya Zaltsman',
  },
  description: 'אדריכלות ועיצוב פנים — דירות יוקרה. סטודיו טליה זלצמן.',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) notFound();

  const messages = (await import(`../../../messages/${locale}.json`)).default;
  const dir = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={dir} className={`${cormorant.variable} ${frankRuhl.variable} ${heebo.variable} ${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-cream-100 text-ink font-sans antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <SmoothScroll>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <WhatsAppFab />
            <BackToTop />
<CustomCursor />
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
