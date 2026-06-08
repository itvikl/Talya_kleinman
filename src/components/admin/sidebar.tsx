'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutGrid, FolderOpen, MessageSquare, LogOut, ExternalLink, Settings } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/admin/projects', label: 'Projects', icon: FolderOpen },
  { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
  { href: '/admin/site-settings', label: 'Site Content', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut(getFirebaseAuth());
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex w-56 flex-col border-r border-neutral-800 bg-neutral-900">
      <div className="flex items-center gap-3 border-b border-neutral-800 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center border border-neutral-700 text-neutral-300">
          <span className="font-serif text-xs tracking-tight">TZ</span>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-300">Admin</p>
          <p className="text-[10px] text-neutral-600">Studio Panel</p>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-5 py-2.5 text-xs uppercase tracking-wider transition-colors',
                active ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-800 p-4 space-y-1">
        <Link
          href="/he"
          target="_blank"
          className="flex w-full items-center gap-3 px-1 py-2 text-xs uppercase tracking-wider text-neutral-500 transition-colors hover:text-neutral-200"
        >
          <ExternalLink size={14} />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-1 py-2 text-xs uppercase tracking-wider text-neutral-600 transition-colors hover:text-neutral-400"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
