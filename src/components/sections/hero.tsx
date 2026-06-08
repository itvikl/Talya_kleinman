'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useT } from '@/lib/i18n-context';
import { ArrowDown } from 'lucide-react';
import type { MouseEvent } from 'react';

export function Hero({
  heroImage,
  taglineHe,
  taglineEn,
  locale,
}: {
  heroImage?: string;
  taglineHe?: string;
  taglineEn?: string;
  locale?: string;
}) {
  const t = useT();
  const cover = heroImage ?? '';
  const isHe = locale === 'he';
  const tagline = isHe
    ? (taglineHe || t('home.heroTagline'))
    : (taglineEn || t('home.heroTagline'));

  // Mouse parallax values (normalised 0–1, center = 0.5)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Image drifts opposite to cursor
  const rawImgX = useTransform(mouseX, [0, 1], ['3%', '-3%']);
  const rawImgY = useTransform(mouseY, [0, 1], ['2%', '-2%']);
  const imgX = useSpring(rawImgX, { stiffness: 35, damping: 22 });
  const imgY = useSpring(rawImgY, { stiffness: 35, damping: 22 });

  // Text drifts subtly with cursor
  const rawTxtX = useTransform(mouseX, [0, 1], ['-0.8%', '0.8%']);
  const txtX = useSpring(rawTxtX, { stiffness: 35, damping: 22 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-ink"
      onMouseMove={handleMouseMove}
    >
      {/* Background image with mouse parallax */}
      <div className="absolute inset-0 overflow-hidden">
        {cover && (
          <motion.div
            className="absolute inset-[-5%]"
            style={{ x: imgX, y: imgY }}
            data-cursor-image
          >
            <Image
              src={cover}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-70"
            />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-transparent" />
      </div>

      {/* Content — anchored to bottom, text shifts with mouse */}
      <motion.div
        className="container-editorial relative flex h-full flex-col justify-end pb-16 pt-28 md:pb-24 md:pt-40"
        style={{ x: txtX }}
      >
        <div className="max-w-5xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 0.4 }}
            className="mb-10 text-[9px] uppercase tracking-[0.45em] text-cream-200/50"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe ? 'אדריכלות פנים ועיצוב · סטודיו' : 'Interior Architecture & Design · Studio'}
          </motion.p>

          {/* Heading — per-line mask reveal */}
          <h1
            className="font-serif font-light text-cream-100"
            style={{ fontSize: 'clamp(3rem, 13vw, 14rem)', lineHeight: 0.88 }}
          >
            <div className="overflow-hidden pb-2">
              <motion.span
                className="block"
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.25, ease: [0.32, 0.72, 0, 1], delay: 0.55 }}
              >
                Talya
              </motion.span>
            </div>
            <div className="overflow-hidden pb-2">
              <motion.span
                className="block italic"
                initial={{ y: '108%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.25, ease: [0.32, 0.72, 0, 1], delay: 0.72 }}
              >
                Zaltsman
              </motion.span>
            </div>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: [0.32, 0.72, 0, 1], delay: 1.05 }}
            className="my-10 h-px w-24 origin-start bg-brass"
          />

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.32, 0.72, 0, 1], delay: 1.2 }}
            className="max-w-sm font-serif text-base leading-relaxed text-cream-100/55 md:text-lg"
          >
            {tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.7 }}
            className="mt-8 md:mt-14"
          >
            <Link
              href={`/${locale ?? 'he'}/projects`}
              className="group inline-flex items-center gap-4 text-[9px] uppercase tracking-[0.35em] text-cream-100/60 transition-colors hover:text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <span className="h-px w-10 bg-current transition-all duration-700 group-hover:w-20" />
              {isHe ? 'לצפייה בפרויקטים' : 'View Projects'}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
        className="absolute bottom-8 end-10 flex flex-col items-center gap-3 text-cream-100/30"
      >
        <span
          style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-montserrat)' }}
          className="text-[8px] uppercase tracking-[0.4em]"
        >
          {isHe ? 'גלול' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={13} />
        </motion.div>
      </motion.div>

      {/* Est. badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.9 }}
        className="absolute bottom-8 start-8 md:start-16"
      >
        <p className="font-serif text-[9px] uppercase tracking-widest text-cream-100/25">
          {isHe ? 'ירושלים · מאז 2009' : 'Est. Jerusalem · Since 2009'}
        </p>
      </motion.div>
    </section>
  );
}
