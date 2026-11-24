import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { createEvent, deleteEvent, getEvents, toggleEventActive } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get('all') === '1';
    const events = await getEvents(!all);
    return NextResponse.json({ events });
  } catch (err) {
    console.error('GET /api/events error:', err);
    return NextResponse.json({ error: 'Erro ao carregar eventos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const created = await createEvent({
      title: String(body.title),
      location: String(body.location),
      event_date: String(body.event_date),
      end_date: body.end_date ? String(body.end_date) : null,
      description: String(body.description || ''),
      link: String(body.link || ''),
      active: body.active === undefined ? true : Boolean(body.active),
    });
    return NextResponse.json({ event: created }, { status: 201 });
  } catch (err) {
    console.error('POST /api/events error:', err);
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { id, active } = await request.json();
    const ok = await toggleEventActive(Number(id), Boolean(active));
    return NextResponse.json({ ok });
  } catch (err) {
    console.error('PATCH /api/events error:', err);
    return NextResponse.json({ error: 'Erro ao atualizar evento' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));
    const ok = await deleteEvent(id);
    return NextResponse.json({ ok });
  } catch (err) {
    console.error('DELETE /api/events error:', err);
    return NextResponse.json({ error: 'Erro ao apagar evento' }, { status: 500 });
  }
}
