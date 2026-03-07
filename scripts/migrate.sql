-- ============================================================
-- Rezichem Schema Migration
-- Run once on Neon: paste into the Neon SQL editor and execute
-- ============================================================

-- 1. Featured flag on products
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- 2. Image URLs
ALTER TABLE products   ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 3. Active/visible flag
ALTER TABLE products   ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;
CREATE INDEX IF NOT EXISTS idx_products_active   ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- 4. Sort order (0 = default, lower number = appears first)
ALTER TABLE products   ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- 5. Replace the two separate GIN indexes with one composite FTS index
DROP INDEX IF EXISTS idx_products_name;
DROP INDEX IF EXISTS idx_products_composition;
CREATE INDEX IF NOT EXISTS idx_products_fts ON products
  USING gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(composition,'')));

-- 6. Backfill image URLs so existing rows have images
UPDATE categories
SET image_url = '/images/placeholders/category-default.svg'
WHERE image_url IS NULL OR btrim(image_url) = '';

UPDATE products
SET image_url = '/images/placeholders/product-default.svg'
WHERE image_url IS NULL OR btrim(image_url) = '';

-- 7. Mark the first 6 products as featured so the homepage has content
--    (Run this AFTER seeding the DB with real products)
UPDATE products
SET is_featured = true
WHERE id IN (
  SELECT id FROM products ORDER BY name LIMIT 6
);

-- 8. Site assets (brochure/catalogue URLs)
CREATE TABLE IF NOT EXISTS site_assets (
  key        VARCHAR(80) PRIMARY KEY,
  url        TEXT        NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_assets (key, url) VALUES
  ('company_brochure_pdf_url', '/downloads/company-brochure.pdf'),
  ('product_catalogue_pdf_url', '/downloads/product-catalogue.pdf'),
  ('company_logo_url', ''),
  ('social_linkedin_url', ''),
  ('social_facebook_url', ''),
  ('social_instagram_url', '')
ON CONFLICT (key) DO NOTHING;
