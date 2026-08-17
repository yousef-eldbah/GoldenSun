import { Locale } from '@/types';

export const locales: Locale[] = ['en', 'de', 'es'];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English (US/UK)',
  de: 'Deutsch (Germany)',
  es: 'Español (Spain)',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  de: '🇩🇪',
  es: '🇪🇸',
};
