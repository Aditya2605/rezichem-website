import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory, getFeaturedProducts, createProduct } from '@/lib/db';

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
    const body = await req.json();
    if (!body.name || !body.slug || !body.category_id) {
      return NextResponse.json({ error: 'name, slug and category_id are required' }, { status: 400 });
    }
    const product = await createProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to create product';
    console.error('POST /api/products', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
