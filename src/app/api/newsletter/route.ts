import { NextResponse } from 'next/server';
import { addNewsletterSubscriber } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !String(email).includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }
    await addNewsletterSubscriber(String(email));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao subscrever' }, { status: 500 });
  }
}
