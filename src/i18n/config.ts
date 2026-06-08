export const locales = ['he', 'en'] as const;
export const defaultLocale = 'he' as const;
export type Locale = (typeof locales)[number];

export const localeDirection: Record<Locale, 'rtl' | 'ltr'> = {
  he: 'rtl',
  en: 'ltr',
};
