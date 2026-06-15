# ⬡ FORGE — Premium Men's Bodywear

A production-ready full-stack e-commerce app for premium men's bodywear, built with Next.js 16, Supabase, Clerk, Stripe, and EmailJS.

---

## Tech Stack

| Layer        | Technology                                 |
| ------------ | ------------------------------------------ |
| Framework    | Next.js 16 (App Router, Turbopack)         |
| Language     | TypeScript 5                               |
| Auth         | Clerk v6                                   |
| Database     | Supabase (PostgreSQL)                      |
| Storage      | Supabase Storage                           |
| Payments     | Stripe Checkout                            |
| Email        | EmailJS (client-side transactional)        |
| Styling      | Tailwind CSS v4 + Radix UI primitives      |
| Global state | Zustand v5 (cart + preferences, persisted) |
| Server state | TanStack Query v5                          |
| Forms        | React Hook Form + Zod                      |
| Charts       | Recharts                                   |
| Animations   | react-countup, react-fast-marquee          |
| PWA          | Custom service worker                      |

---

## Features

- 🛒 **Storefront** — browse, filter by category, search, sort, add to cart with live quantity stepper
- 💳 **Stripe Checkout** — hosted payment page, webhook confirms order and decrements stock
- 📧 **Email notifications** — order confirmation and payment failure emails via EmailJS
- 🔐 **Clerk Auth** — Google OAuth + email, modal sign-in, protected routes via proxy middleware
- 🌙 **Dark / Light mode** — system preference + manual toggle, persisted
- 🌍 **Multi-currency** — configurable exchange rates (NGN base, convert to USD/GBP/EUR etc.)
- 📦 **Order tracking** — per-user order history with status badges
- 🖥 **Admin dashboard** — inventory management, order management, categories, rates, revenue charts
- 📷 **Image uploads** — product images uploaded to Supabase Storage, served via custom loader
- 📱 **PWA** — installable, service worker caches static pages for offline use
- ♿ **Accessible** — skip-to-content, ARIA labels, keyboard navigation, focus rings
- 🔎 **SEO** — per-page metadata, Open Graph tags, canonical URLs, robots

---

## Prerequisites

Make sure you have these installed before starting:

- **Node.js** ≥ 20 — [nodejs.org](https://nodejs.org)
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **Stripe CLI** (for local webhook testing) — [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
- **Git**

Accounts you need (all free tiers work):

- [Supabase](https://supabase.com) — database + storage
- [Clerk](https://clerk.com) — authentication
- [Stripe](https://stripe.com) — payments
- [EmailJS](https://emailjs.com) — transactional email

---

## Local Setup — Step by Step

### 1. Clone and install

```bash
git clone <your-repo-url>
cd forge
pnpm install --network-timeout 300000
```

> If pnpm install times out on a slow connection, retry with `pnpm install --network-timeout 300000` or use `npm install --legacy-peer-deps`.

---

### 2. Environment variables

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local   # if example exists, otherwise create manually
```

Paste this into `.env.local` and fill in each value (instructions below the table):

```env
# ─── Supabase ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─── Clerk ────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# ─── Stripe ───────────────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ─── EmailJS ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID=template_...
NEXT_PUBLIC_EMAILJS_ORDER_FAILURE_TEMPLATE_ID=template_...

# ─── App ──────────────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3. Supabase setup

#### 3a. Create a project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose a name, region, and strong database password → **Create project**
3. Wait ~2 minutes for provisioning

#### 3b. Get your API keys

Dashboard → **Settings** → **API**

- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this secret, never expose client-side

#### 3c. Run the database schema

Dashboard → **SQL Editor** → **New query** → paste the entire contents of `supabase/schema.sql` → **Run**

This creates:

- `categories`, `products`, `rates`, `orders`, `order_items` tables
- All indexes
- Row Level Security policies
- `decrement_stock()` function (called by Stripe webhook after payment)

#### 3d. Create the storage bucket

Dashboard → **Storage** → **New bucket**

- **Name:** `product-images`
- **Public bucket:** ✅ ON
- Click **Save**

Then add an upload policy so authenticated users can upload images:

Dashboard → **Storage** → `product-images` → **Policies** → **New policy**

Choose **"For full customization"** and paste:

```sql
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

#### 3e. Enable automatic RLS (recommended)

Dashboard → **Settings** → **Database** → scroll to **Row Level Security** → tick **"Enable RLS on new tables"**

---

### 4. Clerk setup

#### 4a. Create an application

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com) → **Create application**
2. Name it **Forge**
3. Enable **Email** and **Google** sign-in → **Create application**

#### 4b. Get your keys

Clerk Dashboard → **API Keys**

- Copy **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Copy **Secret key** → `CLERK_SECRET_KEY`

#### 4c. Google OAuth (optional but recommended)

Clerk Dashboard → **Configure** → **SSO Connections** → **Google**

In development, Clerk provides shared Google credentials — it works out of the box with no extra setup. For production, you'll need your own Google Cloud OAuth credentials.

#### 4d. Allowed redirect URLs

Clerk Dashboard → **Configure** → **Paths**

These should already match what's in `.env.local`:

- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`

---

### 5. Stripe setup

#### 5a. Get API keys

[dashboard.stripe.com](https://dashboard.stripe.com) → **Developers** → **API keys**

- Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy **Secret key** → `STRIPE_SECRET_KEY`

#### 5b. Local webhook (required for order confirmation to work)

Install the Stripe CLI if you haven't:

```bash
# Ubuntu / Debian
curl -s --compressed "https://packages.stripe.dev/api/deb/webhook/conf/stripe-debhelper.gpg" \
  | sudo gpg --dearmor -o /usr/share/keyrings/stripe.gpg
echo 'deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/api/deb/webhook stable main' \
  | sudo tee /etc/apt/sources.list.d/stripe.list
sudo apt update && sudo apt install stripe

# macOS
brew install stripe/stripe-cli/stripe
```

Log in and start forwarding (run this in a **separate terminal** while `pnpm dev` is running):

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the **webhook signing secret** it prints (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

#### 5c. Test card

Use this card to test payments — no real money is charged:

```
Card number:   4242 4242 4242 4242
Expiry:        Any future date (e.g. 12/29)
CVC:           Any 3 digits
Name / email:  Anything
```

---

### 6. EmailJS setup

#### 6a. Create an account

[emailjs.com](https://emailjs.com) → Sign up (free tier: 200 emails/month)

#### 6b. Add an email service

Dashboard → **Email Services** → **Add New Service** → choose **Gmail** (or your provider) → connect your account → **Create Service**

Copy the **Service ID** → `NEXT_PUBLIC_EMAILJS_SERVICE_ID`

#### 6c. Get your public key

Dashboard → **Account** → **General** → copy **Public Key** → `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

#### 6d. Create the order confirmation template

Dashboard → **Email Templates** → **Create New Template**

- **Subject:** `Order Confirmed — {{order_reference}} | FORGE`
- **To Email:** `{{to_email}}`
- **To Name:** `{{to_name}}`
- **Content:** paste the HTML from `supabase/emailjs-order-confirmation-template.html`

Save → copy **Template ID** → `NEXT_PUBLIC_EMAILJS_ORDER_CONFIRMATION_TEMPLATE_ID`

Variables used by this template:
| Variable | Value |
|---|---|
| `{{to_name}}` | Customer's first name |
| `{{to_email}}` | Customer's email address |
| `{{order_reference}}` | e.g. `FORGE-A1B2C3D4E5` |
| `{{order_address}}` | Delivery address |
| `{{order_total}}` | e.g. `₦91,875` |
| `{{order_items}}` | e.g. `3 items` |
| `{{tracking_url}}` | Link to order tracking page |

#### 6e. Create the payment failure template

Dashboard → **Email Templates** → **Create New Template**

- **Subject:** `Payment Issue — {{order_reference}} | FORGE`
- **To Email:** `{{to_email}}`
- **Content:** paste the HTML from `supabase/emailjs-order-failure-template.html`

Save → copy **Template ID** → `NEXT_PUBLIC_EMAILJS_ORDER_FAILURE_TEMPLATE_ID`

Variables used:
| Variable | Value |
|---|---|
| `{{to_name}}` | Customer's first name |
| `{{to_email}}` | Customer's email |
| `{{order_reference}}` | Order reference |
| `{{retry_url}}` | Link back to checkout |

---

### 7. Run the dev server

Open **two terminals**:

**Terminal 1 — Next.js:**

```bash
pnpm dev
```

**Terminal 2 — Stripe webhook listener:**

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
forge/
├── app/
│   ├── (site)/                   # Public storefront
│   │   ├── page.tsx              # Home page
│   │   ├── store/                # Product listing + detail
│   │   ├── featured/             # Featured collection
│   │   ├── checkout/             # Checkout form + Stripe redirect
│   │   ├── order-tracking/       # Per-user order history
│   │   └── payments/
│   │       ├── success/          # Post-payment confirmation + EmailJS trigger
│   │       └── failure/          # Payment failure + EmailJS trigger
│   ├── (auth)/
│   │   ├── sign-in/              # Clerk sign-in page
│   │   └── sign-up/              # Clerk sign-up page
│   ├── (dashboard)/              # Admin dashboard (auth-protected)
│   │   └── dashboard/
│   │       ├── page.tsx          # Overview with charts
│   │       ├── inventory/        # Product CRUD + image upload
│   │       ├── categories/       # Category management
│   │       ├── orders/           # Order management + status updates
│   │       ├── rates/            # Exchange rate management
│   │       └── notifications/    # Pending order alerts
│   └── api/                      # BFF API routes (server-only)
│       ├── products/             # GET, POST, PATCH, DELETE
│       ├── categories/           # GET, POST, DELETE
│       ├── rates/                # GET, POST, DELETE
│       ├── orders/               # GET (user), POST (create + Stripe session)
│       ├── orders/[id]/          # GET (single order), PATCH (status)
│       ├── orders/all/           # GET (admin — all orders)
│       ├── upload/               # POST (image → Supabase Storage)
│       └── webhooks/stripe/      # POST (Stripe events → mark paid, decrement stock)
├── components/
│   ├── home/                     # Storefront UI sections
│   ├── layout/                   # Navbar, Footer, Providers, Ribbon, SW register
│   ├── dashboard/                # Admin sidebar + navbar
│   └── ui/                       # Radix UI primitive wrappers (Button, Input, etc.)
├── lib/
│   ├── api.ts                    # TanStack Query options + fetch helpers
│   ├── supabase.ts               # Supabase client (server-only)
│   ├── stripe.ts                 # Stripe client + createStripeCheckoutSession()
│   ├── emailjs.ts                # EmailJS send helpers
│   └── utils.ts                  # cn(), getCurrencySymbol(), formatPrice()
├── stores/
│   ├── useCartStore.ts           # Zustand cart (persisted to localStorage)
│   └── useUserPrefs.ts           # Zustand prefs (currency rate selection)
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
├── public/
│   ├── sw.js                     # Service worker (PWA)
│   └── manifest.json             # PWA manifest
└── supabase/
    ├── schema.sql                # Full DB schema + RLS + functions (run this first)
    └── decrement_stock.sql       # Standalone copy of the stock function
```

---

## Database Schema

Full SQL to run in **Supabase SQL Editor → New query**. This is the complete schema including all tables, indexes, RLS policies, and the stock decrement function.

```sql
-- ─────────────────────────────────────────────────────────────────────────────
-- FORGE — Full Database Schema
-- ─────────────────────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products"   ON products   FOR SELECT USING (is_listed = true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (is_listed = true);
CREATE POLICY "Public read rates"      ON rates      FOR SELECT USING (true);

-- ─── Functions ────────────────────────────────────────────────────────────────

-- Safely decrements product stock and increments sold counter
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET
    stock      = GREATEST(0, stock - p_quantity),
    sold       = sold + p_quantity,
    updated_at = now()
  WHERE id = p_product_id;
END;
$$;
```

---

## How It Works — Key Flows

### Checkout & Payment

1. User fills delivery details on `/checkout` → clicks Pay
2. POST `/api/orders` creates an order in Supabase with status `pending`, then creates a Stripe Checkout session
3. User is redirected to Stripe's hosted checkout page
4. On success, Stripe redirects to `/payments/success?order_id=...`
5. The Stripe CLI (dev) / webhook endpoint (prod) receives `checkout.session.completed`
6. `/api/webhooks/stripe` marks the order `paid` and decrements product stock via `decrement_stock()`
7. The success page fetches the order details and sends an order confirmation email via EmailJS

### Image Upload

1. Admin picks an image on the add/edit product page
2. POST `/api/upload` receives the file, uploads it to Supabase Storage (`product-images` bucket)
3. Returns the public URL which is stored in `products.images[]`
4. Images are served via a custom Next.js image loader that appends Supabase transform params (`?width=&quality=&resize=`) — this bypasses Next.js's image proxy (which has SSRF restrictions on Supabase's IPv6 CDN IPs) while still getting optimized images

### Auth

- All routes are public by default
- `proxy.ts` (Next.js middleware) uses Clerk to protect only `/dashboard/*`, `/checkout/*`, and `/order-tracking/*`
- API routes use `await auth()` from `@clerk/nextjs/server` to verify session
- Supabase operations in API routes use `supabaseAdmin` (service role key) which bypasses RLS

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/forge.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Root directory: leave as-is

### 3. Add environment variables

In Vercel project → **Settings** → **Environment Variables**, add every variable from your `.env.local` — but change:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app   # or your custom domain
```

### 4. Set up Stripe production webhook

Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**

- URL: `https://your-domain.vercel.app/api/webhooks/stripe`
- Events to listen for: `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`
- Copy the **Signing secret** → update `STRIPE_WEBHOOK_SECRET` in Vercel env vars

### 5. Switch to live keys (when ready)

Replace all `pk_test_` / `sk_test_` Stripe keys with `pk_live_` / `sk_live_` versions in Vercel env vars.

---

## Common Issues

| Problem                              | Fix                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` times out             | Run `pnpm install --network-timeout 300000` or use `npm install --legacy-peer-deps`                                    |
| `ERR_PNPM_IGNORED_BUILDS` on install | This is a warning, not an error — install succeeded. Or add `only-built-dependencies[]=@clerk/shared` etc. to `.npmrc` |
| Images not loading (SSRF error)      | Ensure `next.config.ts` uses `loader: "custom"` with `loaderFile: "./lib/supabase-image-loader.ts"`                    |
| `useUser` outside ClerkProvider      | Restart dev server — stale module cache issue                                                                          |
| Stripe webhook 400                   | Make sure `stripe listen` is running in a separate terminal and `STRIPE_WEBHOOK_SECRET` matches                        |
| Orders stuck on `pending`            | Webhook isn't receiving events — check `stripe listen` is running                                                      |
| Email not sending                    | Check EmailJS template variable names match exactly, and `NEXT_PUBLIC_EMAILJS_*` vars are set                          |
| Dashboard redirects to sign-in       | Expected — dashboard requires auth. Sign in first                                                                      |

---

## Admin Dashboard Access

The dashboard at `/dashboard` is protected — you must be signed in. Any signed-in user can access it in development. For production, add a check in the dashboard layout to restrict by user ID or Clerk organization role.

---

## License

MIT
