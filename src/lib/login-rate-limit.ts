interface AttemptState {
  fails: number;
  firstFailAt: number;
  blockedUntil: number;
}

const MAX_FAILS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;

function getStore(): Map<string, AttemptState> {
  const g = globalThis as typeof globalThis & { __rzLoginAttemptStore?: Map<string, AttemptState> };
  if (!g.__rzLoginAttemptStore) {
    g.__rzLoginAttemptStore = new Map<string, AttemptState>();
  }
  return g.__rzLoginAttemptStore;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfterSec?: number } {
  const store = getStore();
  const now = Date.now();
  const state = store.get(ip);
  if (!state) return { allowed: true };

  if (state.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((state.blockedUntil - now) / 1000) };
  }

  if (now - state.firstFailAt > WINDOW_MS) {
    store.delete(ip);
  }

  return { allowed: true };
}

export function registerLoginFailure(ip: string): void {
  const store = getStore();
  const now = Date.now();
  const state = store.get(ip);

  if (!state || now - state.firstFailAt > WINDOW_MS) {
    store.set(ip, { fails: 1, firstFailAt: now, blockedUntil: 0 });
    return;
  }

  state.fails += 1;
  if (state.fails >= MAX_FAILS) {
    state.blockedUntil = now + BLOCK_MS;
  }
  store.set(ip, state);
}

export function clearLoginFailures(ip: string): void {
  getStore().delete(ip);
}
