'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Tag, FlaskConical, Star, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  featuredProducts: number;
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/products?featured=true&limit=100').then(r => r.json()),
    ]).then(([prodData, catData, featData]) => {
      setStats({
        totalProducts:    (prodData.products ?? []).length,
        totalCategories:  (catData.categories ?? []).length,
        featuredProducts: (featData.products ?? []).length,
      });
    }).catch(() => {
      setStats({ totalProducts: 0, totalCategories: 0, featuredProducts: 0 });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Package, label: 'Total Products',    value: stats?.totalProducts,    href: '/admin/products',   color: 'bg-blue-50 text-blue-600' },
    { icon: Tag,     label: 'Categories',         value: stats?.totalCategories,  href: '/admin/categories', color: 'bg-purple-50 text-purple-600' },
    { icon: Star,    label: 'Featured Products',  value: stats?.featuredProducts, href: '/admin/products?featured=true',   color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Rezichem Health Care — Admin Portal</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading stats...
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {cards.map(c => (
            <Link key={c.label} href={c.href} className="card p-5 hover:border-primary-200 transition-colors group">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${c.color}`}>
                <c.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-neutral-800">{c.value ?? '—'}</p>
              <p className="text-neutral-500 text-sm mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 max-w-5xl">
        <div className="card p-5">
          <div className="flex items-center gap-2.5 mb-3">
            <FlaskConical className="w-4 h-4 text-primary-600" />
            <h2 className="font-semibold text-neutral-800">Quick Actions</h2>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Add New Product', href: '/admin/products/new' },
              { label: 'Add New Category', href: '/admin/categories/new' },
              { label: 'View All Products', href: '/admin/products' },
              { label: 'Manage Categories', href: '/admin/categories' },
              { label: 'Manage Downloads', href: '/admin/downloads' },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between p-2.5 rounded-lg hover:bg-neutral-50 text-sm text-neutral-700 group transition-colors"
              >
                {a.label}
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-neutral-800 mb-3">Portal Actions</h2>
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-neutral-700 hover:text-primary-700 rounded-lg hover:bg-neutral-50 px-2.5 py-2.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Website
            </Link>
            <AdminLogoutButton className="w-full rounded-lg hover:bg-neutral-50 px-2.5 py-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
