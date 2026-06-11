import { adminDb } from './firebase-admin';
import type { DbProject, DbProjectImage, DbLead, DbTestimonial, InsertLead, SiteSettings } from '@/types/database';

const SETTINGS_DOC = 'main';

export const DEFAULT_SETTINGS: SiteSettings = {
  hero_image: '',
  hero_tagline_he: 'החללים שאנו חיים בהם, והדברים שאנו מקיפים את עצמנו בהם, משפיעים ישירות על חיינו',
  hero_tagline_en: 'The spaces we inhabit shape the way we live.',
  home_about_body_he: 'סטודיו לאדריכלות ועיצוב פנים המתמחה בדירות יוקרה. כל פרויקט מתוכנן בקפידה תוך התייחסות לאופי הלקוח, החלל והאור.',
  home_about_body_en: 'A studio for interior architecture specialising in luxury residences. Every project is carefully designed around the client, the space, and the light.',
  about_image: '',
  about_body_he: 'טליה זלצמן היא אדריכלית פנים בעלת ניסיון רב בעיצוב דירות יוקרה. הסטודיו שלה מתמקד ביצירת חללים מאופקים ויוקרתיים, המשלבים חומרים אמיתיים ופרטים מדויקים.',
  about_body_en: 'Talya Zaltsman is an interior architect with extensive experience in luxury residential design. The studio focuses on creating restrained yet luxurious spaces, combining authentic materials and precise details.',
  contact_phone: '+972 50-123-4567',
  contact_email: 'studio@talyazaltsman.com',
  contact_instagram: 'https://www.instagram.com/talya_zaltsman_interiors/',
  contact_address_he: 'ירושלים, ישראל',
  contact_address_en: 'Jerusalem, Israel',
  contact_hours1_he: 'א׳–ה׳: 9:00–18:00',
  contact_hours1_en: 'Sun–Thu: 9:00–18:00',
  contact_hours2_he: 'ו׳: 9:00–14:00',
  contact_hours2_en: 'Fri: 9:00–14:00',
  footer_quote_he: '"החללים שאנו חיים בהם, משפיעים ישירות על חיינו."',
  footer_quote_en: '"The spaces we live in directly shape our lives."',
  marquee_he: 'אדריכלות פנים · עיצוב יוקרה · ירושלים · תל אביב · מאז 2009 · טליה זלצמן · ',
  marquee_en: 'Interior Architecture · Luxury Residences · Jerusalem · Tel Aviv · Est. 2009 · Talya Zaltsman · ',
  stat_projects: 80,
  stat_years: 15,
  stat_cities: 3,
  stat_clients: 98,
  wp1_title_he: 'פגישת היכרות', wp1_title_en: 'Initial Meeting',
  wp1_desc_he: 'נפגשים, מדברים על החלום שלכם, הצרכים, התקציב והלוח זמנים. הבסיס לכל פרויקט מוצלח.',
  wp1_desc_en: 'We meet, talk about your vision, needs, budget and timeline. The foundation of every successful project.',
  wp2_title_he: 'תכנון ועיצוב', wp2_title_en: 'Design & Planning',
  wp2_desc_he: 'תוכניות אדריכליות, בחירת חומרים, הדמיות תלת-מימד — עד שהחזון הופך למוחשי ומדויק.',
  wp2_desc_en: 'Architectural plans, material selection, 3D renderings — until the vision becomes tangible and precise.',
  wp3_title_he: 'ליווי ביצוע', wp3_title_en: 'Execution Support',
  wp3_desc_he: 'עובדים מול קבלנים וספקים, משגיחים על כל פרט, מוודאים שהתכנון יוצא לפועל בדיוק כמתוכנן.',
  wp3_desc_en: 'Working with contractors and suppliers, overseeing every detail, ensuring the design is executed as planned.',
  wp4_title_he: 'מסירה', wp4_title_en: 'Handover',
  wp4_desc_he: 'הפרויקט מוכן. מסירת החלל המעוצב — כשכל דבר במקומו, וכל פרט מושלם.',
  wp4_desc_en: 'The project is complete. Handing over the designed space — everything in place, every detail perfect.',
  ba1_before_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80',
  ba1_after_url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1400&q=80',
  ba1_title_he: 'מטבח — ירושלים', ba1_title_en: 'Kitchen — Jerusalem',
  ba1_meta_he: '2024 · 145 מ"ר', ba1_meta_en: '2024 · 145 sqm',
  ba2_before_url: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=1400&q=80',
  ba2_after_url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=80',
  ba2_title_he: 'סוויטה ראשית — תל אביב', ba2_title_en: 'Master Suite — Tel Aviv',
  ba2_meta_he: '2023 · 180 מ"ר', ba2_meta_en: '2023 · 180 sqm',
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

// ── Testimonials ──────────────────────────────────────────────────────────────

export async function getTestimonials(): Promise<DbTestimonial[]> {
  const snap = await adminDb().collection('testimonials').get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DbTestimonial))
    .filter((t) => t.published)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function getAllTestimonials(): Promise<DbTestimonial[]> {
  const snap = await adminDb().collection('testimonials').get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as DbTestimonial))
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

export async function createTestimonial(
  data: Omit<DbTestimonial, 'id'>
): Promise<string> {
  const ref = await adminDb().collection('testimonials').add(data);
  return ref.id;
}

export async function updateTestimonial(
  id: string,
  data: Partial<Omit<DbTestimonial, 'id'>>
): Promise<void> {
  await adminDb().collection('testimonials').doc(id).set(data, { merge: true });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await adminDb().collection('testimonials').doc(id).delete();
}
