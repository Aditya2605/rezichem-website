import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
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

    const { filename, contentType, size, assetType } = await req.json();

    if (!filename || !contentType || typeof size !== 'number' || !assetType) {
      return NextResponse.json({ error: 'filename, contentType, size, assetType are required' }, { status: 400 });
    }

    if (!ALLOWED_ASSET_TYPES.has(assetType)) {
      return NextResponse.json({ error: 'Invalid assetType' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Only PDF is supported' }, { status: 400 });
    }

    if (size > MAX_FILE_SIZE_BYTES) {
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

    const safeName = sanitizeFilename(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    const key = `banners/${assetType}/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    });

    const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
    const fileUrl = `${publicBaseUrl}/${key}`;

    return NextResponse.json({
      uploadUrl,
      fileUrl,
      key,
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to create upload URL';
    console.error('POST /api/uploads/site-pdf', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
