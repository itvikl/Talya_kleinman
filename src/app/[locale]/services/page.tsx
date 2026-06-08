import Link from 'next/link';
import { getT } from '@/lib/translations';
import { ArrowRight, Check } from 'lucide-react';
import { FadeIn } from '@/components/ui/fade-in';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getT(locale);
  return { title: t('services.title') };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getT(locale);
  const isHe = locale === 'he';

  const services = ['architecture', 'interior', 'supervision'] as const;
  const processSteps = ['step1', 'step2', 'step3', 'step4'] as const;

  return (
    <div className="pt-24 pb-20 md:pt-40 md:pb-32">

      {/* ── Header ── */}
      <div className="container-editorial mb-14 md:mb-24">
        <FadeIn>
          <p className="text-eyebrow mb-4">
            <span className="me-2 font-serif italic text-brass">—</span>
            {t('services.subtitle')}
          </p>
          <h1
            className="font-serif font-light leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
          >
            {isHe ? (
              <>{t('services.title')}<br /><span className="italic text-brass/70">לכם</span></>
            ) : (
              <>Our<br /><span className="italic text-brass/70">{t('services.title')}</span></>
            )}
          </h1>
          <p className="mt-10 max-w-xl font-serif text-lg leading-relaxed text-ink/55">
            {t('services.intro')}
          </p>
        </FadeIn>
      </div>

      {/* ── Service cards ── */}
      <div className="container-editorial">
        <div className="grid gap-0 md:grid-cols-3">
          {services.map((key, i) => {
            const includes = [
              t(`services.items.${key}.includes.0`),
              t(`services.items.${key}.includes.1`),
              t(`services.items.${key}.includes.2`),
              t(`services.items.${key}.includes.3`),
            ];
            return (
              <FadeIn key={key} delay={i * 0.12}>
                <div className="group relative border-t border-ink/12 px-0 py-10 md:border-s md:border-t-0 md:px-10 md:first:border-s-0 md:first:ps-0 md:last:pe-0">
                  {/* Number */}
                  <p
                    className="mb-6 font-serif italic text-brass/40"
                    style={{ fontSize: '2.5rem', lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>

                  {/* Title */}
                  <h2 className="font-serif text-2xl font-light leading-snug text-ink md:text-3xl">
                    {t(`services.items.${key}.title`)}
                  </h2>

                  {/* Divider */}
                  <div className="my-6 h-px w-10 bg-brass/35 transition-[width] duration-500 group-hover:w-16" />

                  {/* Body */}
                  <p className="leading-relaxed text-ink/55 text-[0.95rem]">
                    {t(`services.items.${key}.body`)}
                  </p>

                  {/* Includes list */}
                  <ul className="mt-8 space-y-2.5">
                    {includes.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3 text-[0.8rem] text-ink/45"
                      >
                        <Check size={12} className="mt-0.5 flex-shrink-0 text-brass/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>

      {/* ── Process section ── */}
      <section className="mt-28 bg-cream-200/40">
        <div className="container-editorial py-24">
          <FadeIn>
            <p className="text-eyebrow mb-3">
              <span className="me-2 font-serif italic text-brass">—</span>
              {t('services.processTitle')}
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-0 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <FadeIn key={step} delay={i * 0.1}>
                <div className="relative border-t border-ink/10 py-8 md:border-s md:border-t-0 md:px-8 md:first:border-s-0 md:first:ps-0">
                  {/* Connector dot */}
                  <div className="absolute -top-1.5 start-0 h-3 w-3 rounded-full border border-brass/50 bg-cream-200 md:-start-1.5 md:top-auto md:mt-0" />

                  <p
                    className="mb-3 font-serif italic text-brass/35"
                    style={{ fontSize: '1.4rem' }}
                  >
                    {t(`services.process.${step}.num`)}
                  </p>
                  <h3 className="font-serif text-lg text-ink">
                    {t(`services.process.${step}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/45">
                    {t(`services.process.${step}.body`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container-editorial mt-24 text-center">
        <FadeIn>
          <h2
            className="font-serif font-light text-ink"
            style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
          >
            {t('services.ctaTitle')}
          </h2>
          <p className="mt-4 font-serif text-lg text-ink/45">
            {t('services.ctaBody')}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-4 border border-ink/25 px-8 py-3.5 text-[9px] uppercase tracking-[0.35em] text-ink/60 transition-all duration-500 hover:border-brass hover:text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {t('services.ctaButton')}
              <ArrowRight size={11} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
