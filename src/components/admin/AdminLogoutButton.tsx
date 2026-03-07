'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function AdminLogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();

  const onLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={onLogout}
      className={`inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-primary-700 transition-colors ${className}`}
    >
      <LogOut className="w-3.5 h-3.5" />
      Logout
    </button>
  );
}
