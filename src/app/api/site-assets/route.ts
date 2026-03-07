import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSiteAssets, getSiteAssetsMap, upsertSiteAsset } from '@/lib/db';
import { deleteS3ObjectByPublicUrl, extractKeyFromPublicUrl } from '@/lib/s3';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

const ALLOWED_KEYS = new Set([
  'company_brochure_pdf_url',
  'product_catalogue_pdf_url',
  'company_logo_url',
  'social_linkedin_url',
  'social_facebook_url',
  'social_instagram_url',
]);

function sanitizeAssetUrl(url: unknown): string | null {
  if (typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return '';

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
    const assets = await getSiteAssets();
    return NextResponse.json({ assets });
  } catch (err) {
    console.error('GET /api/site-assets', err);
    return NextResponse.json({ error: 'Failed to fetch site assets' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { key, url } = await req.json();
    const cleanUrl = sanitizeAssetUrl(url);
    if (!key || cleanUrl === null) {
      return NextResponse.json({ error: 'key and url are required' }, { status: 400 });
    }
    if (!ALLOWED_KEYS.has(key)) {
      return NextResponse.json({ error: 'Invalid asset key' }, { status: 400 });
    }

    const before = await getSiteAssetsMap();
    const asset = await upsertSiteAsset(key, cleanUrl);

    const oldUrl = before[key];
    const oldKey = oldUrl ? extractKeyFromPublicUrl(oldUrl) : null;
    const newKey = cleanUrl ? extractKeyFromPublicUrl(cleanUrl) : null;
    const shouldDeleteOld = !!oldKey && oldKey !== newKey;

    if (oldUrl && shouldDeleteOld) {
      try {
        await deleteS3ObjectByPublicUrl(oldUrl);
      } catch (s3Err) {
        console.error('PUT /api/site-assets old file cleanup failed', s3Err);
      }
    }

    return NextResponse.json({ asset });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to update asset';
    console.error('PUT /api/site-assets', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
