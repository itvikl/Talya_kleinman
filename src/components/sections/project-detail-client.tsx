'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useSpring,
  AnimatePresence,
} from 'framer-motion';

// ── Scroll Progress Bar ────────────────────────────────────────────────────────
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 start-0 end-0 z-[100] h-[2px] origin-left"
      style={{ scaleX, background: '#C5A059' }}
    />
  );
}
import { MapPin, Calendar, ChevronDown, ArrowUpRight, ChevronLeft, ChevronRight, X, ArrowRight } from 'lucide-react';
import type { DbProject, DbProjectImage } from '@/types/database';
import { ShareButton } from '@/components/ui/share-button';
import { ComparisonSlider } from '@/components/ui/comparison-slider';

const GOLD = '#C5A059';
const INK  = '#1A1A1A';
const CREAM = '#FDFCFB';

interface Props {
  project: DbProject;
  images: DbProjectImage[];
  nextProject: DbProject | null;
  prevProject?: DbProject | null;
  locale: string;
  t: {
    backToProjects: string;
    nextProject: string;
    prevProject?: string;
    yearLabel: string;
    locationLabel: string;
    categoryLabel: string;
  };
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: DbProjectImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
      >
        <X size={18} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40"
        style={{ fontFamily: 'var(--font-montserrat)' }}>
        {String(idx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
      </div>

      {/* Image — touch-action: pinch-zoom enables mobile pinch zoom */}
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative max-h-[85vh] max-w-[85vw]"
        style={{ touchAction: 'pinch-zoom' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[idx].url}
          alt=""
          className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
          style={{ touchAction: 'pinch-zoom' }}
        />
      </motion.div>

      {/* Prev */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <ChevronLeft size={22} />
        </button>
      )}

      {/* Next */}
      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
        >
          <ChevronRight size={22} />
        </button>
      )}
    </motion.div>
  );
}

// ── Scroll Reveal ──────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.95, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Gallery Image Card ─────────────────────────────────────────────────────────
function GalleryCard({
  img,
  isHe,
  idx,
  onClick,
}: {
  img: DbProjectImage;
  isHe: boolean;
  idx: number;
  onClick: (idx: number) => void;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: (idx % 3) * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative overflow-hidden rounded-2xl mb-2 break-inside-avoid cursor-zoom-in bg-cream-200"
      onClick={() => onClick(idx)}
      data-cursor-expand
    >
      {!imgLoaded && (
        <div className="absolute inset-0 animate-pulse bg-cream-300 rounded-2xl" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={isHe ? img.alt_he || '' : img.alt_en || ''}
        loading={idx === 0 ? 'eager' : 'lazy'}
        decoding={idx === 0 ? 'sync' : 'async'}
        className={`w-full h-auto block transition-opacity duration-700 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setImgLoaded(true)}
      />
      {/* Caption slide-up */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-500 group-hover:translate-y-0">
        <div className="bg-black/60 px-5 py-3 backdrop-blur-sm">
          <p
            className="text-[9px] uppercase tracking-[0.3em] text-white/80"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {String(idx + 1).padStart(2, '0')}
            {(img.alt_he || img.alt_en) && ` · ${isHe ? img.alt_he : img.alt_en}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Editorial Gallery ──────────────────────────────────────────────────────────
function EditorialGallery({
  images,
  isHe,
}: {
  images: DbProjectImage[];
  isHe: boolean;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-2">
        {images.map((img, idx) => (
          <GalleryCard key={img.id} img={img} isHe={isHe} idx={idx} onClick={setLightboxIdx} />
        ))}
      </div>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main Export ────────────────────────────────────────────────────────────────
export function ProjectDetailClient({ project, images, nextProject, prevProject, locale, t }: Props) {
  const isHe = locale === 'he';
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imgY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const textY    = useTransform(scrollYProgress, [0, 0.6], ['0%', '-12%']);

  const title    = isHe ? project.title_he    : project.title_en;
  const desc     = isHe ? project.description_he : project.description_en;
  const location = isHe ? project.location_he  : project.location_en;

  return (
    <div style={{ background: CREAM, color: INK }}>
      <ScrollProgressBar />

      {/* ── SPLIT HERO ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex flex-col md:flex-row h-screen min-h-[680px] overflow-hidden"
        style={{ background: INK }}
      >
        {/* 65% — Image */}
        <div className="relative overflow-hidden md:w-[65%] h-[55vh] md:h-full">
          <motion.div
            className="absolute inset-0"
            style={{ y: imgY }}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {project.cover_image ? (
              <Image
                src={project.cover_image}
                alt={title}
                fill
                priority
                fetchPriority="high"
                sizes="65vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-neutral-800" />
            )}
          </motion.div>

          {/* Subtle left vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

          {/* Image count badge */}
          <div className="absolute bottom-6 start-6 z-10">
            <span
              className="text-[9px] uppercase tracking-[0.3em] text-white/30"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {String(images.length).padStart(2, '0')} photos
            </span>
          </div>
        </div>

        {/* 35% — Text */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="flex flex-col justify-between px-8 py-12 md:px-12 md:py-20 md:w-[35%]"
          dir={isHe ? 'rtl' : 'ltr'}
        >
          {/* Back + Share */}
          <div className="flex items-center justify-between">
            <Link
              href={`/${locale}/projects`}
              className="text-[9px] uppercase tracking-[0.3em] text-white/30 transition-colors hover:text-[#C5A059]"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              ← {t.backToProjects}
            </Link>
            <ShareButton title={title} isHe={isHe} />
          </div>

          {/* Title block */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-5 text-[9px] uppercase tracking-[0.45em]"
              style={{ color: GOLD, fontFamily: 'var(--font-montserrat)' }}
            >
              {project.category}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 1 }}
              className="mb-8 leading-[1.1] text-white"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(2rem, 3.2vw, 3.6rem)',
              }}
            >
              {title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="space-y-3"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <MapPin size={10} style={{ color: GOLD }} />
                {location}
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/40">
                <Calendar size={10} style={{ color: GOLD }} />
                {project.year}
                {project.area_sqm && (
                  <span className="opacity-60">· {project.area_sqm} m²</span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Scroll down */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-[8px] uppercase tracking-[0.4em] text-white/20"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown size={13} style={{ color: GOLD }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── GOLD DIVIDER + DESCRIPTION ──────────────────────────── */}
      {desc && (
        <section
          className="px-8 py-28 md:px-20 lg:px-40"
          style={{ background: CREAM }}
        >
          <Reveal>
            <div className="mx-auto max-w-2xl text-center" dir={isHe ? 'rtl' : 'ltr'}>
              <div className="mx-auto mb-10 h-px w-16" style={{ background: GOLD }} />
              <blockquote
                className="leading-[1.85] text-[#3A3A3A]"
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1.15rem, 2vw, 1.6rem)',
                  fontWeight: 400,
                }}
              >
                &ldquo;{desc}&rdquo;
              </blockquote>
              <div className="mx-auto mt-10 h-px w-16" style={{ background: GOLD }} />
            </div>
          </Reveal>
        </section>
      )}

      {/* ── BEFORE & AFTER ──────────────────────────────────────── */}
      {project.before_image && (
        <section className="px-4 py-16 md:px-20 lg:px-40" style={{ background: CREAM }}>
          <Reveal>
            <p
              className="mb-6 text-center text-[9px] uppercase tracking-[0.35em]"
              style={{ color: GOLD, fontFamily: 'var(--font-montserrat)' }}
            >
              {isHe ? 'לפני ואחרי' : 'Before & After'}
            </p>
            <ComparisonSlider
              before={project.before_image}
              after={project.cover_image}
              beforeLabel={isHe ? 'לפני' : 'Before'}
              afterLabel={isHe ? 'אחרי' : 'After'}
            />
          </Reveal>
        </section>
      )}

      {/* ── EDITORIAL GALLERY ───────────────────────────────────── */}
      {images.length > 0 && (
        <section className="px-2 pb-20 md:px-4" style={{ background: CREAM }}>
          <EditorialGallery images={images} isHe={isHe} />
        </section>
      )}

      {/* ── PROJECT NAV ARROWS ──────────────────────────────────── */}
      {(prevProject || nextProject) && (
        <section className="border-t border-ink/8" style={{ background: CREAM }}>
          <div className="container-editorial flex items-center justify-between py-10">
            {prevProject && prevProject.slug !== project.slug ? (
              <Link
                href={`/${locale}/projects/${prevProject.slug}`}
                className="group flex items-center gap-4 text-ink/40 transition-colors hover:text-ink"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-all duration-300 group-hover:border-ink/50">
                  <ChevronLeft size={16} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'var(--font-montserrat)', color: GOLD }}>
                    {t.prevProject ?? 'Previous'}
                  </p>
                  <p className="font-serif text-lg">{isHe ? prevProject.title_he : prevProject.title_en}</p>
                </div>
              </Link>
            ) : <div />}

            {nextProject && nextProject.slug !== project.slug ? (
              <Link
                href={`/${locale}/projects/${nextProject.slug}`}
                className="group flex items-center gap-4 text-ink/40 transition-colors hover:text-ink text-end"
              >
                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] mb-1" style={{ fontFamily: 'var(--font-montserrat)', color: GOLD }}>
                    {t.nextProject}
                  </p>
                  <p className="font-serif text-lg">{isHe ? nextProject.title_he : nextProject.title_en}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center border border-ink/15 transition-all duration-300 group-hover:border-ink/50">
                  <ChevronRight size={16} />
                </div>
              </Link>
            ) : <div />}
          </div>
        </section>
      )}

      {/* ── CONTACT CTA ─────────────────────────────────────────── */}
      <Reveal>
        <section className="py-24 text-center" style={{ background: CREAM }}>
          <div className="mx-auto mb-6 h-px w-12" style={{ background: GOLD }} />
          <p
            className="mb-4 text-[9px] uppercase tracking-[0.4em]"
            style={{ color: GOLD, fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe ? 'אוהבים את הפרויקט?' : 'Love this project?'}
          </p>
          <h3
            className="mb-10"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
              color: INK,
            }}
          >
            {isHe ? 'בואו נדבר על הפרויקט שלכם' : "Let's talk about your project"}
          </h3>
          <Link
            href={`/${locale}/contact`}
            className="group inline-flex items-center gap-4 border border-ink px-10 py-4 text-[10px] uppercase tracking-[0.25em] text-ink transition-all duration-500 hover:border-[#C5A059] hover:bg-[#C5A059] hover:text-white"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe ? 'צרו קשר' : 'Get in touch'}
            <ArrowRight size={12} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </section>
      </Reveal>

      {/* ── NEXT PROJECT ────────────────────────────────────────── */}
      {nextProject && nextProject.slug !== project.slug && (
        <NextSection project={nextProject} locale={locale} label={t.nextProject} isHe={isHe} />
      )}
    </div>
  );
}

// ── Next Project ───────────────────────────────────────────────────────────────
function NextSection({
  project,
  locale,
  label,
  isHe,
}: {
  project: DbProject;
  locale: string;
  label: string;
  isHe: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: INK, minHeight: '55vh' }}>
      {project.cover_image && (
        <Image src={project.cover_image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
      )}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.95), rgba(26,26,26,0.5))' }} />

      <Link
        href={`/${locale}/projects/${project.slug}`}
        className="group relative z-10 flex min-h-[55vh] flex-col items-center justify-center px-8 py-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p
            className="mb-4 text-[9px] uppercase tracking-[0.45em]"
            style={{ color: GOLD, fontFamily: 'var(--font-montserrat)' }}
          >
            {label}
          </p>
          <div className="mx-auto mb-8 h-px w-10" style={{ background: `${GOLD}50` }} />
          <h3
            className="text-white transition-colors duration-500 group-hover:text-[#C5A059]"
            style={{
              fontFamily: 'var(--font-playfair)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(2rem, 5vw, 5.5rem)',
            }}
          >
            {isHe ? project.title_he : project.title_en}
          </h3>
          <p
            className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe ? project.location_he : project.location_en}
            {project.year && ` · ${project.year}`}
          </p>
          <div className="mx-auto mt-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10">
            <ArrowUpRight size={15} className="text-white/30 transition-colors duration-500 group-hover:text-[#C5A059]" />
          </div>
        </motion.div>
      </Link>
    </section>
  );
}
