import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllProducts, getProductsByCategory, getFeaturedProducts, createProduct } from '@/lib/db';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

function sanitizeImageUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    // Prevent storing short-lived presigned query params in DB.
    if (
      parsed.searchParams.has('X-Amz-Algorithm') ||
      parsed.searchParams.has('X-Amz-Signature') ||
      parsed.searchParams.has('x-id')
    ) {
      return `${parsed.origin}${parsed.pathname}`;
    }
    return trimmed;
  } catch {
    return trimmed;
  }
}

export async function GET(req: NextRequest) {
  const category   = req.nextUrl.searchParams.get('category');
  const featured   = req.nextUrl.searchParams.get('featured');
  const limitParam = req.nextUrl.searchParams.get('limit');
  const limit      = limitParam ? parseInt(limitParam) : 50;

  try {
    if (category) {
      const products = await getProductsByCategory(category);
      return NextResponse.json({ products });
    }
    if (featured === 'true') {
      const products = await getFeaturedProducts(limit);
      return NextResponse.json({ products });
    }
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (err) {
    console.error('GET /api/products', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.slug || !body.category_id) {
      return NextResponse.json({ error: 'name, slug and category_id are required' }, { status: 400 });
    }
    const product = await createProduct({
      ...body,
      image_url: sanitizeImageUrl(body.image_url),
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    console.error('POST /api/products', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
