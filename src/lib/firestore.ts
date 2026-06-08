import { adminDb } from './firebase-admin';
import type { DbProject, DbProjectImage, DbLead, InsertLead, SiteSettings } from '@/types/database';

const SETTINGS_DOC = 'main';

const DEFAULT_SETTINGS: SiteSettings = {
  hero_image: '',
  hero_tagline_he: 'החללים שאנו חיים בהם, והדברים שאנו מקיפים את עצמנו בהם, משפיעים ישירות על חיינו',
  hero_tagline_en: 'The spaces we inhabit shape the way we live.',
  home_about_body_he: 'סטודיו לאדריכלות ועיצוב פנים המתמחה בדירות יוקרה. כל פרויקט מתוכנן בקפידה תוך התייחסות לאופי הלקוח, החלל והאור.',
  home_about_body_en: 'A studio for interior architecture specialising in luxury residences. Every project is carefully designed around the client, the space, and the light.',
  about_image: '',
  about_body_he: 'טליה זלצמן היא אדריכלית פנים בעלת ניסיון רב בעיצוב דירות יוקרה. הסטודיו שלה מתמקד ביצירת חללים מאופקים ויוקרתיים, המשלבים חומרים אמיתיים ופרטים מדויקים.',
  about_body_en: 'Talya Zaltsman is an interior architect with extensive experience in luxury residential design. The studio focuses on creating restrained yet luxurious spaces, combining authentic materials and precise details.',
};

// ── Site Settings ─────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await adminDb().collection('site_settings').doc(SETTINGS_DOC).get();
  if (!doc.exists) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...doc.data() } as SiteSettings;
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<void> {
  await adminDb()
    .collection('site_settings')
    .doc(SETTINGS_DOC)
    .set(data, { merge: true });
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function getProjects(): Promise<DbProject[]> {
  const snap = await adminDb().collection('projects').get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DbProject))
    .filter((p) => p.published)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getAllProjects(): Promise<DbProject[]> {
  const snap = await adminDb().collection('projects').get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DbProject))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getProjectBySlug(slug: string): Promise<DbProject | null> {
  const snap = await adminDb()
    .collection('projects')
    .where('slug', '==', slug)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as DbProject;
}

export async function getProjectById(id: string): Promise<DbProject | null> {
  const doc = await adminDb().collection('projects').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as DbProject;
}

export async function createProject(data: Omit<DbProject, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const now = new Date().toISOString();
  const ref = await adminDb().collection('projects').add({ ...data, created_at: now, updated_at: now });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<DbProject>): Promise<void> {
  // set+merge is safer than update() — works even if some fields are missing
  await adminDb().collection('projects').doc(id).set(
    { ...data, updated_at: new Date().toISOString() },
    { merge: true }
  );
}

export async function deleteProject(id: string): Promise<void> {
  // Delete sub-collection images first
  const images = await adminDb().collection('project_images').where('project_id', '==', id).get();
  const batch = adminDb().batch();
  images.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(adminDb().collection('projects').doc(id));
  await batch.commit();
}

// ── Project Images ────────────────────────────────────────────────────────────

export async function getProjectImages(projectId: string): Promise<DbProjectImage[]> {
  const snap = await adminDb()
    .collection('project_images')
    .where('project_id', '==', projectId)
    .get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DbProjectImage))
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function addProjectImage(image: Omit<DbProjectImage, 'id' | 'created_at'>): Promise<string> {
  const ref = await adminDb()
    .collection('project_images')
    .add({ ...image, created_at: new Date().toISOString() });
  return ref.id;
}

export async function deleteProjectImage(id: string): Promise<void> {
  await adminDb().collection('project_images').doc(id).delete();
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function createLead(data: InsertLead): Promise<string> {
  const ref = await adminDb().collection('leads').add({
    ...data,
    status: 'new',
    source: 'contact_form',
    created_at: new Date().toISOString(),
  });
  return ref.id;
}

export async function getLeads(): Promise<DbLead[]> {
  const snap = await adminDb().collection('leads').orderBy('created_at', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as DbLead));
}

export async function updateLeadStatus(id: string, status: DbLead['status']): Promise<void> {
  await adminDb().collection('leads').doc(id).update({ status });
}
