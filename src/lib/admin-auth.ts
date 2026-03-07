import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'rz_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;

interface SessionPayload {
  email: string;
  exp: number;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

function base64UrlEncode(input: string): string {
  return Buffer.from(input, 'utf8').toString('base64url');
}

function base64UrlDecode(input: string): string {
  return Buffer.from(input, 'base64url').toString('utf8');
}

function signPayload(payloadB64: string): string {
  return createHmac('sha256', requiredEnv('ADMIN_SESSION_SECRET'))
    .update(payloadB64)
    .digest('base64url');
}

function safeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const expectedEmail = requiredEnv('ADMIN_EMAIL');
  const expectedPassword = requiredEnv('ADMIN_PASSWORD');
  return safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase()) && safeEqual(password, expectedPassword);
}

export function createAdminSessionToken(email: string): string {
  const payload: SessionPayload = {
    email: email.trim().toLowerCase(),
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payloadB64 = base64UrlEncode(JSON.stringify(payload));
  const signature = signPayload(payloadB64);
  return `${payloadB64}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [payloadB64, signature] = token.split('.');
  if (!payloadB64 || !signature) return null;

  const expectedSig = signPayload(payloadB64);
  if (!safeEqual(signature, expectedSig)) return null;

  try {
    const parsed = JSON.parse(base64UrlDecode(payloadB64)) as SessionPayload;
    if (!parsed.email || typeof parsed.exp !== 'number') return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminSessionMaxAge(): number {
  return SESSION_TTL_SECONDS;
}
