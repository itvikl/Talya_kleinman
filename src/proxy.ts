import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin routes: verify session cookie exists ────────────────────────────
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const session = request.cookies.get('__session')?.value;

    if (!session && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (session && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    return NextResponse.next();
  }

  // ── Public routes: i18n locale routing ───────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
