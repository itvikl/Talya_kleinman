import { getSiteSettings } from '@/lib/firestore';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';
import { AdminSidebar } from '@/components/admin/sidebar';

export const dynamic = 'force-dynamic';

export default async function SiteSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="font-serif text-2xl font-light text-neutral-100">Site Content</h1>
          <p className="mt-1 text-xs text-neutral-500">ניהול תוכן המסך הראשי ועמוד האודות</p>
        </header>

        <SiteSettingsForm initialSettings={settings} />
      </main>
    </div>
  );
}
