import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acesso livre a assets estáticos, API e página de desbloqueio /acesso
  if (
    pathname.startsWith('/acesso') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Se SITE_PREVIEW_PASSWORD estiver definida, exigir desbloqueio para pré-visualização
  const previewPassword = process.env.SITE_PREVIEW_PASSWORD?.trim();
  if (previewPassword) {
    const hasAccess = request.cookies.get('bixus_preview_auth')?.value === 'granted';
    if (!hasAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/acesso';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
