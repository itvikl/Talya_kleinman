import { getT } from '@/lib/translations';
import { getProjects } from '@/lib/firestore';
import { ProjectsGrid } from '@/components/sections/projects-grid';

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
  const projects = await getProjects();

  return (
    <div className="container-editorial pt-24 pb-20 md:pt-40 md:pb-32">
      <header className="mb-12 max-w-3xl md:mb-20">
        <p className="text-eyebrow mb-4">— {t('projects.subtitle')}</p>
        <h1 className="text-display text-5xl md:text-7xl">{t('projects.title')}</h1>
      </header>
      <ProjectsGrid projects={projects} locale={locale} />
    </div>
  );
}
