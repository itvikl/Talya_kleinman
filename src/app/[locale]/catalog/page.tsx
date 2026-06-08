import Image from 'next/image';
import { getProjects } from '@/lib/firestore';
import { PrintTrigger } from './print-trigger';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isHe = locale === 'he';
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-white" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Print trigger + controls bar — hidden in print */}
      <PrintTrigger isHe={isHe} />

      {/* Cover page */}
      <div className="flex h-screen flex-col items-center justify-center print:break-after-page">
        <p
          className="mb-6 text-[10px] uppercase tracking-[0.4em] text-ink/30"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Portfolio · {new Date().getFullYear()}
        </p>
        <h1
          className="text-center font-serif font-light leading-[1] text-ink"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          Talya<br />
          <span className="italic">Zaltsman</span>
        </h1>
        <div className="mt-8 h-px w-16 bg-brass/60" />
        <p
          className="mt-6 text-[9px] uppercase tracking-[0.3em] text-ink/30"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          {isHe ? 'אדריכלות פנים · עיצוב יוקרה' : 'Interior Architecture · Luxury Design'}
        </p>
      </div>

      {/* Project pages */}
      {projects.map((project, i) => {
        const title = isHe ? project.title_he : project.title_en;
        const location = isHe ? project.location_he : project.location_en;
        const desc = isHe ? project.description_he : project.description_en;

        return (
          <div
            key={project.id}
            className="grid min-h-screen grid-cols-2 print:break-after-page"
          >
            {/* Image */}
            <div className="relative bg-cream-200">
              {project.cover_image ? (
                <Image
                  src={project.cover_image}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              ) : (
                <div className="h-full w-full bg-cream-300" />
              )}
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center px-16 py-20">
              <p
                className="mb-3 text-[9px] uppercase tracking-[0.35em] text-ink/25"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {String(i + 1).padStart(2, '0')} · {project.category}
              </p>
              <h2
                className="mb-4 font-serif font-light leading-[1.1] text-ink"
                style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
              >
                {title}
              </h2>
              <div className="mb-8 h-px w-10 bg-brass/50" />
              <p
                className="text-[10px] uppercase tracking-[0.2em] text-ink/35 mb-2"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {location} · {project.year}
                {project.area_sqm ? ` · ${project.area_sqm} m²` : ''}
              </p>
              {desc && (
                <p
                  className="mt-6 leading-[1.9] text-ink/55"
                  style={{
                    fontFamily: 'var(--font-playfair)',
                    fontStyle: 'italic',
                    fontSize: '0.95rem',
                  }}
                >
                  {desc}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Back page */}
      <div className="flex h-screen flex-col items-center justify-center text-center">
        <div className="mb-8 h-px w-12 bg-brass/50" />
        <p
          className="font-serif font-light text-ink"
          style={{ fontSize: 'clamp(1.2rem, 2vw, 1.8rem)' }}
        >
          {isHe ? 'נתחיל יחד?' : "Let's begin together"}
        </p>
        <p
          className="mt-4 text-[9px] uppercase tracking-[0.3em] text-ink/30"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          www.talyazaltsman.com
        </p>
      </div>
    </div>
  );
}
