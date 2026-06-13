# ⬡ FORGE — Premium Men's Bodywear

A production-ready Next.js 16 e-commerce app for premium men's bodywear.

## Tech Stack

| Layer        | Technology                 |
| ------------ | -------------------------- |
| Framework    | Next.js 16 (App Router)    |
| Auth         | Clerk                      |
| Database     | Supabase (PostgreSQL)      |
| Storage      | Supabase Storage           |
| Payments     | Stripe Checkout            |
| Styling      | Tailwind CSS v4 + Radix UI |
| State        | Zustand (cart + prefs)     |
| Server state | TanStack Query v5          |
| Forms        | React Hook Form + Zod      |
| Charts       | Recharts                   |
| PWA          | Custom service worker      |

## Features

- 🛒 **Shopping** — browse, filter, search, add to cart, checkout
- 💳 **Stripe Checkout** — hosted payment with webhook confirmation
- 🔐 **Clerk Auth** — sign-in/sign-up modal, protected routes
- 🌙 **Dark/Light mode** — system preference + toggle
- 🌍 **Multi-currency** — configurable exchange rates
- 📦 **Order tracking** — per-user order history
- 🖥 **Admin dashboard** — inventory, orders, categories, rates, stats
- 📱 **PWA** — installable, offline cache for static pages
- ♿ **Accessible** — skip-to-content, ARIA labels, focus rings
- 🔎 **SEO** — metadata, OG tags, canonical URLs, robots

## Setup

### 1. Clone & install

\`\`\`bash
git clone <repo>
cd forge
npm install
\`\`\`

### 2. Environment variables

Copy `.env.local` and fill in your keys:
\`\`\`bash
cp .env.local .env.local.local
\`\`\`

| Variable                             | Where to get it                                                 |
| ------------------------------------ | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase Dashboard → Settings → API                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Supabase Dashboard → Settings → API                             |
| `SUPABASE_SERVICE_ROLE_KEY`          | Supabase Dashboard → Settings → API                             |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`  | Clerk Dashboard → API Keys                                      |
| `CLERK_SECRET_KEY`                   | Clerk Dashboard → API Keys                                      |
| `STRIPE_SECRET_KEY`                  | Stripe Dashboard → Developers → API keys                        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys                        |
| `STRIPE_WEBHOOK_SECRET`              | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |

### 3. Supabase database

Run `supabase/schema.sql` in the Supabase SQL editor.

Create a **Storage bucket** named `product-images` (set to public).

### 4. Stripe webhook (local dev)

\`\`\`bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
\`\`\`

### 5. Dev server

\`\`\`bash
npm run dev
\`\`\`

## Project structure

\`\`\`
forge/
├── app/
│ ├── (site)/ # Public storefront
│ │ ├── page.tsx # Home
│ │ ├── store/ # Product listing + detail
│ │ ├── featured/ # Featured collection
│ │ ├── checkout/ # Checkout form
│ │ ├── order-tracking/
│ │ └── payments/ # Success / failure
│ ├── (auth)/ # Clerk sign-in / sign-up
│ ├── (dashboard)/ # Admin dashboard
│ └── api/ # BFF API routes
├── components/
│ ├── home/ # Storefront sections
│ ├── layout/ # Navbar, footer, providers
│ ├── dashboard/ # Admin sidebar + navbar
│ └── ui/ # Radix-based primitives
├── stores/ # Zustand stores
├── lib/ # Supabase, Stripe, API helpers
├── hooks/ # Re-exported Clerk hooks
├── types/ # Shared TypeScript types
└── supabase/
└── schema.sql # Database schema
\`\`\`

## Deploying to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add all env variables from `.env.local`
4. Set Stripe webhook endpoint to `https://your-domain.com/api/webhooks/stripe`
