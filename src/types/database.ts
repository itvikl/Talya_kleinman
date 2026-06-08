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
  hero_image: string;
  hero_tagline_he: string;
  hero_tagline_en: string;
  home_about_body_he: string;
  home_about_body_en: string;
  about_image: string;
  about_body_he: string;
  about_body_en: string;
}
