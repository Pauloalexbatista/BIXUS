import { NextResponse } from 'next/server';
import { PREVIEW_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const expected = process.env.SITE_PREVIEW_PASSWORD?.trim();

    if (!expected || password === expected) {
      const response = NextResponse.json({ ok: true });
      response.cookies.set(PREVIEW_COOKIE_NAME, 'granted', {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 14,
      });
      return response;
    }

    return NextResponse.json({ ok: false, error: 'Password incorreta' }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Pedido inválido' }, { status: 400 });
  }
}
