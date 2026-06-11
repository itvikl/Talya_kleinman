import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import { Cormorant_Garamond, Frank_Ruhl_Libre, Heebo, Playfair_Display, Montserrat } from 'next/font/google';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { I18nProvider } from '@/lib/i18n-context';
import { SiteSettingsProvider } from '@/lib/settings-context';
import { getSiteSettings } from '@/lib/firestore';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WhatsAppFab } from '@/components/ui/whatsapp-fab';
import { CustomCursor } from '@/components/ui/custom-cursor';
import { BackToTop } from '@/components/ui/back-to-top';
import { SmoothScroll } from '@/components/ui/smooth-scroll';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-serif',
  display: 'swap',
  preload: true,
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400'],
  variable: '--font-serif-he',
  display: 'swap',
  preload: true,
});

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: false,
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

  const [messages, settings] = await Promise.all([
    import(`../../../messages/${locale}.json`).then((m) => m.default),
    getSiteSettings(),
  ]);
  const dir = localeDirection[locale as Locale];

  return (
    <html lang={locale} dir={dir} className={`${cormorant.variable} ${frankRuhl.variable} ${heebo.variable} ${playfair.variable} ${montserrat.variable}`}>
      <body className="bg-cream-100 text-ink font-sans antialiased">
        <I18nProvider locale={locale} messages={messages}>
          <SiteSettingsProvider settings={settings}>
            <SmoothScroll>
              <div className="relative">
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <WhatsAppFab />
                <BackToTop />
                <CustomCursor />
              </div>
            </SmoothScroll>
          </SiteSettingsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
