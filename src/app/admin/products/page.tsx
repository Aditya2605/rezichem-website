'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Pencil, Trash2, Search, Loader2 } from 'lucide-react';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const featuredOnly = searchParams.get('featured') === 'true';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [error, setError]       = useState('');

  useEffect(() => {
    fetch(featuredOnly ? '/api/products?featured=true&limit=200' : '/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, [featuredOnly]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete product. Please try again.');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.composition ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            {featuredOnly ? 'Featured Products' : 'Products'}
          </h1>
          <p className="text-neutral-500 text-sm">
            {loading ? 'Loading...' : `${products.length} ${featuredOnly ? 'featured' : 'total'} products`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {featuredOnly && (
            <Link href="/admin/products" className="btn-outline text-sm py-2 px-4">
              View All Products
            </Link>
          )}
          <Link href="/admin/products/new" className="btn-primary text-sm py-2 px-4">
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, category or composition..."
          className="w-full max-w-sm pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading products...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600">Product Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600">Dosage Form</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-600">Composition</th>
                  <th className="px-4 py-3 text-center font-semibold text-neutral-600">Featured</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-neutral-800">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="tag">{product.category_name}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{product.dosage_form}</td>
                    <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">{product.composition}</td>
                    <td className="px-4 py-3 text-center">
                      {product.is_featured
                        ? <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Yes</span>
                        : <span className="text-xs text-neutral-300">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-neutral-400 text-sm">
                {search ? 'No products match your search.' : 'No products yet. Add one above.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
