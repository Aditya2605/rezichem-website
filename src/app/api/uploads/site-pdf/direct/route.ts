import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['application/pdf']);
const ALLOWED_ASSET_TYPES = new Set(['brochure', 'catalogue']);

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const assetType = form.get('assetType');

    if (!(file instanceof File) || typeof assetType !== 'string') {
      return NextResponse.json({ error: 'file and assetType are required' }, { status: 400 });
    }

    if (!ALLOWED_ASSET_TYPES.has(assetType)) {
      return NextResponse.json({ error: 'Invalid assetType' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only PDF is supported' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    const region = requiredEnv('AWS_REGION');
    const bucket = requiredEnv('AWS_S3_BUCKET');
    const publicBaseUrl = requiredEnv('AWS_S3_PUBLIC_BASE_URL').replace(/\/$/, '');

    const client = new S3Client({
      region,
      credentials: {
        accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const safeName = sanitizeFilename(file.name.endsWith('.pdf') ? file.name : `${file.name}.pdf`);
    const key = assetType === 'brochure'
      ? 'banners/brochure/company-brochure.pdf'
      : 'banners/catalogue/product-catalogue.pdf';
    const body = Buffer.from(await file.arrayBuffer());

    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable',
    }));

    const fileUrl = `${publicBaseUrl}/${key}`;
    const version = Date.now().toString();
    return NextResponse.json({
      fileUrl,
      versionedUrl: `${fileUrl}?v=${version}`,
      version,
      key,
      fileName: safeName,
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to upload PDF';
    console.error('POST /api/uploads/site-pdf/direct', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
