import { getLeads } from '@/lib/firestore';
import { AdminSidebar } from '@/components/admin/sidebar';
import { LeadRow } from '@/components/admin/lead-row';

export default async function AdminLeadsPage() {
  const leads = await getLeads();
  const newCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl font-light text-neutral-100">Leads</h1>
          <p className="mt-1 text-xs text-neutral-500">
            {newCount > 0 ? `${newCount} new` : 'No new leads'} · {leads.length} total
          </p>
        </div>

        <div className="border border-neutral-800">
          <div className="grid grid-cols-[180px_160px_1fr_120px_110px] gap-4 border-b border-neutral-800 bg-neutral-900 px-5 py-3">
            {['Name', 'Phone', 'Message', 'Date', 'Status'].map((h) => (
              <span key={h} className="text-[10px] uppercase tracking-widest text-neutral-500">{h}</span>
            ))}
          </div>

          {!leads.length && (
            <div className="px-5 py-10 text-center text-sm text-neutral-600">No leads yet.</div>
          )}

          {leads.map((lead) => <LeadRow key={lead.id} lead={lead} />)}
        </div>
      </main>
    </div>
  );
}
