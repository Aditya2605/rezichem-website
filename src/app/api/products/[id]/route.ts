import { NextRequest, NextResponse } from 'next/server';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await getProductById(parseInt(params.id));
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    console.error('GET /api/products/[id]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const product = await updateProduct(parseInt(params.id), body);
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update product';
    console.error('PUT /api/products/[id]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteProduct(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products/[id]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
