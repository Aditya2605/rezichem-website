import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export async function POST(req: NextRequest) {
  try {
    const { filename, contentType, size } = await req.json();

    if (!filename || !contentType || typeof size !== 'number') {
      return NextResponse.json({ error: 'filename, contentType and size are required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
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

    const safeName = sanitizeFilename(filename);
    const key = `products/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;

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
    console.error('POST /api/uploads/product-image', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
