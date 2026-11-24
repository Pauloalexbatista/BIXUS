import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@bixus.pt').trim().toLowerCase();
    const expectedPassword = (process.env.ADMIN_PASSWORD || 'bixusadmin2026').trim();

    if (String(email || '').trim().toLowerCase() === expectedEmail && password === expectedPassword) {
      const token = signToken(`admin:${expectedEmail}:${Date.now()}`);
      const response = NextResponse.json({ ok: true, email: expectedEmail });
      response.cookies.set(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return NextResponse.json({ ok: false, error: 'Credenciais inválidas' }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false, error: 'Pedido inválido' }, { status: 400 });
  }
}
