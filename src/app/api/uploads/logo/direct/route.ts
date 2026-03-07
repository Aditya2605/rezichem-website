import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-auth';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

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

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 });
    }

    if (!file.type?.startsWith('image/')) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
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

    const key = 'banners/logo/company-logo';
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
    const msg = err instanceof Error ? err.message : 'Failed to upload logo';
    console.error('POST /api/uploads/logo/direct', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
