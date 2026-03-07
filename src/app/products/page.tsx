'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, LayoutGrid, List } from 'lucide-react';
import CategoryCard from '@/components/products/CategoryCard';
import ProductCard from '@/components/products/ProductCard';
import { Category, Product } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') ?? '';

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [view, setView] = useState<'categories' | 'search'>('categories');

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setIsSearching(false);
      setView('categories');
      setSearchResults([]);
      return;
    }

    setView('search');
    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setSearchResults(data.products ?? []);
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          setSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 md:py-24">
        <div className="container-xl">
          <p className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3">Our Products</p>
          <h1 className="text-4xl md:text-5xl font-display max-w-2xl leading-tight mb-6">
            Comprehensive Pharmaceutical Solutions
          </h1>
          {/* Search bar */}
          <div className="max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search medicines by name or composition..."
              className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white/15 transition"
            />
          </div>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-xl">
          {view === 'categories' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display text-neutral-800">Browse by Category</h2>
                  <p className="text-neutral-500 text-sm mt-1">{categories.length} categories available</p>
                </div>
              </div>
              {categories.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-44 bg-neutral-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {categories.map(cat => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              )}
            </>
          )}

          {view === 'search' && (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-display text-neutral-800">
                    {isSearching ? 'Searching...' : `Results for "${searchQuery}"`}
                  </h2>
                  {!isSearching && (
                    <p className="text-neutral-500 text-sm mt-1">{searchResults.length} products found</p>
                  )}
                </div>
                <button
                  onClick={() => { setView('categories'); setSearchQuery(''); router.push('/products'); }}
                  className="text-sm text-primary-600 hover:underline flex items-center gap-1"
                >
                  <LayoutGrid className="w-4 h-4" /> View Categories
                </button>
              </div>

              {isSearching ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              ) : (
                <div className="text-center py-20">
                  <List className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-600 mb-2">No products found</h3>
                  <p className="text-neutral-400 text-sm">Try a different search term or browse by category.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
