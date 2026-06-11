import Link from 'next/link';
import Image from 'next/image';
import { getT } from '@/lib/translations';
import { getProjects, getSiteSettings, getTestimonials } from '@/lib/firestore';
import { Hero } from '@/components/sections/hero';
import { FeaturedWorks } from '@/components/sections/featured-works';
import { FadeIn, FadeInLine } from '@/components/ui/fade-in';
import { Counter } from '@/components/ui/counter';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { WorkProcess } from '@/components/sections/work-process';
import { BeforeAfterSection } from '@/components/sections/before-after-section';
import { Marquee } from '@/components/ui/marquee';
import { ArrowRight, Download } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getT(locale);
  const isHe = locale === 'he';

  const [allProjects, settings, dbTestimonials] = await Promise.all([
    getProjects(),
    getSiteSettings(),
    getTestimonials(),
  ]);
  const featured = allProjects.slice(0, 3);
  const aboutCover = settings.about_image || allProjects[1]?.cover_image || allProjects[0]?.cover_image || null;

  return (
    <>
      <Hero
        heroImage={settings.hero_image}
        taglineHe={settings.hero_tagline_he}
        taglineEn={settings.hero_tagline_en}
        locale={locale}
      />

      {/* ── Selected Works ──────────────────────────────── */}
      <FeaturedWorks
        projects={featured}
        isHe={isHe}
        locale={locale}
        viewAllLabel={t('home.viewAll')}
        sectionLabel={t('home.selectedWorks')}
      />

      {/* ── Marquee strip ───────────────────────────────── */}
      <Marquee className="border-y border-ink/8 bg-cream-100 py-4">
        <span
          className="text-[9px] uppercase tracking-[0.35em] text-ink/25"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {isHe ? settings.marquee_he : settings.marquee_en}
        </span>
      </Marquee>

      {/* ── About ───────────────────────────────────────── */}
      <section className="overflow-hidden bg-cream-200/40">
        <div className="container-editorial py-40">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20 md:items-center">

            {/* Image — 50% */}
            <FadeIn delay={0.1} className="order-2 md:order-1">
              <div className="relative overflow-hidden rounded-2xl" style={{ aspectRatio: '4/5' }}>
                {aboutCover ? (
                  <Image
                    src={aboutCover}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-cream-300" />
                )}
              </div>
            </FadeIn>

            {/* Text — 50% */}
            <FadeIn className="order-1 md:order-2">
              <p className="text-eyebrow mb-8">
                <span className="me-3 font-serif italic text-brass">02</span>
                {t('home.aboutTitle')}
              </p>
              <blockquote
                className="font-serif font-light leading-[1.18] text-ink"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 3rem)' }}
              >
                &ldquo;{isHe ? settings.home_about_body_he : settings.home_about_body_en}&rdquo;
              </blockquote>
              <div className="mt-14">
                <Link
                  href={`/${locale}/about`}
                  className="group inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.3em] text-ink/50 transition-colors hover:text-brass"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  <span className="h-px w-10 bg-current transition-all duration-700 group-hover:w-20" />
                  {t('home.readMore')}
                  <ArrowRight size={10} className="opacity-0 -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <TestimonialsSection isHe={isHe} testimonials={dbTestimonials} />

      {/* ── Work Process ────────────────────────────────── */}
      <WorkProcess isHe={isHe} settings={settings} />

      {/* ── Before & After ──────────────────────────────── */}
      <BeforeAfterSection isHe={isHe} settings={settings} />

      {/* ── Stats ──────────────────────────────────────── */}
      <section className="border-y border-ink/8 bg-cream-100">
        <div className="container-editorial py-24">
          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
            {[
              { end: settings.stat_projects, suffix: '+', labelHe: 'פרויקטים', labelEn: 'Projects' },
              { end: settings.stat_years, suffix: '+', labelHe: 'שנות ניסיון', labelEn: 'Years experience' },
              { end: settings.stat_cities, suffix: '', labelHe: 'ערים', labelEn: 'Cities' },
              { end: settings.stat_clients, suffix: '%', labelHe: 'לקוחות מרוצים', labelEn: 'Happy clients' },
            ].map((stat) => (
              <FadeIn key={stat.labelEn} className="text-center">
                <p
                  className="font-serif text-5xl font-light text-ink md:text-6xl"
                >
                  <Counter end={stat.end} suffix={stat.suffix} />
                </p>
                <p
                  className="mt-3 text-[9px] uppercase tracking-[0.25em] text-ink/35"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? stat.labelHe : stat.labelEn}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="container-editorial flex min-h-[65vh] flex-col items-center justify-center py-40 text-center">
        <FadeIn>
          <p className="text-eyebrow mb-10">
            <span className="me-3 font-serif italic text-brass">03</span>
            Begin
          </p>
          <h2
            className="font-serif font-light leading-[1] text-ink"
            style={{ fontSize: 'clamp(3rem, 8vw, 9rem)' }}
          >
            {isHe ? (
              <>נתחיל<br /><span className="italic">יחד</span></>
            ) : (
              <>Let&rsquo;s<br /><span className="italic">Begin</span></>
            )}
          </h2>
          <FadeInLine delay={0.4} className="mx-auto mt-12 w-16" />
          <p className="mt-8 text-sm text-ink/40 font-serif">
            {isHe ? 'יוצרים חלל שמרגיש כמו בית' : 'Creating spaces that feel like home'}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="group inline-flex items-center gap-5 border border-ink/30 px-8 py-3.5 text-[9px] uppercase tracking-[0.35em] text-ink/70 transition-all duration-500 hover:border-brass hover:text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'צרו קשר' : 'Get in touch'}
              <ArrowRight size={11} className="transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
            <Link
              href={`/${locale}/catalog`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-ink/30 transition-colors hover:text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <Download size={10} />
              {isHe ? 'הורד קטלוג' : 'Download catalog'}
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
