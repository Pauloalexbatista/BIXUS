import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createOrder, getOrders, updateOrderStatus, validatePromoCode } from '@/lib/db';
import type { OrderItem, OrderStatus } from '@/types/bixus';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Erro ao carregar encomendas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (body.items || []) as OrderItem[];
    if (!body.customer_name || !body.customer_email || !body.customer_phone || items.length === 0) {
      return NextResponse.json({ error: 'Dados obrigatórios em falta' }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    let discount = 0;
    let appliedCode = '';

    if (body.promo_code) {
      const promo = await validatePromoCode(String(body.promo_code));
      if (promo) {
        appliedCode = promo.code;
        if (promo.discount_percent > 0) {
          discount = (subtotal * promo.discount_percent) / 100;
        } else if (promo.discount_fixed > 0) {
          discount = Math.min(subtotal, promo.discount_fixed);
        }
      }
    }

    const total = Math.max(0, Number((subtotal - discount).toFixed(2)));
    const order = await createOrder({
      customer_name: String(body.customer_name),
      customer_email: String(body.customer_email),
      customer_phone: String(body.customer_phone),
      customer_address: String(body.customer_address || ''),
      delivery_method: body.delivery_method || 'envio',
      notes: String(body.notes || ''),
      promo_code: appliedCode,
      discount_amount: Number(discount.toFixed(2)),
      total_amount: total,
      items,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Erro ao registar encomenda' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { id, status } = await request.json();
    const updated = await updateOrderStatus(Number(id), status as OrderStatus);
    if (!updated) return NextResponse.json({ error: 'Encomenda não encontrada' }, { status: 404 });
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error('PATCH /api/orders error:', err);
    return NextResponse.json({ error: 'Erro ao atualizar encomenda' }, { status: 500 });
  }
}
