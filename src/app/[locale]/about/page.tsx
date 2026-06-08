import Image from 'next/image';
import Link from 'next/link';
import { getT } from '@/lib/translations';
import { getSiteSettings } from '@/lib/firestore';
import { FadeIn, FadeInLine } from '@/components/ui/fade-in';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getT(locale);
  return { title: t('about.title') };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, settings] = await Promise.all([getT(locale), getSiteSettings()]);
  const isHe = locale === 'he';

  const body = isHe ? settings.about_body_he : settings.about_body_en;
  const image = settings.about_image;

  const values = ['v1', 'v2', 'v3', 'v4'] as const;
  const timelineItems = ['t1', 't2', 't3', 't4'] as const;

  return (
    <div className="pt-40 pb-32">

      {/* ── Hero section ── */}
      <div className="container-editorial mb-28">
        <FadeIn>
          <p className="text-eyebrow mb-4">
            <span className="me-2 font-serif italic text-brass">—</span>
            {t('about.subtitle')}
          </p>
          <h1
            className="font-serif font-light leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
          >
            {t('about.title')}
            <br />
            <span className="italic text-brass/70">Talya Zaltsman</span>
          </h1>
        </FadeIn>
      </div>

      {/* ── Main bio ── */}
      <section className="container-editorial mb-28">
        <div className="grid gap-16 md:grid-cols-12 md:gap-24">
          <FadeIn delay={0.1} className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200">
              {image ? (
                <Image
                  src={image}
                  alt="Talya Zaltsman"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-cream-300" />
              )}
              {/* Subtle overlay badge */}
              <div className="absolute bottom-6 start-6 rounded-xl bg-ink/70 px-5 py-3 backdrop-blur-sm">
                <p
                  className="text-[8px] uppercase tracking-[0.3em] text-cream-100/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? 'ירושלים · מאז 2009' : 'Jerusalem · Est. 2009'}
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="md:col-span-7 md:pt-8">
            <p className="font-serif text-xl leading-relaxed text-ink/60 md:text-2xl">
              {body || t('about.body')}
            </p>

            <FadeInLine className="my-10 w-16" />

            <blockquote
              className="font-serif text-2xl font-light italic leading-relaxed text-ink md:text-3xl"
            >
              &ldquo;{t('about.philosophy')}&rdquo;
            </blockquote>

            <div className="mt-10">
              <Link
                href={`/${locale}/contact`}
                className="group inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-ink/40 transition-colors hover:text-brass"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                <span className="h-px w-10 bg-current transition-all duration-700 group-hover:w-20" />
                {isHe ? 'בואו נדבר' : "Let's talk"}
                <ArrowRight size={10} className="opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-cream-200/40 py-24">
        <div className="container-editorial">
          <FadeIn>
            <p className="text-eyebrow mb-3">
              <span className="me-2 font-serif italic text-brass">—</span>
              {t('about.valuesTitle')}
            </p>
          </FadeIn>

          <div className="mt-12 grid gap-0 sm:grid-cols-2 md:grid-cols-4">
            {values.map((key, i) => (
              <FadeIn key={key} delay={i * 0.1}>
                <div className="group border-t border-ink/10 py-8 md:border-s md:border-t-0 md:px-8 md:first:border-s-0 md:first:ps-0">
                  <p
                    className="mb-4 font-serif italic text-brass/35"
                    style={{ fontSize: '1.6rem' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="font-serif text-xl text-ink">
                    {t(`about.values.${key}.title`)}
                  </h3>
                  <div className="my-4 h-px w-8 bg-brass/30 transition-[width] duration-500 group-hover:w-14" />
                  <p className="text-sm leading-relaxed text-ink/50">
                    {t(`about.values.${key}.body`)}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="container-editorial py-24">
        <FadeIn>
          <p className="text-eyebrow mb-12">
            <span className="me-2 font-serif italic text-brass">—</span>
            {t('about.timelineTitle')}
          </p>
        </FadeIn>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute start-[3.5rem] top-0 bottom-0 w-px bg-ink/8 md:start-1/2" />

          <div className="space-y-12">
            {timelineItems.map((key, i) => (
              <FadeIn key={key} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Year bubble */}
                  <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-brass/30 bg-cream-100 md:mx-auto md:w-auto md:min-w-[50%] md:justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-brass/30 bg-cream-100">
                      <p className="font-serif text-sm italic text-brass/70">
                        {t(`about.timeline.${key}.year`)}
                      </p>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`pb-0 md:w-[45%] md:px-10 ${i % 2 === 0 ? 'md:text-start' : 'md:text-end'}`}>
                    <p className="font-serif text-lg text-ink/70">
                      {t(`about.timeline.${key}.text`)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
