import { NextRequest, NextResponse } from 'next/server';
import { getCategoryById, updateCategory, deleteCategory } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await getCategoryById(parseInt(params.id));
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err) {
    console.error('GET /api/categories/[id]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, slug, description, image_url } = await req.json();
    if (!name || !slug) {
      return NextResponse.json({ error: 'name and slug are required' }, { status: 400 });
    }
    const category = await updateCategory(
      parseInt(params.id),
      name,
      slug,
      description ?? '',
      image_url?.trim() || null
    );
    if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ category });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update category';
    console.error('PUT /api/categories/[id]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteCategory(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete category';
    // FK violation = category has products
    if (msg.includes('foreign key') || msg.includes('violates')) {
      return NextResponse.json(
        { error: 'Cannot delete category that has products. Remove all products first.' },
        { status: 409 }
      );
    }
    console.error('DELETE /api/categories/[id]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
