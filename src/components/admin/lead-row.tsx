'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DbLead, LeadStatus } from '@/types/database';

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'text-amber-400',
  read: 'text-blue-400',
  replied: 'text-emerald-500',
  archived: 'text-ink/60',
};

const STATUS_OPTIONS: LeadStatus[] = ['new', 'read', 'replied', 'archived'];

export function LeadRow({ lead }: { lead: DbLead }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const router = useRouter();

  async function handleStatusChange(next: LeadStatus) {
    setStatus(next);
    await fetch(`/api/admin/leads/${lead.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  const date = new Date(lead.created_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: '2-digit',
  });

  return (
    <div className="grid grid-cols-[180px_160px_1fr_120px_110px] gap-4 items-start border-b border-cream-200 px-5 py-4 last:border-0 hover:bg-cream-100">
      <div>
        <p className="text-sm text-ink">{lead.name}</p>
        {lead.email && <p className="mt-0.5 text-[11px] text-ink/65">{lead.email}</p>}
      </div>
      <a href={`tel:${lead.phone}`} className="text-sm text-ink/60 hover:text-ink">{lead.phone}</a>
      <p className="text-sm text-ink/65 line-clamp-2">{lead.message || '—'}</p>
      <p className="text-[11px] text-ink/60">{date}</p>
      <select
        value={status}
        onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
        className={`bg-transparent text-[11px] uppercase tracking-wider outline-none cursor-pointer ${STATUS_COLORS[status]}`}
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s} className="bg-cream-50 text-ink">
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
