-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Categories
create table if not exists categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  added_by_id  text not null,
  is_listed    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Products
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text,
  description  text not null default '',
  images       text[]    not null default '{}',
  colors       text[]    not null default '{}',
  sizes        text[]    not null default '{}',
  price        numeric   not null check (price >= 0),
  stock        integer   not null default 0,
  sold         integer   not null default 0,
  weight       numeric,
  category_id  uuid references categories(id) on delete set null,
  added_by_id  text not null,
  is_listed    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_listed   on products(is_listed);

-- Rates
create table if not exists rates (
  id          uuid primary key default gen_random_uuid(),
  country     text not null,
  currency    text not null,
  naira_rate  numeric not null check (naira_rate > 0),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Orders
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  user_id           text not null,
  address           text not null,
  phone_number      text not null,
  status            text not null default 'pending'
                      check (status in ('pending','processing','shipped','delivered','cancelled','paid')),
  reference         text unique default concat('FORGE-', upper(substring(gen_random_uuid()::text,1,10))),
  total_cost        numeric not null default 0,
  stripe_session_id text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index if not exists idx_orders_user on orders(user_id);

-- Order items
create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references orders(id) on delete cascade,
  product_id  uuid references products(id) on delete set null,
  quantity    integer not null check (quantity > 0),
  color       text not null default '',
  size        text not null default '',
  price       numeric not null,
  created_at  timestamptz not null default now()
);
create index if not exists idx_order_items_order on order_items(order_id);

-- RLS
alter table categories  enable row level security;
alter table products    enable row level security;
alter table rates       enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

create policy "Public read products"   on products   for select using (is_listed = true);
create policy "Public read categories" on categories for select using (is_listed = true);
create policy "Public read rates"      on rates      for select using (true);
