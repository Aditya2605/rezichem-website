import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllCategories, createCategory } from '@/lib/db';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

function sanitizeImageUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
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

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ categories });
  } catch (err) {
    console.error('GET /api/categories', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, description, image_url } = await req.json();
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }
    const category = await createCategory(name, slug, description ?? '', sanitizeImageUrl(image_url));
    return NextResponse.json({ category }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create category';
    // Unique constraint violation
    if (typeof msg === 'string' && msg.includes('unique')) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 409 });
    }
    console.error('POST /api/categories', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
