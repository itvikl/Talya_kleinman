'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { FadeIn } from '@/components/ui/fade-in';
import { ArrowRight } from 'lucide-react';
import type { DbProject } from '@/types/database';

/* ─── Single project card ─────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  isHe,
  locale,
}: {
  project: DbProject;
  index: number;
  isHe: boolean;
  locale: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);

  const title    = isHe ? project.title_he    : project.title_en;
  const location = isHe ? project.location_he : project.location_en;
  const num      = String(index + 1).padStart(2, '0');

  return (
    <FadeIn delay={index * 0.13}>
      <Link href={`/${locale}/projects/${project.slug}`} className="group block">

        {/* ── Image ── */}
        <div
          ref={ref}
          className="relative overflow-hidden rounded-2xl bg-cream-200"
          style={{ aspectRatio: '3/4' }}
        >
          {project.cover_image ? (
            <motion.div
              className="absolute inset-[-6%] will-change-transform"
              style={{ y: imgY }}
            >
              <Image
                src={project.cover_image}
                alt={title}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.67,0,0.285,1)] group-hover:scale-[1.05]"
              />
            </motion.div>
          ) : (
            <div className="h-full w-full bg-cream-300" />
          )}

            {/* Very soft darkening on hover */}
          <div className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover:bg-ink/[0.08]" />

          {/* "View project" — slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0">
            <div className="flex items-center justify-between bg-black/50 px-4 py-3 backdrop-blur-sm">
              <span
                className="text-[8px] uppercase tracking-[0.35em] text-white/80"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {isHe ? 'לצפייה בפרויקט ←' : 'View project →'}
              </span>
              <div className="h-px w-4 bg-brass/60" />
            </div>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="mt-[26px] text-center">

          {/* Number — sits just above the hairline */}
          <p
            className="font-serif italic text-brass/45"
            style={{ fontSize: '11px', letterSpacing: '0.1em', marginBottom: '3px' }}
            aria-hidden
          >
            {num}
          </p>

          {/* Hairline anchor: 36px → 56px on hover */}
          <div className="mx-auto h-px w-[36px] bg-brass/35 transition-[width] duration-[400ms] ease-out group-hover:w-[56px]" style={{ marginBottom: '7px' }} />

          {/* Title — focal point */}
          <h3
            className="text-ink leading-[1.18]"
            style={{
              fontFamily: isHe
                ? 'var(--font-serif-he), var(--font-serif), serif'
                : 'var(--font-serif), serif',
              fontSize: 'clamp(1.5rem, 1.9vw, 1.85rem)',
              fontWeight: 500,
              letterSpacing: '0.03em',
            }}
          >
            {title}
          </h3>

          {/* Metadata — generous breath below title */}
          <p
            className="uppercase text-brass/55"
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '12px',
              letterSpacing: '0.22em',
              marginTop: '14px',
            }}
          >
            {location}&ensp;·&ensp;{project.year}
          </p>
        </div>
      </Link>
    </FadeIn>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────────── */

interface Props {
  projects: DbProject[];
  isHe: boolean;
  locale: string;
  viewAllLabel: string;
  sectionLabel: string;
}

export function FeaturedWorks({ projects, isHe, locale, viewAllLabel, sectionLabel }: Props) {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });
  const shouldReduce = useReducedMotion();

  return (
    <section className="container-editorial py-28">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        ref={headerRef}
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-16"
      >
        {/* Top rule — matched-pair labels */}
        <div className="mb-3 flex items-center justify-between border-t border-ink/[0.12] pt-5">
          <p
            className="uppercase text-ink/38"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em' }}
          >
            <span
              className="me-2.5 font-serif italic text-brass/55"
              style={{ textTransform: 'none', fontSize: '0.65rem', letterSpacing: '0.08em' }}
            >
              01
            </span>
            {sectionLabel}
          </p>

          <Link
            href={`/${locale}/projects`}
            className="group hidden items-center gap-2 uppercase text-ink/30 transition-colors duration-300 hover:text-brass md:flex"
            style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', letterSpacing: '0.3em' }}
          >
            {viewAllLabel}
            <ArrowRight size={9} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Title block — centered */}
        <div className="text-center">
          <h2
            className="font-serif font-light leading-[1.05] text-ink"
            style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)' }}
          >
            {isHe ? (
              <>
                עבודות<br />
                <span className="italic" style={{ color: 'rgba(138, 110, 66, 0.82)' }}>נבחרות</span>
              </>
            ) : (
              <>
                Selected<br />
                <span className="italic" style={{ color: 'rgba(138, 110, 66, 0.82)' }}>Works</span>
              </>
            )}
          </h2>

          {/* Gold hairline anchor */}
          <div
            style={{
              width: '50px',
              height: '1px',
              backgroundColor: 'rgba(197, 160, 89, 0.6)',
              margin: '20px auto 0',
              display: 'block',
            }}
          />

          {/* Subtitle */}
          <p
            className="uppercase"
            style={{
              marginTop: '13px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '12px',
              letterSpacing: '0.22em',
              color: 'rgba(90, 72, 48, 0.45)',
            }}
          >
            {isHe ? 'מבחר עבודות עיצוב פנים' : 'A curated selection of interior projects'}
          </p>
        </div>
      </motion.div>

      {/* ── Grid ────────────────────────────────────────────────────────── */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 md:grid-cols-3 lg:gap-x-10">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              isHe={isHe}
              locale={locale}
            />
          ))}
        </div>
      )}

      {/* ── Mobile view all ─────────────────────────────────────────────── */}
      <FadeIn delay={0.3} className="mt-12 text-center md:hidden">
        <Link
          href={`/${locale}/projects`}
          className="group inline-flex items-center gap-2 text-[8.5px] uppercase text-ink/40 transition-colors hover:text-brass"
          style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '0.3em' }}
        >
          {viewAllLabel}
          <ArrowRight size={9} className="transition-transform duration-500 group-hover:translate-x-1" />
        </Link>
      </FadeIn>
    </section>
  );
}
