'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ComparisonSlider } from '@/components/ui/comparison-slider';
import type { SiteSettings } from '@/types/database';

interface BeforeAfterPair {
  beforeUrl: string;
  afterUrl: string;
  titleHe: string;
  titleEn: string;
  metaHe: string;
  metaEn: string;
}

function pairsFromSettings(s: Partial<SiteSettings>): BeforeAfterPair[] {
  return [
    {
      beforeUrl: s.ba1_before_url ?? 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
      afterUrl:  s.ba1_after_url  ?? 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
      titleHe:   s.ba1_title_he   ?? 'מטבח — ירושלים',
      titleEn:   s.ba1_title_en   ?? 'Kitchen — Jerusalem',
      metaHe:    s.ba1_meta_he    ?? '2024 · 145 מ"ר',
      metaEn:    s.ba1_meta_en    ?? '2024 · 145 sqm',
    },
    {
      beforeUrl: s.ba2_before_url ?? 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80',
      afterUrl:  s.ba2_after_url  ?? 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
      titleHe:   s.ba2_title_he   ?? 'סוויטה ראשית — תל אביב',
      titleEn:   s.ba2_title_en   ?? 'Master Suite — Tel Aviv',
      metaHe:    s.ba2_meta_he    ?? '2023 · 180 מ"ר',
      metaEn:    s.ba2_meta_en    ?? '2023 · 180 sqm',
    },
  ].filter((p) => p.beforeUrl && p.afterUrl);
}

export function BeforeAfterSection({
  isHe,
  settings,
}: {
  isHe: boolean;
  settings?: Partial<SiteSettings>;
}) {
  const pairs = pairsFromSettings(settings ?? {});
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="overflow-hidden bg-ink">
      <div className="container-editorial py-40">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p
              className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/30"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <span className="me-3 font-serif italic text-brass">06</span>
              {isHe ? 'שינוי אמיתי' : 'Real transformation'}
            </p>
            <h2
              className="font-serif font-light leading-[1] text-white"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}
            >
              {isHe ? (
                <>לפני<br /><span className="italic">ואחרי</span></>
              ) : (
                <>Before<br /><span className="italic">&amp; After</span></>
              )}
            </h2>
          </div>

          <p
            className="max-w-xs text-sm leading-[1.8] text-white/35"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe
              ? 'גררו את הקו כדי לראות את השינוי'
              : 'Drag the line to reveal the transformation'}
          </p>
        </motion.div>

        {/* Pairs */}
        <div className="grid gap-16 md:grid-cols-2">
          {pairs.map((pair, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15 }}
            >
              <ComparisonSlider
                before={pair.beforeUrl}
                after={pair.afterUrl}
                beforeLabel={isHe ? 'לפני' : 'Before'}
                afterLabel={isHe ? 'אחרי' : 'After'}
              />

              {/* Caption */}
              <div className="mt-5 flex items-center justify-between">
                <p
                  className="font-serif font-light text-white/70"
                  style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.15rem)' }}
                >
                  {isHe ? pair.titleHe : pair.titleEn}
                </p>
                <p
                  className="text-[9px] uppercase tracking-[0.25em] text-white/25"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {isHe ? pair.metaHe : pair.metaEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
