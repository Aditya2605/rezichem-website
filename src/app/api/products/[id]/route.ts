import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getProductById, updateProduct, deleteProduct } from '@/lib/db';
import { deleteS3ObjectByPublicUrl, extractKeyFromPublicUrl } from '@/lib/s3';
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
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const existing = await getProductById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const nextImageUrl = sanitizeImageUrl(body.image_url);
    const product = await updateProduct(parseInt(params.id), {
      ...body,
      image_url: nextImageUrl,
    });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const oldKey = existing.image_url ? extractKeyFromPublicUrl(existing.image_url) : null;
    const newKey = nextImageUrl ? extractKeyFromPublicUrl(nextImageUrl) : null;
    const shouldDeleteOld = !!oldKey && oldKey !== newKey;

    if (existing.image_url && shouldDeleteOld) {
      try {
        await deleteS3ObjectByPublicUrl(existing.image_url);
      } catch (s3Err) {
        console.error('PUT /api/products/[id] old image cleanup failed', s3Err);
      }
    }

    return NextResponse.json({ product });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update product';
    console.error('PUT /api/products/[id]', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    const existing = await getProductById(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await deleteProduct(id);

    if (existing.image_url) {
      try {
        await deleteS3ObjectByPublicUrl(existing.image_url);
      } catch (s3Err) {
        console.error('DELETE /api/products/[id] image cleanup failed', s3Err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products/[id]', err);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
