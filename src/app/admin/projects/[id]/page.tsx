import { notFound } from 'next/navigation';
import { getProjectById, getProjectImages } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { ProjectForm } from '@/components/admin/project-form';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, images] = await Promise.all([
    getProjectById(id),
    getProjectImages(id),
  ]);

  if (!project) notFound();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-light text-neutral-100">Edit Project</h1>
          <p className="mt-1 text-xs text-neutral-500">{project.title_en}</p>
        </div>
        <ProjectForm projectId={project.id} initialData={project} initialImages={images} />
      </main>
    </div>
  );
}
