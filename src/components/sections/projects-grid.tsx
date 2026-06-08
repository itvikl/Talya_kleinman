'use client';

import { useRef } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import type { DbProject, ProjectCategory } from '@/types/database';
import { useT } from '@/lib/i18n-context';
import { cn } from '@/lib/utils';

type Filter = 'all' | ProjectCategory;

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
}

// ── Single project card ────────────────────────────────────────────────────────
function ProjectCard({
  project,
  index,
  locale,
  isHe,
  offset,
}: {
  project: DbProject;
  index: number;
  locale: string;
  isHe: boolean;
  offset: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const title    = isHe ? project.title_he    : project.title_en;
  const location = isHe ? project.location_he : project.location_en;
  const num      = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={shouldReduce ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.85,
        delay: (index % 2) * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn(offset && 'md:mt-[70px]')}
    >
      <Link href={`/${locale}/projects/${project.slug}`} className="group block">

        {/* ── Image ─────────────────────────────────────────────────────────── */}
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-cream-200"
          data-cursor-expand
        >
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={title}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.05]"
              style={{ filter: 'saturate(0.92) brightness(1.02)' }}
            />
          ) : (
            <div className="h-full w-full bg-cream-300" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 transition-[background-color] duration-700 group-hover:bg-black/25" />

          {/* View project — slides up from bottom */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-y-0">
            <div className="flex items-center justify-between bg-black/50 px-5 py-3.5 backdrop-blur-sm">
              <span
                className="text-[9px] uppercase tracking-[0.35em] text-white/80"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {isHe ? 'לצפייה בפרויקט ←' : 'View project →'}
              </span>
              <div className="h-px w-5 bg-brass/60" />
            </div>
          </div>

          {/* "New" badge */}
          {isNew(project.created_at) && (
            <div className="absolute top-3 start-3 z-10">
              <span
                className="rounded-full bg-brass px-2.5 py-0.5 text-[8px] uppercase tracking-[0.2em] text-white shadow-sm"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {isHe ? 'חדש' : 'New'}
              </span>
            </div>
          )}
        </div>

        {/* ── Info ──────────────────────────────────────────────────────────── */}
        <div className="mt-[26px] text-center">

          {/* Number — sits just above the hairline */}
          <p
            className="font-serif italic text-brass/45"
            style={{ fontSize: '11px', letterSpacing: '0.1em', marginBottom: '3px' }}
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
              fontSize: 'clamp(1.75rem, 2.4vw, 2rem)',
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
            {location} · {project.year}
            {project.area_sqm ? ` · ${project.area_sqm} m²` : ''}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Grid export ────────────────────────────────────────────────────────────────
export function ProjectsGrid({ projects, locale }: { projects: DbProject[]; locale: string }) {
  const t = useT();
  const [filter, setFilter] = useState<Filter>('all');
  const isHe = locale === 'he';

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all',       label: t('projects.filterAll') },
    { key: 'warm',      label: t('projects.filterWarm') },
    { key: 'statement', label: t('projects.filterStatement') },
    { key: 'glamour',   label: t('projects.filterGlamour') },
  ];

  return (
    <>
      {/* Filter bar */}
      <div className="mb-16 flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-ink/10 pb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'relative text-[10px] uppercase tracking-[0.25em] transition-colors duration-300',
              filter === f.key ? 'text-brass' : 'text-ink/40 hover:text-ink',
            )}
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {f.label}
            {filter === f.key && (
              <motion.span
                layoutId="filter-underline"
                className="absolute -bottom-1 left-0 right-0 h-px bg-brass"
                transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            )}
          </button>
        ))}

        {/* Count */}
        <motion.span
          key={filtered.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ms-auto text-[10px] tracking-widest text-ink/25"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {String(filtered.length).padStart(2, '0')}
        </motion.span>
      </div>

      {filtered.length === 0 && (
        <p className="py-24 text-center text-sm text-ink/40">
          No projects in this category.
        </p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-x-8 gap-y-20 md:grid-cols-2 lg:gap-x-12"
        >
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              locale={locale}
              isHe={isHe}
              offset={i % 3 === 1}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
