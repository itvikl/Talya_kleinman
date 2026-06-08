import { notFound } from 'next/navigation';
import { getT } from '@/lib/translations';
import { getProjectBySlug, getProjects, getProjectImages } from '@/lib/firestore';
import { ProjectDetailClient } from '@/components/sections/project-detail-client';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return { title: locale === 'he' ? project.title_he : project.title_en };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) notFound();

  const images = await getProjectImages(project.id);
  const t = await getT(locale);

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const total = allProjects.length;
  const nextProject = total > 1 ? allProjects[(currentIndex + 1) % total] : null;
  const prevProject = total > 1 ? allProjects[(currentIndex - 1 + total) % total] : null;

  return (
    <ProjectDetailClient
      project={project}
      images={images}
      nextProject={nextProject}
      prevProject={prevProject}
      locale={locale}
      t={{
        backToProjects: t('projects.backToProjects'),
        nextProject: t('projects.nextProject'),
        prevProject: t('projects.prevProject'),
        yearLabel: t('projects.yearLabel'),
        locationLabel: t('projects.locationLabel'),
        categoryLabel: t('projects.categoryLabel'),
      }}
    />
  );
}
