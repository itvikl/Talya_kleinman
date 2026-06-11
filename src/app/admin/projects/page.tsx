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
      <main className="flex-1 p-10">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between border-b border-cream-200 pb-8">
          <div>
            <p
              className="mb-2 text-[9px] uppercase tracking-[0.3em] text-brass"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Studio Management
            </p>
            <h1
              className="font-serif font-light italic text-ink"
              style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontFamily: 'var(--font-serif)' }}
            >
              Projects
            </h1>
            <p
              className="mt-1 text-[9px] uppercase tracking-[0.2em] text-ink/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {projects.length} projects total
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 border border-ink/20 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ink/60 transition-all duration-500 hover:border-brass hover:text-brass"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            <Plus size={11} /> New Project
          </Link>
        </div>

        {/* Table */}
        <div className="border border-cream-200">

          {/* Table header */}
          <div className="grid grid-cols-[1fr_110px_70px_90px_180px] gap-4 border-b border-cream-200 bg-cream-200/40 px-5 py-3">
            {['Title', 'Category', 'Year', 'Status', 'Actions'].map((h) => (
              <span
                key={h}
                className="text-[9px] uppercase tracking-[0.2em] text-ink/60"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {h}
              </span>
            ))}
          </div>

          {!projects.length && (
            <div className="px-5 py-10 text-center">
              <p
                className="text-[10px] uppercase tracking-[0.2em] text-ink/55"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                No projects yet.{' '}
                <Link href="/admin/projects/new" className="text-brass hover:text-brass underline-offset-2 hover:underline">
                  Add the first one.
                </Link>
              </p>
            </div>
          )}

          {projects.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-[1fr_110px_70px_90px_180px] gap-4 items-center border-b border-cream-200/60 px-5 py-4 last:border-0 transition-colors hover:bg-cream-200/20"
            >
              <span
                className="truncate text-sm text-ink/90"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {project.title_en}
              </span>
              <span
                className="text-[10px] capitalize text-ink/65"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {project.category}
              </span>
              <span
                className="text-[10px] text-ink/65"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {project.year}
              </span>
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
