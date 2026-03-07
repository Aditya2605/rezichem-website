import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionMaxAge,
  validateAdminCredentials,
} from '@/lib/admin-auth';
import {
  checkLoginRateLimit,
  clearLoginFailures,
  getClientIp,
  registerLoginFailure,
} from '@/lib/login-rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);
    const limitCheck = checkLoginRateLimit(ip);
    if (!limitCheck.allowed) {
      const retryAfterSec = limitCheck.retryAfterSec ?? 60;
      const res = NextResponse.json(
        { error: 'Too many failed attempts. Try again later.', retryAfterSec },
        { status: 429 }
      );
      res.headers.set('Retry-After', String(retryAfterSec));
      return res;
    }

    const body = await req.json();
    const email = String(body?.email ?? '');
    const password = String(body?.password ?? '');

    if (!email || !password) {
      registerLoginFailure(ip);
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!validateAdminCredentials(email, password)) {
      registerLoginFailure(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    clearLoginFailures(ip);
    const token = createAdminSessionToken(email);
    const res = NextResponse.json({ success: true });
    res.cookies.set({
      name: ADMIN_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: getAdminSessionMaxAge(),
    });
    return res;
  } catch (err) {
    console.error('POST /api/admin/login', err);
    const message = err instanceof Error && err.message.startsWith('Missing ADMIN_')
      ? 'Admin auth is not configured on server'
      : 'Login failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
