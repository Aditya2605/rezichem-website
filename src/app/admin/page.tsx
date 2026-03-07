'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Tag, FlaskConical, Star, ArrowRight, Loader2 } from 'lucide-react';

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
    { icon: Star,    label: 'Featured Products',  value: stats?.featuredProducts, href: '/admin/products',   color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-neutral-800">Dashboard</h1>
        <p className="text-neutral-500 text-sm mt-1">Rezichem Health Care — Admin Portal</p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-neutral-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" /> Loading stats...
        </div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {cards.map(c => (
            <Link key={c.label} href={c.href} className="card p-6 hover:border-primary-200 transition-colors group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>
                <c.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-neutral-800">{c.value ?? '—'}</p>
              <p className="text-neutral-500 text-sm mt-1">{c.label}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-neutral-800">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Add New Product',  href: '/admin/products/new' },
              { label: 'Add New Category', href: '/admin/categories/new' },
              { label: 'View All Products', href: '/admin/products' },
              { label: 'Manage Categories', href: '/admin/categories' },
            ].map(a => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 text-sm text-neutral-700 group transition-colors"
              >
                {a.label}
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-neutral-800 mb-4">Getting Started</h2>
          <ol className="space-y-3 text-sm text-neutral-600">
            <li className="flex gap-2"><span className="text-primary-600 font-bold">1.</span> Run the schema migration SQL on Neon</li>
            <li className="flex gap-2"><span className="text-primary-600 font-bold">2.</span> Run <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs">npm run db:seed</code> to import all products</li>
            <li className="flex gap-2"><span className="text-primary-600 font-bold">3.</span> Mark products as Featured to show them on the homepage</li>
            <li className="flex gap-2"><span className="text-primary-600 font-bold">4.</span> Use Add Product / Edit to manage your catalogue</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
