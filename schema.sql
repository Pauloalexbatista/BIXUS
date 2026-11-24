-- BIXUS.PT PostgreSQL Schema
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('comida', 'roupa', '3d')),
    animal TEXT NOT NULL CHECK (animal IN ('cao', 'gato', 'ambos')),
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
