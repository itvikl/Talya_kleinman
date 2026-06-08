import { AdminSidebar } from '@/components/admin/sidebar';
import { ProjectForm } from '@/components/admin/project-form';

export default function NewProjectPage() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-light text-neutral-100">New Project</h1>
          <p className="mt-1 text-xs text-neutral-500">Fill in the details below</p>
        </div>
        <ProjectForm />
      </main>
    </div>
  );
}
