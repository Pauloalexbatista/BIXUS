import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import type { BixusEvent, Order, OrderItem, OrderStatus, Product, Promotion } from '@/types/bixus';
import { SEED_EVENTS, SEED_PRODUCTS, SEED_PROMOTIONS } from './seed';

interface LocalDbStore {
  products: Product[];
  orders: Order[];
  events: BixusEvent[];
  promotions: Promotion[];
  newsletter: { id: number; email: string; created_at: string }[];
  counters: {
    products: number;
    orders: number;
    events: number;
    promotions: number;
    newsletter: number;
  };
}

let pool: Pool | null = null;
let pgInitialized = false;

function hasPostgres(): boolean {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.trim().length > 0);
}

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

async function ensurePgSchema() {
  if (pgInitialized || !hasPostgres()) return;
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      category TEXT NOT NULL,
      animal TEXT NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      promo_price NUMERIC(10, 2),
      unit_label TEXT DEFAULT 'unidade',
      variants JSONB DEFAULT '[]'::jsonb,
      description TEXT DEFAULT '',
      ingredients TEXT DEFAULT '',
      image TEXT DEFAULT '/images/products/biscoito-osso-1.jpg',
      featured BOOLEAN DEFAULT false,
      in_stock BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number TEXT NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT DEFAULT '',
      delivery_method TEXT NOT NULL DEFAULT 'envio',
      notes TEXT DEFAULT '',
      promo_code TEXT DEFAULT '',
      discount_amount NUMERIC(10, 2) DEFAULT 0,
      total_amount NUMERIC(10, 2) NOT NULL,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      status TEXT NOT NULL DEFAULT 'pendente',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      location TEXT NOT NULL,
      event_date DATE NOT NULL,
      end_date DATE,
      description TEXT DEFAULT '',
      link TEXT DEFAULT '',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS promotions (
      id SERIAL PRIMARY KEY,
      code TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      discount_percent NUMERIC(5, 2) DEFAULT 0,
      discount_fixed NUMERIC(10, 2) DEFAULT 0,
      active BOOLEAN DEFAULT true,
      expires_at DATE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  const countRes = await p.query('SELECT COUNT(*)::int AS cnt FROM products');
  if (countRes.rows[0].cnt === 0) {
    for (const item of SEED_PRODUCTS) {
      await p.query(
        `INSERT INTO products (name, slug, category, animal, price, promo_price, unit_label, variants, description, ingredients, image, featured, in_stock)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13)
         ON CONFLICT (slug) DO NOTHING`,
        [
          item.name,
          item.slug,
          item.category,
          item.animal,
          item.price,
          item.promo_price ?? null,
          item.unit_label,
          JSON.stringify(item.variants),
          item.description,
          item.ingredients ?? '',
          item.image,
          item.featured,
          item.in_stock,
        ]
      );
    }
    for (const ev of SEED_EVENTS) {
      await p.query(
        `INSERT INTO events (title, location, event_date, end_date, description, link, active)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [ev.title, ev.location, ev.event_date, ev.end_date ?? null, ev.description, ev.link ?? '', ev.active]
      );
    }
    for (const pr of SEED_PROMOTIONS) {
      await p.query(
        `INSERT INTO promotions (code, description, discount_percent, discount_fixed, active, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (code) DO NOTHING`,
        [pr.code, pr.description, pr.discount_percent, pr.discount_fixed, pr.active, pr.expires_at ?? null]
      );
    }
  }
  pgInitialized = true;
}

const LOCAL_DB_PATH = path.join(process.cwd(), '.data', 'bixus-db.json');

function readLocalDb(): LocalDbStore {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
    const now = new Date().toISOString();
    const initial: LocalDbStore = {
      products: SEED_PRODUCTS.map((p, idx) => ({ ...p, id: idx + 1, created_at: now })),
      orders: [],
      events: SEED_EVENTS.map((e, idx) => ({ ...e, id: idx + 1, created_at: now })),
      promotions: SEED_PROMOTIONS.map((pr, idx) => ({ ...pr, id: idx + 1, created_at: now })),
      newsletter: [],
      counters: {
        products: SEED_PRODUCTS.length,
        orders: 0,
        events: SEED_EVENTS.length,
        promotions: SEED_PROMOTIONS.length,
        newsletter: 0,
      },
    };
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }
  return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8')) as LocalDbStore;
}

function writeLocalDb(data: LocalDbStore) {
  fs.mkdirSync(path.dirname(LOCAL_DB_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    category: row.category as Product['category'],
    animal: row.animal as Product['animal'],
    price: Number(row.price),
    promo_price: row.promo_price !== null && row.promo_price !== undefined ? Number(row.promo_price) : null,
    unit_label: String(row.unit_label || 'unidade'),
    variants: Array.isArray(row.variants) ? (row.variants as string[]) : [],
    description: String(row.description || ''),
    ingredients: String(row.ingredients || ''),
    image: String(row.image || '/images/products/biscoito-osso-1.jpg'),
    featured: Boolean(row.featured),
    in_stock: row.in_stock === undefined ? true : Boolean(row.in_stock),
    created_at: String(row.created_at || new Date().toISOString()),
  };
}

export async function getProducts(): Promise<Product[]> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('SELECT * FROM products ORDER BY featured DESC, id DESC');
    return res.rows.map(normalizeProduct);
  }
  const db = readLocalDb();
  return [...db.products].sort((a, b) => Number(b.featured) - Number(a.featured) || b.id - a.id);
}

export async function createProduct(input: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query(
      `INSERT INTO products (name, slug, category, animal, price, promo_price, unit_label, variants, description, ingredients, image, featured, in_stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13) RETURNING *`,
      [
        input.name,
        input.slug,
        input.category,
        input.animal,
        input.price,
        input.promo_price ?? null,
        input.unit_label,
        JSON.stringify(input.variants || []),
        input.description,
        input.ingredients ?? '',
        input.image,
        input.featured,
        input.in_stock,
      ]
    );
    return normalizeProduct(res.rows[0]);
  }
  const db = readLocalDb();
  db.counters.products += 1;
  const created: Product = { ...input, id: db.counters.products, created_at: new Date().toISOString() };
  db.products.unshift(created);
  writeLocalDb(db);
  return created;
}

export async function updateProduct(id: number, input: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const existing = await getPool().query('SELECT * FROM products WHERE id=$1', [id]);
    if (existing.rows.length === 0) return null;
    const cur = normalizeProduct(existing.rows[0]);
    const merged = { ...cur, ...input };
    const res = await getPool().query(
      `UPDATE products SET name=$1, slug=$2, category=$3, animal=$4, price=$5, promo_price=$6, unit_label=$7, variants=$8::jsonb, description=$9, ingredients=$10, image=$11, featured=$12, in_stock=$13 WHERE id=$14 RETURNING *`,
      [
        merged.name,
        merged.slug,
        merged.category,
        merged.animal,
        merged.price,
        merged.promo_price ?? null,
        merged.unit_label,
        JSON.stringify(merged.variants || []),
        merged.description,
        merged.ingredients ?? '',
        merged.image,
        merged.featured,
        merged.in_stock,
        id,
      ]
    );
    return normalizeProduct(res.rows[0]);
  }
  const db = readLocalDb();
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  db.products[idx] = { ...db.products[idx], ...input };
  writeLocalDb(db);
  return db.products[idx];
}

export async function deleteProduct(id: number): Promise<boolean> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('DELETE FROM products WHERE id=$1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const db = readLocalDb();
  const before = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  writeLocalDb(db);
  return db.products.length < before;
}

export async function getOrders(): Promise<Order[]> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('SELECT * FROM orders ORDER BY id DESC');
    return res.rows.map((r) => ({
      ...r,
      id: Number(r.id),
      discount_amount: Number(r.discount_amount),
      total_amount: Number(r.total_amount),
      items: Array.isArray(r.items) ? r.items : [],
    }));
  }
  const db = readLocalDb();
  return [...db.orders].sort((a, b) => b.id - a.id);
}

export async function createOrder(input: {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  delivery_method: Order['delivery_method'];
  notes: string;
  promo_code: string;
  discount_amount: number;
  total_amount: number;
  items: OrderItem[];
}): Promise<Order> {
  const orderNumber = `BIX-${Date.now().toString().slice(-6)}`;
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query(
      `INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, customer_address, delivery_method, notes, promo_code, discount_amount, total_amount, items, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11::jsonb,'pendente') RETURNING *`,
      [
        orderNumber,
        input.customer_name,
        input.customer_email,
        input.customer_phone,
        input.customer_address,
        input.delivery_method,
        input.notes,
        input.promo_code,
        input.discount_amount,
        input.total_amount,
        JSON.stringify(input.items),
      ]
    );
    const r = res.rows[0];
    return { ...r, id: Number(r.id), discount_amount: Number(r.discount_amount), total_amount: Number(r.total_amount) };
  }
  const db = readLocalDb();
  db.counters.orders += 1;
  const created: Order = {
    id: db.counters.orders,
    order_number: orderNumber,
    ...input,
    status: 'pendente',
    created_at: new Date().toISOString(),
  };
  db.orders.unshift(created);
  writeLocalDb(db);
  return created;
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order | null> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, id]);
    if (res.rows.length === 0) return null;
    const r = res.rows[0];
    return { ...r, id: Number(r.id), discount_amount: Number(r.discount_amount), total_amount: Number(r.total_amount) };
  }
  const db = readLocalDb();
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) return null;
  db.orders[idx].status = status;
  writeLocalDb(db);
  return db.orders[idx];
}

export async function getEvents(onlyActive = false): Promise<BixusEvent[]> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const sql = onlyActive
      ? 'SELECT * FROM events WHERE active=true ORDER BY event_date ASC'
      : 'SELECT * FROM events ORDER BY event_date ASC';
    const res = await getPool().query(sql);
    return res.rows.map((r) => ({
      ...r,
      id: Number(r.id),
      event_date: r.event_date instanceof Date ? r.event_date.toISOString().slice(0, 10) : String(r.event_date),
      end_date: r.end_date ? (r.end_date instanceof Date ? r.end_date.toISOString().slice(0, 10) : String(r.end_date)) : null,
    }));
  }
  const db = readLocalDb();
  const list = onlyActive ? db.events.filter((e) => e.active) : db.events;
  return [...list].sort((a, b) => a.event_date.localeCompare(b.event_date));
}

export async function createEvent(input: Omit<BixusEvent, 'id' | 'created_at'>): Promise<BixusEvent> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query(
      `INSERT INTO events (title, location, event_date, end_date, description, link, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [input.title, input.location, input.event_date, input.end_date || null, input.description, input.link || '', input.active]
    );
    const r = res.rows[0];
    return {
      ...r,
      id: Number(r.id),
      event_date: r.event_date instanceof Date ? r.event_date.toISOString().slice(0, 10) : String(r.event_date),
    };
  }
  const db = readLocalDb();
  db.counters.events += 1;
  const created: BixusEvent = { ...input, id: db.counters.events, created_at: new Date().toISOString() };
  db.events.push(created);
  writeLocalDb(db);
  return created;
}

export async function deleteEvent(id: number): Promise<boolean> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('DELETE FROM events WHERE id=$1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const db = readLocalDb();
  const before = db.events.length;
  db.events = db.events.filter((e) => e.id !== id);
  writeLocalDb(db);
  return db.events.length < before;
}

export async function toggleEventActive(id: number, active: boolean): Promise<boolean> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('UPDATE events SET active=$1 WHERE id=$2', [active, id]);
    return (res.rowCount ?? 0) > 0;
  }
  const db = readLocalDb();
  const ev = db.events.find((e) => e.id === id);
  if (!ev) return false;
  ev.active = active;
  writeLocalDb(db);
  return true;
}

export async function getPromotions(): Promise<Promotion[]> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('SELECT * FROM promotions ORDER BY id DESC');
    return res.rows.map((r) => ({
      ...r,
      id: Number(r.id),
      discount_percent: Number(r.discount_percent),
      discount_fixed: Number(r.discount_fixed),
    }));
  }
  const db = readLocalDb();
  return [...db.promotions].sort((a, b) => b.id - a.id);
}

export async function validatePromoCode(code: string): Promise<Promotion | null> {
  const clean = code.trim().toUpperCase();
  if (!clean) return null;
  const promos = await getPromotions();
  const found = promos.find((p) => p.code.toUpperCase() === clean && p.active);
  if (!found) return null;
  if (found.expires_at && found.expires_at < new Date().toISOString().slice(0, 10)) {
    return null;
  }
  return found;
}

export async function createPromotion(input: Omit<Promotion, 'id' | 'created_at'>): Promise<Promotion> {
  const code = input.code.trim().toUpperCase();
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query(
      `INSERT INTO promotions (code, description, discount_percent, discount_fixed, active, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [code, input.description, input.discount_percent, input.discount_fixed, input.active, input.expires_at || null]
    );
    const r = res.rows[0];
    return { ...r, id: Number(r.id), discount_percent: Number(r.discount_percent), discount_fixed: Number(r.discount_fixed) };
  }
  const db = readLocalDb();
  db.counters.promotions += 1;
  const created: Promotion = { ...input, code, id: db.counters.promotions, created_at: new Date().toISOString() };
  db.promotions.unshift(created);
  writeLocalDb(db);
  return created;
}

export async function deletePromotion(id: number): Promise<boolean> {
  if (hasPostgres()) {
    await ensurePgSchema();
    const res = await getPool().query('DELETE FROM promotions WHERE id=$1', [id]);
    return (res.rowCount ?? 0) > 0;
  }
  const db = readLocalDb();
  const before = db.promotions.length;
  db.promotions = db.promotions.filter((p) => p.id !== id);
  writeLocalDb(db);
  return db.promotions.length < before;
}

export async function addNewsletterSubscriber(email: string): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean) return;
  if (hasPostgres()) {
    await ensurePgSchema();
    await getPool().query('INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO NOTHING', [clean]);
    return;
  }
  const db = readLocalDb();
  if (!db.newsletter.some((n) => n.email === clean)) {
    db.counters.newsletter += 1;
    db.newsletter.push({ id: db.counters.newsletter, email: clean, created_at: new Date().toISOString() });
    writeLocalDb(db);
  }
}
