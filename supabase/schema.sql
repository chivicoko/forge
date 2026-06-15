-- ─────────────────────────────────────────────────────────────────────────────
-- FORGE — Full Database Schema
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── TABLES ──────────────────────────────────────────────────────────────────

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  added_by_id  text        NOT NULL,
  is_listed    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  slug         text,
  description  text        NOT NULL DEFAULT '',
  images       text[]      NOT NULL DEFAULT '{}',
  colors       text[]      NOT NULL DEFAULT '{}',
  sizes        text[]      NOT NULL DEFAULT '{}',
  price        numeric     NOT NULL CHECK (price >= 0),
  stock        integer     NOT NULL DEFAULT 0,
  sold         integer     NOT NULL DEFAULT 0,
  weight       numeric,
  category_id  uuid        REFERENCES categories(id) ON DELETE SET NULL,
  added_by_id  text        NOT NULL,
  is_listed    boolean     NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_listed   ON products(is_listed);

-- Exchange rates
CREATE TABLE IF NOT EXISTS rates (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  country     text        NOT NULL,
  currency    text        NOT NULL,
  naira_rate  numeric     NOT NULL CHECK (naira_rate > 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           text        NOT NULL,
  address           text        NOT NULL,
  phone_number      text        NOT NULL,
  status            text        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending','processing','shipped','delivered','cancelled','paid')),
  reference         text        UNIQUE DEFAULT concat('FORGE-', upper(substring(gen_random_uuid()::text, 1, 10))),
  total_cost        numeric     NOT NULL DEFAULT 0,
  stripe_session_id text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  uuid        REFERENCES products(id) ON DELETE SET NULL,
  quantity    integer     NOT NULL CHECK (quantity > 0),
  color       text        NOT NULL DEFAULT '',
  size        text        NOT NULL DEFAULT '',
  price       numeric     NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);


-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key) — API routes use service role key which bypasses RLS
CREATE POLICY "Public read products"   ON products   FOR SELECT USING (is_listed = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_listed = true);
CREATE POLICY "Public read rates"      ON rates      FOR SELECT USING (true);


-- ─── FUNCTIONS ────────────────────────────────────────────────────────────────

-- Safely decrements product stock and increments sold counter after a paid order.
-- Called by the Stripe webhook handler via supabaseAdmin.rpc('decrement_stock', ...)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET
    stock = GREATEST(0, stock - p_quantity),
    sold  = sold + p_quantity,
    updated_at = now()
  WHERE id = p_product_id;
END;
$$;


-- ─── STORAGE ──────────────────────────────────────────────────────────────────
-- After running this SQL, go to:
--   Supabase Dashboard → Storage → New bucket
--   Name: product-images
--   Public: YES (toggle on)
-- Then add this upload policy in Storage → product-images → Policies:
--   Policy name: "Authenticated users can upload"
--   Allowed operation: INSERT
--   Target roles: authenticated