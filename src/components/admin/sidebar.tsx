'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FolderOpen, MessageSquare, LogOut, ExternalLink, Settings, Quote } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin',                label: 'Dashboard',     icon: LayoutGrid,    exact: true  },
  { href: '/admin/projects',       label: 'Projects',      icon: FolderOpen,    exact: false },
  { href: '/admin/testimonials',   label: 'Testimonials',  icon: Quote,         exact: false },
  { href: '/admin/leads',          label: 'Leads',         icon: MessageSquare, exact: false },
  { href: '/admin/site-settings',  label: 'Site Content',  icon: Settings,      exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex w-56 flex-col border-r border-cream-200 bg-cream-50">

      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-cream-200 px-5 py-6">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-brass/50">
          <span
            className="font-serif italic text-brass"
            style={{ fontSize: '1rem', fontFamily: 'var(--font-serif)' }}
          >
            TZ
          </span>
        </div>
        <div>
          <p
            className="text-[10px] uppercase tracking-[0.2em] text-ink/70"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Studio Admin
          </p>
          <p
            className="text-[9px] uppercase tracking-[0.15em] text-brass"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Talya Zaltsman
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-5 py-2.5 text-[10px] uppercase tracking-[0.15em] transition-colors duration-300',
                active
                  ? 'bg-cream-200/60 text-ink border-r-2 border-brass'
                  : 'text-ink/65 hover:text-ink/70 hover:bg-cream-200/30'
              )}
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              <Icon size={13} className={active ? 'text-brass' : 'text-ink/55'} strokeWidth={1.5} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-cream-200 py-3">
        <Link
          href="/he"
          target="_blank"
          className="flex items-center gap-3 px-5 py-2 text-[9px] uppercase tracking-[0.15em] text-ink/55 transition-colors hover:text-brass"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <ExternalLink size={11} />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-5 py-2 text-[9px] uppercase tracking-[0.15em] text-ink/50 transition-colors hover:text-red-400"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          <LogOut size={11} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
