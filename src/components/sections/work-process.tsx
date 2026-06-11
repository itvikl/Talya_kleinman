'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageCircle, PenLine, HardHat, KeyRound } from 'lucide-react';
import type { SiteSettings } from '@/types/database';

const ICONS = [MessageCircle, PenLine, HardHat, KeyRound];

function stepsFromSettings(s: Partial<SiteSettings>) {
  return [
    { num: '01', icon: ICONS[0], titleHe: s.wp1_title_he ?? 'פגישת היכרות', titleEn: s.wp1_title_en ?? 'Initial Meeting', descHe: s.wp1_desc_he ?? 'נפגשים, מדברים על החלום שלכם, הצרכים, התקציב והלוח זמנים.', descEn: s.wp1_desc_en ?? 'We meet, talk about your vision, needs, budget and timeline.' },
    { num: '02', icon: ICONS[1], titleHe: s.wp2_title_he ?? 'תכנון ועיצוב', titleEn: s.wp2_title_en ?? 'Design & Planning', descHe: s.wp2_desc_he ?? 'תוכניות אדריכליות, בחירת חומרים, הדמיות תלת-מימד.', descEn: s.wp2_desc_en ?? 'Architectural plans, material selection, 3D renderings.' },
    { num: '03', icon: ICONS[2], titleHe: s.wp3_title_he ?? 'ליווי ביצוע', titleEn: s.wp3_title_en ?? 'Execution Support', descHe: s.wp3_desc_he ?? 'עובדים מול קבלנים וספקים, משגיחים על כל פרט.', descEn: s.wp3_desc_en ?? 'Working with contractors and suppliers, overseeing every detail.' },
    { num: '04', icon: ICONS[3], titleHe: s.wp4_title_he ?? 'מסירה', titleEn: s.wp4_title_en ?? 'Handover', descHe: s.wp4_desc_he ?? 'הפרויקט מוכן. מסירת החלל המעוצב.', descEn: s.wp4_desc_en ?? 'The project is complete. Handing over the designed space.' },
  ];
}

export function WorkProcess({
  isHe,
  settings,
}: {
  isHe: boolean;
  settings?: Partial<SiteSettings>;
}) {
  const STEPS = stepsFromSettings(settings ?? {});
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="overflow-hidden bg-cream-200/40">
      <div className="container-editorial py-40">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="mb-24"
        >
          <p className="text-eyebrow mb-8">
            <span className="me-3 font-serif italic text-brass">05</span>
            {isHe ? 'איך עובדים' : 'How we work'}
          </p>
          <h2
            className="font-serif font-light leading-[1] text-ink"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)' }}
          >
            {isHe ? (
              <>תהליך<br /><span className="italic">העבודה</span></>
            ) : (
              <>The<br /><span className="italic">Process</span></>
            )}
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid gap-0 md:grid-cols-4">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 + i * 0.12 }}
                className="group relative"
              >
                {/* Connector line (between steps) */}
                {i < STEPS.length - 1 && (
                  <div className="absolute hidden md:block top-[2.1rem] start-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-ink/10" />
                )}

                <div className={`flex flex-col py-10 md:py-0 ${i > 0 ? 'border-t border-ink/10 md:border-t-0 md:ps-8' : ''}`}>

                  {/* Icon circle */}
                  <div className="mb-8 flex items-center gap-5 md:flex-col md:items-start md:gap-0">
                    <div className="flex h-[4.2rem] w-[4.2rem] flex-shrink-0 items-center justify-center rounded-full border border-ink/12 bg-cream-100 transition-all duration-500 group-hover:border-brass/40 group-hover:bg-brass/5 md:mb-8">
                      <Icon size={22} className="text-ink/40 transition-colors duration-500 group-hover:text-brass" strokeWidth={1.3} />
                    </div>

                    {/* Step number — visible on mobile next to icon */}
                    <p
                      className="font-serif italic text-brass/50 text-3xl md:hidden"
                    >
                      {step.num}
                    </p>
                  </div>

                  {/* Step number — desktop, above title */}
                  <p
                    className="mb-3 hidden font-serif italic text-brass/50 text-2xl md:block"
                  >
                    {step.num}
                  </p>

                  <h3
                    className="mb-4 font-serif font-light text-ink"
                    style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)' }}
                  >
                    {isHe ? step.titleHe : step.titleEn}
                  </h3>

                  <p
                    className="text-sm leading-[1.8] text-ink/45"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {isHe ? step.descHe : step.descEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
