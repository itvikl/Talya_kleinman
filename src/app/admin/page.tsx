import { getAllProjects, getLeads } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { FolderOpen, MessageSquare, Eye, Plus, ArrowUpRight } from 'lucide-react';

export default async function AdminDashboard() {
  const [projects, leads] = await Promise.all([getAllProjects(), getLeads()]);

  const publishedCount = projects.filter((p) => p.published).length;
  const draftCount     = projects.filter((p) => !p.published).length;
  const newLeadsCount  = leads.filter((l) => l.status === 'new').length;
  const recentLeads    = leads.slice(0, 3);

  const stats = [
    { label: 'Total Projects', value: projects.length, sub: `${draftCount} drafts`,  icon: FolderOpen    },
    { label: 'Published',      value: publishedCount,  sub: 'live on site',           icon: Eye           },
    { label: 'New Leads',      value: newLeadsCount,   sub: 'awaiting reply',         icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto p-10">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between border-b border-cream-200 pb-8">
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
              Dashboard
            </h1>
          </div>
          <a
            href="/admin/projects/new"
            className="flex items-center gap-2 border border-ink/20 px-5 py-2.5 text-[9px] uppercase tracking-[0.2em] text-ink/60 transition-all duration-500 hover:border-brass hover:text-brass"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            <Plus size={11} />
            New Project
          </a>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-10">
          {stats.map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="border border-cream-200 bg-cream-50 p-6 transition-all hover:border-brass/50">
              <div className="mb-5 flex items-center justify-between">
                <p
                  className="text-[9px] uppercase tracking-[0.25em] text-ink/60"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {label}
                </p>
                <Icon size={13} className="text-brass/70" strokeWidth={1.5} />
              </div>
              <p
                className="font-serif font-light text-ink"
                style={{ fontSize: '3rem', lineHeight: 1, fontFamily: 'var(--font-serif)' }}
              >
                {value}
              </p>
              <p
                className="mt-2 text-[9px] uppercase tracking-[0.15em] text-ink/55"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {sub}
              </p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Quick Actions */}
          <div className="border border-cream-200 bg-cream-50 p-6">
            <p
              className="mb-5 text-[9px] uppercase tracking-[0.25em] text-ink/60"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Quick Actions
            </p>
            <div className="space-y-1">
              {[
                { href: '/admin/projects/new',  label: 'Add new project'   },
                { href: '/admin/leads',          label: 'Review new leads'  },
                { href: '/admin/site-settings',  label: 'Edit site content' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="group flex items-center justify-between py-3 text-[10px] uppercase tracking-[0.15em] text-ink/65 transition-colors hover:text-brass border-b border-cream-200 last:border-0"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-px w-5 bg-current transition-all duration-500 group-hover:w-8" />
                    {label}
                  </span>
                  <ArrowUpRight size={11} className="opacity-30 transition-opacity group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          {/* Recent Leads */}
          <div className="border border-cream-200 bg-cream-50 p-6">
            <div className="mb-5 flex items-center justify-between">
              <p
                className="text-[9px] uppercase tracking-[0.25em] text-ink/60"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Recent Leads
              </p>
              <a
                href="/admin/leads"
                className="text-[9px] uppercase tracking-[0.15em] text-brass/80 transition-colors hover:text-brass"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                View all →
              </a>
            </div>
            {recentLeads.length === 0 ? (
              <p
                className="py-8 text-center text-[10px] uppercase tracking-[0.2em] text-ink/50"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                No leads yet
              </p>
            ) : (
              <div className="space-y-0 divide-y divide-cream-200">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-4 py-3">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-brass/20 font-serif italic text-brass"
                      style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}
                    >
                      {lead.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {lead.name}
                      </p>
                      <p
                        className="text-[9px] uppercase tracking-[0.1em] text-ink/60 mt-0.5"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                      >
                        {lead.phone}
                      </p>
                    </div>
                    {lead.status === 'new' && (
                      <span
                        className="flex-shrink-0 border border-brass/50 px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] text-brass/70"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                      >
                        New
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="mt-8 text-center">
          <a
            href="/he"
            target="_blank"
            className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-ink/50 transition-colors hover:text-brass"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            <ArrowUpRight size={10} />
            View live site
          </a>
        </div>

      </main>
    </div>
  );
}
