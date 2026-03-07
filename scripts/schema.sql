-- ============================================================
-- Rezichem Health Care Pvt. Ltd. — Database Schema
-- Run this file once on a fresh PostgreSQL / Neon database
-- ============================================================

-- ─── Categories ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL       PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN      NOT NULL DEFAULT true,
  sort_order  INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ─── Products ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id           SERIAL       PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  slug         VARCHAR(220) NOT NULL,
  category_id  INTEGER      NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  composition  TEXT,
  dosage_form  VARCHAR(100),
  description  TEXT,
  image_url    TEXT,
  is_featured  BOOLEAN      NOT NULL DEFAULT false,
  is_active    BOOLEAN      NOT NULL DEFAULT true,
  sort_order   INTEGER      NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

-- Full-text search across name + composition (single composite GIN index)
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(composition,'')));

-- Lookup by category
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Fast filter for active / featured products
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── Site assets (download links) ───────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_assets (
  key        VARCHAR(80) PRIMARY KEY,
  url        TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default fallback links for brochure/catalogue, logo and social media
INSERT INTO site_assets (key, url) VALUES
  ('company_brochure_pdf_url', '/downloads/company-brochure.pdf'),
  ('product_catalogue_pdf_url', '/downloads/product-catalogue.pdf'),
  ('company_logo_url', ''),
  ('social_linkedin_url', ''),
  ('social_facebook_url', ''),
  ('social_instagram_url', '')
ON CONFLICT (key) DO NOTHING;
