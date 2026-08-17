import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';

export const proxy = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default proxy;

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)'],
};
