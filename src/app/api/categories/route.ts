import { NextResponse } from 'next/server';
import { getAllCategories, createCategory } from '@/lib/db';

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
    const { name, slug, description, image_url } = await req.json();
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }
    const category = await createCategory(name, slug, description ?? '', image_url?.trim() || null);
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
