import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export async function middleware(request: NextRequest) {
  // Handle internationalization first
  const response = intlMiddleware(request);
  
  // Then handle authentication (skip for public routes)
  const pathname = request.nextUrl.pathname
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.some(route => {
    const routeWithLocale = `/${defaultLocale}${route}`
    return pathname === route || 
           pathname === routeWithLocale ||
           pathname.startsWith(`/tr${route}`) ||
           pathname.startsWith(`/en${route}`)
  })

  if (!isPublicRoute) {
    // Update session for protected routes
    const authResponse = await updateSession(request)
    // Merge responses if needed
    if (authResponse.status !== 200) {
      return authResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
