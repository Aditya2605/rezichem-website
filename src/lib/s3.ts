import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function getS3Client(): S3Client {
  return new S3Client({
    region: requiredEnv('AWS_REGION'),
    credentials: {
      accessKeyId: requiredEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });
}

export function getS3Bucket(): string {
  return requiredEnv('AWS_S3_BUCKET');
}

export function getPublicBaseUrl(): string {
  return requiredEnv('AWS_S3_PUBLIC_BASE_URL').replace(/\/$/, '');
}

export function extractKeyFromPublicUrl(url: string): string | null {
  const base = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, '');
  if (!base) return null;
  try {
    const parsed = new URL(url);
    const baseParsed = new URL(base);
    if (parsed.origin !== baseParsed.origin) return null;
    const basePath = baseParsed.pathname.replace(/\/$/, '');
    const fullPath = parsed.pathname;
    if (!fullPath.startsWith(`${basePath}/`)) return null;
    const key = fullPath.slice(basePath.length + 1);
    return key ? decodeURIComponent(key) : null;
  } catch {
    if (!url.startsWith(`${base}/`)) return null;
    const key = url.slice(base.length + 1).split('?')[0];
    return key ? decodeURIComponent(key) : null;
  }
}

export async function deleteS3ObjectByPublicUrl(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const key = extractKeyFromPublicUrl(url);
  if (!key) return;

  const client = getS3Client();
  await client.send(new DeleteObjectCommand({
    Bucket: getS3Bucket(),
    Key: key,
  }));
}
