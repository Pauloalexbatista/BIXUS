import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createPromotion, deletePromotion, getPromotions, validatePromoCode } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    if (code) {
      const promo = await validatePromoCode(code);
      if (!promo) return NextResponse.json({ valid: false }, { status: 404 });
      return NextResponse.json({ valid: true, promotion: promo });
    }
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const promotions = await getPromotions();
    return NextResponse.json({ promotions });
  } catch (err) {
    console.error('GET /api/promotions error:', err);
    return NextResponse.json({ error: 'Erro ao consultar promoções' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const created = await createPromotion({
      code: String(body.code),
      description: String(body.description || ''),
      discount_percent: Number(body.discount_percent || 0),
      discount_fixed: Number(body.discount_fixed || 0),
      active: body.active === undefined ? true : Boolean(body.active),
      expires_at: body.expires_at ? String(body.expires_at) : null,
    });
    return NextResponse.json({ promotion: created }, { status: 201 });
  } catch (err) {
    console.error('POST /api/promotions error:', err);
    return NextResponse.json({ error: 'Erro ao criar promoção' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const ok = await deletePromotion(id);
    return NextResponse.json({ ok });
  } catch (err) {
    console.error('DELETE /api/promotions error:', err);
    return NextResponse.json({ error: 'Erro ao apagar promoção' }, { status: 500 });
  }
}
