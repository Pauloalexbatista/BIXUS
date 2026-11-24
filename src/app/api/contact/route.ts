import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Preenche todos os campos obrigatórios' }, { status: 400 });
    }
    console.log('[BIXUS Contact]', { name, email, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}
