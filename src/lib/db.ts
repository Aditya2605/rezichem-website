import { Pool } from 'pg';
import { Category, Product, SiteAsset } from '@/types';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query<T>(text: string, params?: unknown[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return query<Category>(`
    SELECT c.*, COUNT(p.id)::int AS product_count
    FROM categories c
    LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.sort_order, c.name
  `);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const rows = await query<Category>(
    'SELECT * FROM categories WHERE slug = $1 AND is_active = true',
    [slug]
  );
  return rows[0] ?? null;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const rows = await query<Category>('SELECT * FROM categories WHERE id = $1', [id]);
  return rows[0] ?? null;
}

export async function createCategory(
  name: string, slug: string, description: string, imageUrl: string | null = null
): Promise<Category> {
  const rows = await query<Category>(
    'INSERT INTO categories (name, slug, description, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, slug, description, imageUrl]
  );
  return rows[0];
}

export async function updateCategory(
  id: number, name: string, slug: string, description: string, imageUrl: string | null = null
): Promise<Category> {
  const rows = await query<Category>(
    'UPDATE categories SET name=$1, slug=$2, description=$3, image_url=$4 WHERE id=$5 RETURNING *',
    [name, slug, description, imageUrl, id]
  );
  return rows[0];
}

export async function deleteCategory(id: number): Promise<void> {
  await query('DELETE FROM categories WHERE id=$1', [id]);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  return query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = true
    ORDER BY c.sort_order, c.name, p.sort_order, p.name
  `);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE c.slug = $1 AND p.is_active = true
    ORDER BY p.sort_order, p.name
  `, [categorySlug]);
}

export async function getProductBySlug(
  categorySlug: string, productSlug: string
): Promise<Product | null> {
  const rows = await query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE c.slug = $1 AND p.slug = $2 AND p.is_active = true
  `, [categorySlug, productSlug]);
  return rows[0] ?? null;
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = $1
  `, [id]);
  return rows[0] ?? null;
}

export async function getRelatedProducts(
  categoryId: number, excludeId: number, limit = 4
): Promise<Product[]> {
  return query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true
    ORDER BY p.sort_order, p.name
    LIMIT $3
  `, [categoryId, excludeId, limit]);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  // Returns is_featured=true products first; falls back to first N active products
  // if none are marked featured yet.
  const featured = await query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = true AND p.is_featured = true
    ORDER BY p.sort_order, p.name
    LIMIT $1
  `, [limit]);

  if (featured.length > 0) return featured;

  // Fallback: return first N active products alphabetically
  return query<Product>(`
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.is_active = true
    ORDER BY p.name
    LIMIT $1
  `, [limit]);
}

export async function searchProducts(q: string): Promise<Product[]> {
  // FTS is good for full words, but live search needs partial matching too.
  // Combine both to support pharma prefixes/abbreviations while still ranking relevant hits.
  const term = q.trim();
  if (term.length < 3) return [];

  const like = `%${term}%`;

  try {
    return await query<Product>(`
      SELECT
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        ts_rank(
          to_tsvector('english', coalesce(p.name,'') || ' ' || coalesce(p.composition,'')),
          websearch_to_tsquery('english', $1)
        ) AS rank,
        CASE
          WHEN lower(p.name) = lower($1) THEN 400
          WHEN lower(p.name) LIKE lower($1) || '%' THEN 300
          WHEN p.name ILIKE $2 THEN 200
          WHEN p.composition ILIKE $2 THEN 120
          WHEN p.description ILIKE $2 THEN 80
          ELSE 0
        END AS match_score
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = true
        AND (
          to_tsvector('english', coalesce(p.name,'') || ' ' || coalesce(p.composition,''))
            @@ websearch_to_tsquery('english', $1)
          OR p.name ILIKE $2
          OR p.composition ILIKE $2
          OR p.description ILIKE $2
        )
      ORDER BY match_score DESC, rank DESC, p.name
      LIMIT 50
    `, [term, like]);
  } catch {
    // Last-resort fallback if full-text parsing fails for a special query string.
    return query<Product>(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.is_active = true
        AND (p.name ILIKE $1 OR p.composition ILIKE $1 OR p.description ILIKE $1)
      ORDER BY p.name
      LIMIT 50
    `, [like]);
  }
}

export async function createProduct(
  data: Omit<Product, 'id' | 'category_name' | 'category_slug'>
): Promise<Product> {
  const rows = await query<Product>(`
    INSERT INTO products (name, slug, category_id, composition, dosage_form, description, image_url, is_featured, is_active, sort_order)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
  `, [
    data.name, data.slug, data.category_id, data.composition,
    data.dosage_form, data.description, data.image_url,
    data.is_featured ?? false, data.is_active ?? true, data.sort_order ?? 0,
  ]);
  return rows[0];
}

export async function updateProduct(
  id: number,
  data: Omit<Product, 'id' | 'category_name' | 'category_slug'>
): Promise<Product> {
  const rows = await query<Product>(`
    UPDATE products
    SET name=$1, slug=$2, category_id=$3, composition=$4,
        dosage_form=$5, description=$6, image_url=$7,
        is_featured=$8, is_active=$9, sort_order=$10
    WHERE id=$11 RETURNING *
  `, [
    data.name, data.slug, data.category_id, data.composition,
    data.dosage_form, data.description, data.image_url,
    data.is_featured ?? false, data.is_active ?? true, data.sort_order ?? 0,
    id,
  ]);
  return rows[0];
}

export async function deleteProduct(id: number): Promise<void> {
  await query('DELETE FROM products WHERE id=$1', [id]);
}

// ─── Site Assets (brochure/catalogue links) ──────────────────────────────────

export async function getSiteAssets(): Promise<SiteAsset[]> {
  return query<SiteAsset>(`
    SELECT key, url, updated_at
    FROM site_assets
    ORDER BY key
  `);
}

export async function getSiteAssetsMap(): Promise<Record<string, string>> {
  const rows = await getSiteAssets();
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.url;
    return acc;
  }, {});
}

export async function upsertSiteAsset(key: string, url: string): Promise<SiteAsset> {
  const rows = await query<SiteAsset>(`
    INSERT INTO site_assets (key, url)
    VALUES ($1, $2)
    ON CONFLICT (key) DO UPDATE
      SET url = EXCLUDED.url,
          updated_at = NOW()
    RETURNING key, url, updated_at
  `, [key, url]);
  return rows[0];
}
