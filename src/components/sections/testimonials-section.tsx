'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { DbTestimonial } from '@/types/database';

const FALLBACK: DbTestimonial[] = [
  {
    id: '1',
    text_he: 'טליה הפכה את הדירה שלנו לחלום שחיכינו לו שנים. כל פרט תוכנן בקפידה, כל חומר נבחר בדיוק.',
    text_en: 'Talya turned our apartment into a dream we had waited years for. Every detail was meticulously planned, every material precisely chosen.',
    name: 'מיכל ויוסי לוי',
    project_title_he: 'דירה בתל אביב',
    project_title_en: 'Tel Aviv Apartment',
    sort_order: 0,
    published: true,
  },
  {
    id: '2',
    text_he: 'יצירתיות, מקצועיות ואדיבות ברמה הגבוהה ביותר. תוצאת הפרויקט עברה את כל הציפיות שלנו.',
    text_en: 'Creativity, professionalism and courtesy at the highest level. The result surpassed all our expectations.',
    name: 'דנה כהן',
    project_title_he: 'וילה ברמת השרון',
    project_title_en: 'Ramat HaSharon Villa',
    sort_order: 1,
    published: true,
  },
  {
    id: '3',
    text_he: 'החלל שנוצר מרגיש כמו בית אמיתי — חם, אינטימי, יוקרתי. תודה על הקשבה לחלום שלנו.',
    text_en: 'The space created feels like a real home — warm, intimate, luxurious. Thank you for listening to our dream.',
    name: 'ניר ואמירה שפירא',
    project_title_he: 'פנטהאוז בהרצליה',
    project_title_en: 'Herzliya Penthouse',
    sort_order: 2,
    published: true,
  },
];

export function TestimonialsSection({
  isHe,
  testimonials,
}: {
  isHe: boolean;
  testimonials?: DbTestimonial[];
}) {
  const items = (testimonials && testimonials.length > 0) ? testimonials : FALLBACK;
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="overflow-hidden bg-ink py-32">
      <div className="container-editorial">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-8 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="mb-4 text-[9px] uppercase tracking-[0.3em] text-white/30" style={{ fontFamily: 'var(--font-montserrat)' }}>
              <span className="me-3 font-serif italic text-brass">04</span>
              {isHe ? 'מה אומרים לקוחות' : 'Client words'}
            </p>
            <h2 className="font-serif font-light leading-[1] text-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {isHe ? <>ביחד<br /><span className="italic">יצרנו</span></> : <>We created<br /><span className="italic">together</ span></>}
            </h2>
          </div>

          {/* Dot nav */}
          <div className="flex gap-3">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="h-1 rounded-full transition-all duration-500"
                style={{
                  width: active === i ? 32 : 8,
                  background: active === i ? '#C5A059' : 'rgba(255,255,255,0.2)',
                }}
                aria-label={`testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Quote cards */}
        <div className="relative">
          {items.map((t, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 16, pointerEvents: active === i ? 'auto' : 'none' }}
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute inset-0"
              style={{ display: i === 0 ? undefined : 'block' }}
            >
              <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-20 md:items-center" dir={isHe ? 'rtl' : 'ltr'}>
                <Quote
                  size={48}
                  className="text-brass/25 hidden md:block flex-shrink-0"
                />
                <div>
                  <blockquote
                    className="mb-8 leading-[1.8] text-white/80"
                    style={{
                      fontFamily: 'var(--font-playfair)',
                      fontStyle: 'italic',
                      fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
                    }}
                  >
                    &ldquo;{isHe ? t.text_he : t.text_en}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-8 bg-brass/50" />
                    <div>
                      <p className="text-sm font-medium text-white/70">{t.name}</p>
                      {(t.project_title_he || t.project_title_en) && (
                        <p className="text-[10px] uppercase tracking-[0.2em] text-brass/60 mt-0.5"
                          style={{ fontFamily: 'var(--font-montserrat)' }}>
                          {isHe ? t.project_title_he : t.project_title_en}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Spacer for the tallest card */}
          <div className="invisible" aria-hidden>
            <div className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-20 md:items-center">
              <Quote size={48} className="hidden md:block flex-shrink-0" />
              <blockquote style={{ fontFamily: 'var(--font-playfair)', fontStyle: 'italic', fontSize: 'clamp(1.1rem,2vw,1.5rem)' }}>
                {items[items.length - 1]?.text_he}
              </blockquote>
            </div>
          </div>
        </div>

        {/* Mobile tap indicators */}
        <div className="mt-12 flex justify-center gap-3 md:hidden">
          {items.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} className="p-2" aria-label={`testimonial ${i + 1}`}>
              <span className="block h-1 rounded-full transition-all duration-500"
                style={{ width: active === i ? 28 : 8, background: active === i ? '#C5A059' : 'rgba(255,255,255,0.2)' }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
