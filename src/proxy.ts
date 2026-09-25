import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/i18n/config';
import { verifyAdminSessionToken } from '@/lib/auth';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Regex matches /en/admin, /de/admin, /es/admin and any sub-paths
const ADMIN_ROUTE_PATTERN = /^\/(en|de|es)\/admin(\/.*)?$/;
// The session cookie name must match auth.ts
const SESSION_COOKIE_NAME = 'golden_sun_admin_session';

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes at the server/edge level
  if (ADMIN_ROUTE_PATTERN.test(pathname)) {
    const sessionToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isAuthenticated = verifyAdminSessionToken(sessionToken);

    if (!isAuthenticated) {
      // Redirect to locale-prefixed admin page which shows the login UI
      const locale = pathname.split('/')[1] || defaultLocale;
      const loginUrl = new URL(`/${locale}/admin`, req.url);
      loginUrl.searchParams.set('auth', 'required');

      // If this IS already the /admin page root (not a sub-path), let it through
      // so the client-side AdminLogin component can render
      const isAdminRoot = pathname === `/${locale}/admin`;
      if (!isAdminRoot) {
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(en|de|es)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)'],
};
