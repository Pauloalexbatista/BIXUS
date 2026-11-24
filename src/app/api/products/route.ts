import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createProduct, deleteProduct, getProducts, updateProduct } from '@/lib/db';

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Erro ao carregar produtos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const slug =
      body.slug ||
      String(body.name || 'produto')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const created = await createProduct({
      name: String(body.name),
      slug,
      category: body.category || 'comida',
      animal: body.animal || 'ambos',
      price: Number(body.price || 0),
      promo_price: body.promo_price ? Number(body.promo_price) : null,
      unit_label: String(body.unit_label || 'unidade'),
      variants: Array.isArray(body.variants)
        ? body.variants
        : String(body.variants || '')
            .split(',')
            .map((v) => v.trim())
            .filter(Boolean),
      description: String(body.description || ''),
      ingredients: String(body.ingredients || ''),
      image: String(body.image || '/images/products/biscoito-osso-1.jpg'),
      featured: Boolean(body.featured),
      in_stock: body.in_stock === undefined ? true : Boolean(body.in_stock),
    });
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!id) return NextResponse.json({ error: 'ID em falta' }, { status: 400 });

    const updated = await updateProduct(id, {
      name: body.name,
      category: body.category,
      animal: body.animal,
      price: body.price !== undefined ? Number(body.price) : undefined,
      promo_price: body.promo_price === '' || body.promo_price === null ? null : body.promo_price !== undefined ? Number(body.promo_price) : undefined,
      unit_label: body.unit_label,
      variants: Array.isArray(body.variants)
        ? body.variants
        : typeof body.variants === 'string'
        ? body.variants.split(',').map((v: string) => v.trim()).filter(Boolean)
        : undefined,
      description: body.description,
      ingredients: body.ingredients,
      image: body.image,
      featured: body.featured,
      in_stock: body.in_stock,
    });
    if (!updated) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 });
    return NextResponse.json({ product: updated });
  } catch (err) {
    console.error('PUT /api/products error:', err);
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'ID em falta' }, { status: 400 });
    const ok = await deleteProduct(id);
    return NextResponse.json({ ok });
  } catch (err) {
    console.error('DELETE /api/products error:', err);
    return NextResponse.json({ error: 'Erro ao apagar produto' }, { status: 500 });
  }
}
