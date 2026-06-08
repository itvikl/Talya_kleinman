import Link from 'next/link';
import { getAllProjects } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { ProjectActions } from '@/components/admin/project-actions';
import { Plus } from 'lucide-react';

export default async function AdminProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-light text-neutral-100">Projects</h1>
            <p className="mt-1 text-xs text-neutral-500">{projects.length} projects total</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 border border-neutral-700 px-4 py-2 text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white hover:text-white"
          >
            <Plus size={12} /> New Project
          </Link>
        </div>

        <div className="border border-neutral-800">
          {/* Header */}
          <div className="grid grid-cols-[1fr_110px_70px_90px_180px] gap-4 border-b border-neutral-800 bg-neutral-900 px-5 py-3">
            {['Title', 'Category', 'Year', 'Status', 'Actions'].map((h) => (
              <span key={h} className="text-[10px] uppercase tracking-widest text-neutral-500">{h}</span>
            ))}
          </div>

          {!projects.length && (
            <div className="px-5 py-10 text-center text-sm text-neutral-600">
              No projects yet.{' '}
              <Link href="/admin/projects/new" className="text-neutral-400 underline">
                Add the first one.
              </Link>
            </div>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-[1fr_110px_70px_90px_180px] gap-4 items-center border-b border-neutral-800/50 px-5 py-4 last:border-0 hover:bg-neutral-900/50"
            >
              <span className="truncate text-sm text-neutral-200">{project.title_en}</span>
              <span className="text-[11px] capitalize text-neutral-500">{project.category}</span>
              <span className="text-[11px] text-neutral-500">{project.year}</span>
              <ProjectActions
                projectId={project.id}
                published={project.published}
                title={project.title_en}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
