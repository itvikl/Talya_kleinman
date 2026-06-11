import { getT } from '@/lib/translations';
import { getSiteSettings } from '@/lib/firestore';
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
  const [t, settings] = await Promise.all([getT(locale), getSiteSettings()]);
  const isHe = locale === 'he';

  const phone = settings.contact_phone;
  const email = settings.contact_email;
  const instagram = settings.contact_instagram;
  const address = isHe ? settings.contact_address_he : settings.contact_address_en;
  const hours1 = isHe ? settings.contact_hours1_he : settings.contact_hours1_en;
  const hours2 = isHe ? settings.contact_hours2_he : settings.contact_hours2_en;

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
                  <p className="font-serif text-lg leading-snug text-ink/65">{address}</p>
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
                    href={`tel:${phone.replace(/[\s\-]/g, '')}`}
                    className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                  >
                    <Phone size={15} className="flex-shrink-0 text-brass/50" />
                    {phone}
                  </a>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                  >
                    <Mail size={15} className="flex-shrink-0 text-brass/50" />
                    {email}
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
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-serif text-lg text-ink/65 transition-colors hover:text-brass"
                >
                  <Instagram size={15} className="flex-shrink-0 text-brass/50" />
                  {instagram.replace('https://www.instagram.com/', '').replace(/\/$/, '')}
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
                <p className="font-serif text-base text-ink/50">{hours1}</p>
                <p className="font-serif text-base text-ink/50">{hours2}</p>
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
