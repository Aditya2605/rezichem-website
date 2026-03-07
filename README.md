# Rezichem Healthcare

A production-ready pharmaceutical company website built with **Next.js 14**, **React**, **Tailwind CSS**, and **Framer Motion**.

[![CI](https://github.com/YOUR-USERNAME/rezichem-healthcare/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR-USERNAME/rezichem-healthcare/actions/workflows/ci.yml)
[![Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://rezichem.vercel.app)

---

## Table of Contents

- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [GitHub Setup](#github-setup)
- [Vercel Deployment](#vercel-deployment)
- [Database Setup](#database-setup-postgresql)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Extending the Project](#extending-the-project)

---

## Local Development

The app ships with **in-memory mock data** — no database needed to get started.

```bash
# 1. Clone the repo
git clone https://github.com/YOUR-USERNAME/rezichem-healthcare.git
cd rezichem-healthcare

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env.local

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site is live.

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | Run ESLint |
| `npm run db:seed` | Seed the PostgreSQL database |

---

## Project Structure

```
rezichem-healthcare/
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml               # Lint + build on every push & PR
│   │   └── deploy.yml           # Auto-deploy to Vercel on merge to main
│   └── PULL_REQUEST_TEMPLATE.md
│
├── public/
│   └── downloads/               # Place PDFs here
│       ├── company-brochure.pdf
│       └── product-catalogue.pdf
│
├── scripts/
│   ├── schema.sql               # PostgreSQL schema (run once)
│   └── seed.js                  # Seed script: node scripts/seed.js
│
├── src/
│   ├── app/                     # Next.js App Router pages & API routes
│   │   ├── layout.tsx           # Root layout — Header + Footer on every page
│   │   ├── page.tsx             # Home page
│   │   ├── about/
│   │   ├── careers/
│   │   ├── contact/
│   │   ├── products/
│   │   │   ├── page.tsx                      # Category grid + search
│   │   │   └── [category]/
│   │   │       ├── page.tsx                  # Products in a category
│   │   │       └── [product]/page.tsx        # Product detail page
│   │   ├── admin/               # Admin portal
│   │   │   ├── layout.tsx       # Sidebar layout
│   │   │   ├── page.tsx         # Dashboard
│   │   │   ├── products/        # List, add, edit, delete products
│   │   │   └── categories/      # List, add, edit, delete categories
│   │   ├── api/
│   │   │   ├── search/route.ts          # GET /api/search?q=
│   │   │   ├── categories/route.ts      # GET /api/categories, POST
│   │   │   └── products/
│   │   │       ├── route.ts             # GET /api/products, POST
│   │   │       └── [id]/route.ts        # GET, PUT, DELETE by ID
│   │   ├── sitemap.ts           # Auto-generates /sitemap.xml
│   │   └── robots.ts            # Auto-generates /robots.txt
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       # Sticky header, global search, mobile menu
│   │   │   └── Footer.tsx
│   │   └── products/
│   │       ├── ProductCard.tsx
│   │       └── CategoryCard.tsx
│   │
│   ├── lib/
│   │   ├── db.ts                # PostgreSQL query helpers (pg pool)
│   │   └── mockData.ts          # In-memory data — no DB required
│   │
│   ├── types/index.ts
│   └── styles/globals.css
│
├── .env.example                 # Commit this — documents required vars
├── .env.local                   # Never commit — your actual secrets
├── .gitignore
├── vercel.json                  # Vercel config, headers, cache rules
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## GitHub Setup

### 1 — Initialise and push

```bash
cd rezichem-healthcare

git init
git add .
git commit -m "feat: initial commit — Rezichem Healthcare website"
```

Go to [github.com/new](https://github.com/new), create an **empty** repository called `rezichem-healthcare`, then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/rezichem-healthcare.git
git branch -M main
git push -u origin main
```

### 2 — Recommended branch strategy

```
main        ← production; protected; merges via PR only
develop     ← integration branch for features
feature/*   ← individual feature branches
hotfix/*    ← urgent production fixes
```

```bash
git checkout -b develop
git push -u origin develop
```

### 3 — Protect the main branch

GitHub repo → **Settings → Branches → Add branch protection rule**:

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Required checks: `Lint & Type Check`, `Build`
- ✅ Require branches to be up to date before merging
- ✅ Include administrators

---

## Vercel Deployment

### Option A — Vercel Dashboard (easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → select `rezichem-healthcare`
3. Vercel detects Next.js automatically — leave defaults
4. Expand **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Your PostgreSQL connection string (or leave blank for mock data) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` |

5. Click **Deploy**

Your site is live at `https://rezichem-healthcare.vercel.app` in ~60 seconds.

Every future push to `main` auto-deploys. Every PR gets its own **Preview URL**.

---

### Option B — Vercel CLI

```bash
# Install CLI (once, globally)
npm i -g vercel

# Log in to Vercel
vercel login

# Deploy from the project root
cd rezichem-healthcare
vercel

# Answer the prompts:
#   Set up and deploy?  → Y
#   Which scope?        → your personal account or team
#   Link to existing?   → N (first time)
#   Project name?       → rezichem-healthcare
#   Directory?          → ./

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SITE_URL

# Deploy to production
vercel --prod
```

---

### Option C — GitHub Actions auto-deploy

This wires up the `deploy.yml` workflow so every merge to `main` auto-deploys to Vercel.

**Step 1** — Get Vercel credentials

```bash
# After running `vercel` once, this file exists:
cat .vercel/project.json
# → {"orgId": "team_xxxx", "projectId": "prj_xxxx"}
```

Get a token at [vercel.com/account/tokens](https://vercel.com/account/tokens) → **Create** → copy it.

**Step 2** — Add secrets to GitHub

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | Value |
|---|---|
| `VERCEL_TOKEN` | Token from vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `orgId` from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json` |

**Step 3** — Trigger the pipeline

```bash
git push origin main
# CI runs → build passes → deploy.yml fires → production updated
```

---

### Custom domain

In Vercel → project → **Settings → Domains**:

```
rezichem.com        → Add → set as Primary
www.rezichem.com    → Add → redirect to rezichem.com
```

Update DNS at your registrar:

| Type | Name | Value |
|---|---|---|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

Then update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables to `https://rezichem.com`.

---

## Database Setup (PostgreSQL)

The app runs fully on mock data out of the box. Switch to a real database when ready.

### Vercel Postgres (zero-config on Vercel)

1. Vercel Dashboard → your project → **Storage → Create → Postgres**
2. Name it `rezichem-db` → **Create**
3. The `DATABASE_URL` environment variable is added to your project automatically

### Neon (recommended free tier)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a project, copy the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables

### Apply schema

```bash
# Pull production env vars locally
vercel env pull .env.local

# Run schema migration
psql "$DATABASE_URL" -f scripts/schema.sql
```

### Seed data

```bash
npm run db:seed
```

### Switch API routes from mock to real DB

In `src/app/api/products/route.ts` (and other routes), swap the import:

```ts
// Mock (default — no DB needed)
import { mockProducts } from '@/lib/mockData';
const products = mockProducts;

// Real PostgreSQL
import { getAllProducts } from '@/lib/db';
const products = await getAllProducts();
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | For real DB | PostgreSQL connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full URL — used in sitemap & Open Graph |
| `ADMIN_EMAIL` | Yes (for admin login) | Admin login email |
| `ADMIN_PASSWORD` | Yes (for admin login) | Admin login password |
| `ADMIN_SESSION_SECRET` | Yes (for admin login) | Random 32-byte secret used to sign admin sessions |
| `AWS_REGION` | Yes (for uploads) | AWS region for S3 bucket |
| `AWS_ACCESS_KEY_ID` | Yes (for uploads) | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | Yes (for uploads) | S3 secret key |
| `AWS_S3_BUCKET` | Yes (for uploads) | Bucket name |
| `AWS_S3_PUBLIC_BASE_URL` | Yes (for uploads) | Public S3 base URL used in DB URLs |

```bash
# Generate a secure ADMIN_SESSION_SECRET
openssl rand -base64 32
```

Copy `.env.example` to `.env.local` for local work. Never commit `.env.local`.

---

## CI/CD Pipeline

```
Developer pushes branch
        │
        ▼
┌────────────────────────────────┐
│  GitHub Actions: ci.yml        │
│  • ESLint                      │
│  • TypeScript check            │
│  • Next.js build               │
└────────────────────────────────┘
        │ all checks pass
        ▼
┌────────────────────────────────┐
│  Pull Request                  │
│  • Vercel Preview URL ready    │
│  • Peer code review            │
└────────────────────────────────┘
        │ approved + merged to main
        ▼
┌────────────────────────────────┐
│  GitHub Actions: deploy.yml    │
│  • Deploys to Vercel --prod    │
└────────────────────────────────┘
        │
        ▼
   Live at rezichem.com
```

---

## Extending the Project

### Protect the admin portal

```bash
npm install next-auth
```

`src/middleware.ts`:

```ts
import { withAuth } from 'next-auth/middleware';
export default withAuth({ pages: { signIn: '/admin/login' } });
export const config = { matcher: ['/admin/:path*'] };
```

### AI Chatbot

Add `src/app/api/chat/route.ts`:

```ts
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();
// stream responses back to a chat UI component
```

### Product images

Replace the `<Pill>` icon placeholder in `ProductCard.tsx` with:

```tsx
<Image src={product.image_url} alt={product.name} fill className="object-cover rounded-xl" />
```

Upload images to Vercel Blob, Cloudinary, or S3 and store the URL in `products.image_url`.

### Distributor Portal

Create `src/app/distributor/` as a protected route with order history, territory maps, and a download centre.

---

## Pages Reference

| URL | Description |
|---|---|
| `/` | Home — hero, stats, products, downloads, partner CTA |
| `/products` | Category grid + live search |
| `/products/[category]` | Products filtered by category |
| `/products/[category]/[product]` | Product detail with JSON-LD schema |
| `/about` | Philosophy, values, founders |
| `/careers` | Jobs CTA with contact info |
| `/contact` | Address, phone, email, map |
| `/admin` | Dashboard |
| `/admin/products` | Manage products |
| `/admin/categories` | Manage categories |
| `/sitemap.xml` | Auto-generated sitemap |
| `/robots.txt` | Search engine directives |

---

## Tech Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Icons | Lucide React |
| Database | PostgreSQL via `pg` |
| Hosting | Vercel |
| CI/CD | GitHub Actions |
| Fonts | Playfair Display + DM Sans |

---

*Replace placeholder content — address, phone numbers, founders — before going live.*
