import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/db';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.trim().length < 3) {
    return NextResponse.json({ products: [], query: q, total: 0 });
  }
  try {
    const products = await searchProducts(q);
    return NextResponse.json({ products, query: q, total: products.length });
  } catch (err) {
    console.error('GET /api/search', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
