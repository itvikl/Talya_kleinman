import { getT } from '@/lib/translations';
import { getProjects } from '@/lib/firestore';
import { ProjectsGrid } from '@/components/sections/projects-grid';
import { FadeIn, FadeInLine } from '@/components/ui/fade-in';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getT(locale);
  return { title: t('projects.title') };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getT(locale);
  const isHe = locale === 'he';
  const projects = await getProjects();

  return (
    <div className="pt-24 pb-20 md:pt-40 md:pb-32">

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="container-editorial mb-16 md:mb-24">
        <FadeIn>
          <p className="text-eyebrow mb-6">
            <span className="me-3 font-serif italic text-brass">—</span>
            {t('projects.subtitle')}
          </p>
          <h1
            className="font-serif font-light leading-[1.02] text-ink"
            style={{ fontSize: 'clamp(3rem, 7vw, 7rem)' }}
          >
            {isHe ? (
              <>
                {t('projects.title')}
                <br />
                <span className="italic text-brass/60">
                  {isHe ? 'נבחרים' : 'Selected'}
                </span>
              </>
            ) : (
              <>
                Selected
                <br />
                <span className="italic text-brass/60">Works</span>
              </>
            )}
          </h1>

          <FadeInLine className="mt-10 w-16" />

          <p
            className="mt-8 text-sm leading-[1.9] text-ink/40"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {isHe
              ? `${projects.length}+ פרויקטים · דירות יוקרה · ירושלים ותל אביב`
              : `${projects.length}+ projects · Luxury residences · Jerusalem & Tel Aviv`}
          </p>
        </FadeIn>
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <div className="container-editorial">
        <ProjectsGrid projects={projects} locale={locale} />
      </div>

    </div>
  );
}
