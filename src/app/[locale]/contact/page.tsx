import { getT } from '@/lib/translations';
import { ContactForm } from '@/components/sections/contact-form';
import { FadeIn } from '@/components/ui/fade-in';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getT(locale);
  return { title: t('contact.title') };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getT(locale);
  const isHe = locale === 'he';

  return (
    <div className="pt-24 pb-20 md:pt-40 md:pb-32">
      <div className="container-editorial">

        {/* Header */}
        <FadeIn>
          <header className="mb-12 max-w-3xl md:mb-20">
            <p className="text-eyebrow mb-4">
              <span className="me-2 font-serif italic text-brass">—</span>
              {t('contact.subtitle')}
            </p>
            <h1
              className="font-serif font-light leading-[1.02] text-ink"
              style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
            >
              {isHe ? (
                <>{t('contact.title')}<br /><span className="italic text-brass/70">אתנו</span></>
              ) : (
                <>Get in<br /><span className="italic text-brass/70">Touch</span></>
              )}
            </h1>
          </header>
        </FadeIn>

        <div className="grid gap-16 md:grid-cols-12 md:gap-24">

          {/* Sidebar */}
          <FadeIn delay={0.1} className="md:col-span-4">
            <aside className="space-y-10">

              <div className="space-y-4">
                <p
                  className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? 'כתובת' : 'Address'}
                </p>
                <div className="flex items-start gap-3">
                  <MapPin size={15} className="mt-0.5 flex-shrink-0 text-brass/50" />
                  <p className="font-serif text-lg leading-snug text-ink/65">
                    {isHe ? 'ירושלים, ישראל' : 'Jerusalem, Israel'}
                  </p>
                </div>
              </div>

              <div className="h-px bg-ink/8" />

              <div className="space-y-4">
                <p
                  className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? 'יצירת קשר' : 'Contact'}
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:+972501234567"
                    className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                  >
                    <Phone size={15} className="flex-shrink-0 text-brass/50" />
                    +972 50-123-4567
                  </a>
                  <a
                    href="mailto:studio@talyazaltsman.com"
                    className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                  >
                    <Mail size={15} className="flex-shrink-0 text-brass/50" />
                    studio@talyazaltsman.com
                  </a>
                </div>
              </div>

              <div className="h-px bg-ink/8" />

              <div className="space-y-4">
                <p
                  className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? 'רשתות חברתיות' : 'Social'}
                </p>
                <a
                  href="https://www.instagram.com/talya_zaltsman_interiors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                >
                  <Instagram size={15} className="flex-shrink-0 text-brass/50" />
                  @talya_zaltsman_interiors
                </a>
              </div>

              <div className="h-px bg-ink/8" />

              {/* Hours */}
              <div className="space-y-3">
                <p
                  className="text-[8px] uppercase tracking-[0.35em] text-brass/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? 'שעות פעילות' : 'Hours'}
                </p>
                <p className="font-serif text-base text-ink/50">
                  {isHe ? 'א׳–ה׳: 9:00–18:00' : 'Sun–Thu: 9:00–18:00'}
                </p>
                <p className="font-serif text-base text-ink/50">
                  {isHe ? 'ו׳: 9:00–14:00' : 'Fri: 9:00–14:00'}
                </p>
              </div>
            </aside>
          </FadeIn>

          {/* Form */}
          <FadeIn delay={0.2} className="md:col-span-8">
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
