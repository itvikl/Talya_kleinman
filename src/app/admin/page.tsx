import { getAllProjects, getLeads } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { FolderOpen, MessageSquare, Eye } from 'lucide-react';

export default async function AdminDashboard() {
  const [projects, leads] = await Promise.all([getAllProjects(), getLeads()]);

  const publishedCount = projects.filter((p) => p.published).length;
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: FolderOpen },
    { label: 'Published', value: publishedCount, icon: Eye },
    { label: 'New Leads', value: newLeadsCount, icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-light text-neutral-100">Dashboard</h1>
          <p className="mt-1 text-xs text-neutral-500">Talya Zaltsman Studio</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="border border-neutral-800 bg-neutral-900 p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500">{label}</span>
                <Icon size={14} className="text-neutral-600" />
              </div>
              <p className="font-serif text-4xl font-light text-neutral-100">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="mb-4 text-[11px] uppercase tracking-widest text-neutral-500">Quick Actions</h2>
          <div className="flex gap-3">
            <a href="/admin/projects/new"
              className="border border-neutral-700 px-5 py-2.5 text-[11px] uppercase tracking-wider text-neutral-300 transition-colors hover:border-white hover:text-white">
              + New Project
            </a>
            <a href="/en" target="_blank" rel="noopener noreferrer"
              className="border border-neutral-800 px-5 py-2.5 text-[11px] uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-300">
              View Site ↗
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
