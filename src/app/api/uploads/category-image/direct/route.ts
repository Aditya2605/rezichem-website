import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function sanitizeSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(req: NextRequest) {
  try {
    const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
    if (!verifyAdminSessionToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get('file');
    const slugRaw = form.get('slug');

    if (!(file instanceof File) || typeof slugRaw !== 'string') {
      return NextResponse.json({ error: 'file and slug are required' }, { status: 400 });
    }

    const slug = sanitizeSlug(slugRaw);
    if (!slug) {
      return NextResponse.json({ error: 'Valid slug is required' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
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

    const key = `categories/${slug}/image`;
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
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to upload image';
    console.error('POST /api/uploads/category-image/direct', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
