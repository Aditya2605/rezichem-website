'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          const retryAfterSec = Number(data?.retryAfterSec ?? res.headers.get('Retry-After') ?? 0);
          const retryAfterMin = retryAfterSec > 0 ? Math.ceil(retryAfterSec / 60) : null;
          throw new Error(
            retryAfterMin
              ? `Too many failed attempts. Try again in ${retryAfterMin} minute${retryAfterMin > 1 ? 's' : ''}.`
              : 'Too many failed attempts. Try again later.'
          );
        }
        throw new Error(data.error ?? 'Login failed');
      }
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-3 py-2.5 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 transition';

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 bg-neutral-50">
      <div className="w-full max-w-md card p-7">
        <h1 className="text-2xl font-display font-bold text-neutral-800 mb-1">Admin Login</h1>
        <p className="text-sm text-neutral-500 mb-6">Sign in to manage products, categories, and assets.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@yourcompany.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
