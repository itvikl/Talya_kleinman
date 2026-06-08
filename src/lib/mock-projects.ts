export type ProjectCategory = 'warm' | 'statement' | 'glamour';

export interface ProjectImage {
  url: string;
  altHe: string;
  altEn: string;
}

export interface MockProject {
  slug: string;
  category: ProjectCategory;
  year: number;
  areaSqm: number;
  locationHe: string;
  locationEn: string;
  titleHe: string;
  titleEn: string;
  descriptionHe: string;
  descriptionEn: string;
  coverImage: string;
  images: ProjectImage[];
}

const UNSPLASH = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const mockProjects: MockProject[] = [
  {
    slug: 'jerusalem-residence',
    category: 'warm',
    year: 2024,
    areaSqm: 145,
    locationHe: 'ירושלים',
    locationEn: 'Jerusalem',
    titleHe: 'דירת נופש ירושלמית',
    titleEn: 'Jerusalem Residence',
    descriptionHe:
      'דירת נופש בלב ירושלים, המשלבת חומריות חמה עם קווים נקיים. פאנלים מרופדים, עץ אלון בהיר ושיש דרמטי יוצרים אווירה של מלון בוטיק יוקרתי.',
    descriptionEn:
      'A vacation residence in the heart of Jerusalem, combining warm materiality with clean lines. Upholstered panels, light oak and dramatic marble create a refined boutique-hotel atmosphere.',
    coverImage: UNSPLASH('photo-1600585154340-be6161a56a0c'),
    images: [
      { url: UNSPLASH('photo-1600585154340-be6161a56a0c'), altHe: 'סלון', altEn: 'Living room' },
      { url: UNSPLASH('photo-1600210492486-724fe5c67fb0'), altHe: 'חדר שינה', altEn: 'Bedroom' },
      { url: UNSPLASH('photo-1600121848594-d8644e57abab'), altHe: 'מטבח', altEn: 'Kitchen' },
      { url: UNSPLASH('photo-1556909114-f6e7ad7d3136'), altHe: 'פינת אוכל', altEn: 'Dining' },
    ],
  },
  {
    slug: 'marble-statement-kitchen',
    category: 'statement',
    year: 2024,
    areaSqm: 210,
    locationHe: 'ירושלים',
    locationEn: 'Jerusalem',
    titleHe: 'מטבח שיש דרמטי',
    titleEn: 'Marble Statement Kitchen',
    descriptionHe:
      'אי מטבח עטוף בלוחות שיש מונוליתי, בקלאסטר תאורת קריסטל ופליז מוברש. דוגמה לעבודה בקנה מידה דרמטי, שבה החומר עצמו הוא הגיבור של החלל.',
    descriptionEn:
      'A monolithic marble-clad kitchen island, paired with a cluster of crystal and brushed-brass pendants. A study in dramatic scale, where the material itself becomes the protagonist.',
    coverImage: UNSPLASH('photo-1556909114-f6e7ad7d3136'),
    images: [
      { url: UNSPLASH('photo-1556909114-f6e7ad7d3136'), altHe: 'אי מטבח', altEn: 'Kitchen island' },
      { url: UNSPLASH('photo-1556909195-4e5d12877edf'), altHe: 'פרט פליז', altEn: 'Brass detail' },
      { url: UNSPLASH('photo-1600566753190-17f0baa2a6c3'), altHe: 'תאורה', altEn: 'Lighting' },
    ],
  },
  {
    slug: 'glamour-master-suite',
    category: 'glamour',
    year: 2023,
    areaSqm: 180,
    locationHe: 'תל אביב',
    locationEn: 'Tel Aviv',
    titleHe: 'סוויטה ראשית בסגנון גלאם',
    titleEn: 'Glamour Master Suite',
    descriptionHe:
      'חדר שינה ראשי וסלון פורמלי בלשון רומנטית-מודרנית. ראש מיטה מרופד בקטיפת שמפניה, טבעת קריסטל מעל, וריהוט מעוקל בפלטה מונוכרומטית.',
    descriptionEn:
      'A primary suite and formal lounge in a romantic-modern language. Champagne-velvet upholstered headboard, suspended crystal ring, and curvilinear furniture in a monochromatic palette.',
    coverImage: UNSPLASH('photo-1616594039964-ae9021a400a0'),
    images: [
      { url: UNSPLASH('photo-1616594039964-ae9021a400a0'), altHe: 'חדר שינה', altEn: 'Bedroom' },
      { url: UNSPLASH('photo-1618221195710-dd6b41faaea6'), altHe: 'סלון', altEn: 'Lounge' },
      { url: UNSPLASH('photo-1616137422495-1e9e46e2aa77'), altHe: 'פרט', altEn: 'Detail' },
    ],
  },
  {
    slug: 'penthouse-tel-aviv',
    category: 'statement',
    year: 2023,
    areaSqm: 260,
    locationHe: 'תל אביב',
    locationEn: 'Tel Aviv',
    titleHe: 'פנטהאוז תל אביבי',
    titleEn: 'Tel Aviv Penthouse',
    descriptionHe:
      'פנטהאוז המשקיף לים, עם דגש על קומפוזיציה ארכיטקטונית של חללים פתוחים, חומריות עשירה ותאורה פיסולית.',
    descriptionEn:
      'A sea-view penthouse with a focus on open-plan architectural composition, rich materiality and sculptural lighting.',
    coverImage: UNSPLASH('photo-1600607687939-ce8a6c25118c'),
    images: [
      { url: UNSPLASH('photo-1600607687939-ce8a6c25118c'), altHe: 'סלון', altEn: 'Living' },
      { url: UNSPLASH('photo-1600607688969-a5bfcd646154'), altHe: 'נוף', altEn: 'View' },
    ],
  },
  {
    slug: 'warm-family-home',
    category: 'warm',
    year: 2023,
    areaSqm: 220,
    locationHe: 'הרצליה',
    locationEn: 'Herzliya',
    titleHe: 'בית משפחתי חם',
    titleEn: 'Warm Family Home',
    descriptionHe:
      'בית למשפחה צעירה, עם חללים פתוחים, עץ טבעי וטקסטיל ביתי. חיבור בין יוקרה לפונקציונליות יומיומית.',
    descriptionEn:
      'A home for a young family with open spaces, natural wood and homely textiles. A balance between luxury and everyday function.',
    coverImage: UNSPLASH('photo-1600210491892-03d54c0aaf87'),
    images: [
      { url: UNSPLASH('photo-1600210491892-03d54c0aaf87'), altHe: 'סלון', altEn: 'Living' },
      { url: UNSPLASH('photo-1600585154363-67eb9e2e2099'), altHe: 'פינת אוכל', altEn: 'Dining' },
    ],
  },
  {
    slug: 'boutique-lounge',
    category: 'glamour',
    year: 2022,
    areaSqm: 95,
    locationHe: 'ירושלים',
    locationEn: 'Jerusalem',
    titleHe: 'סלון בוטיק',
    titleEn: 'Boutique Lounge',
    descriptionHe:
      'סלון פורמלי קטן, בעיצוב טרנזישנל. ספה מעוקלת, ציור קיר בעבודת יד וגופי תאורה כתכשיט.',
    descriptionEn:
      'A small formal lounge in a transitional style. Curved sofa, hand-painted feature wall and jewel-like lighting.',
    coverImage: UNSPLASH('photo-1618221195710-dd6b41faaea6'),
    images: [
      { url: UNSPLASH('photo-1618221195710-dd6b41faaea6'), altHe: 'סלון', altEn: 'Lounge' },
    ],
  },
];

export function getProject(slug: string) {
  return mockProjects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category?: ProjectCategory) {
  if (!category) return mockProjects;
  return mockProjects.filter((p) => p.category === category);
}
