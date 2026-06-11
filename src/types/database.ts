export type ProjectCategory = 'warm' | 'statement' | 'glamour';
export type LeadStatus = 'new' | 'read' | 'replied' | 'archived';

export interface DbProject {
  id: string;
  slug: string;
  category: ProjectCategory;
  year: number;
  area_sqm: number | null;
  location_he: string;
  location_en: string;
  title_he: string;
  title_en: string;
  description_he: string;
  description_en: string;
  cover_image: string;
  before_image?: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTestimonial {
  id: string;
  text_he: string;
  text_en: string;
  name: string;
  project_title_he?: string;
  project_title_en?: string;
  sort_order: number;
  published: boolean;
}

export interface DbProjectImage {
  id: string;
  project_id: string;
  url: string;
  alt_he: string;
  alt_en: string;
  sort_order: number;
  created_at: string;
}

export interface DbLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: LeadStatus;
  source: string;
  created_at: string;
}

export type InsertLead = Pick<DbLead, 'name' | 'phone'> & {
  email?: string | null;
  message?: string | null;
};

export interface Project extends DbProject {
  images: DbProjectImage[];
}

export interface SiteSettings {
  // Hero
  hero_image: string;
  hero_tagline_he: string;
  hero_tagline_en: string;
  // Home — About quote
  home_about_body_he: string;
  home_about_body_en: string;
  // About page
  about_image: string;
  about_body_he: string;
  about_body_en: string;
  // Contact info (shared across contact page, footer)
  contact_phone: string;
  contact_email: string;
  contact_instagram: string;
  contact_address_he: string;
  contact_address_en: string;
  contact_hours1_he: string;
  contact_hours1_en: string;
  contact_hours2_he: string;
  contact_hours2_en: string;
  // Footer
  footer_quote_he: string;
  footer_quote_en: string;
  // Marquee strip
  marquee_he: string;
  marquee_en: string;
  // Stats (home page)
  stat_projects: number;
  stat_years: number;
  stat_cities: number;
  stat_clients: number;
  // Work process steps (4 steps)
  wp1_title_he: string; wp1_title_en: string; wp1_desc_he: string; wp1_desc_en: string;
  wp2_title_he: string; wp2_title_en: string; wp2_desc_he: string; wp2_desc_en: string;
  wp3_title_he: string; wp3_title_en: string; wp3_desc_he: string; wp3_desc_en: string;
  wp4_title_he: string; wp4_title_en: string; wp4_desc_he: string; wp4_desc_en: string;
  // Before/After pairs (2 pairs)
  ba1_before_url: string; ba1_after_url: string;
  ba1_title_he: string; ba1_title_en: string;
  ba1_meta_he: string; ba1_meta_en: string;
  ba2_before_url: string; ba2_after_url: string;
  ba2_title_he: string; ba2_title_en: string;
  ba2_meta_he: string; ba2_meta_en: string;
}
