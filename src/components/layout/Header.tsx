'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronRight, Pill } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    fetch('/api/site-assets', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const assets = (d.assets ?? []) as Array<{ key: string; url: string }>;
        const logo = assets.find(a => a.key === 'company_logo_url')?.url ?? '';
        setCompanyLogoUrl(logo);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setLoading(false);
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data = await res.json();
        setSearchResults(data.products ?? []);
        setSearchOpen(true);
      } catch (err) {
        if (!(err instanceof Error && err.name === 'AbortError')) {
          setSearchResults([]);
          setSearchOpen(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchQuery]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <div className="container-xl">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
            {companyLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={companyLogoUrl}
                alt="Rezichem logo"
                className="h-11 md:h-12 w-auto max-w-[170px] object-contain"
              />
            ) : (
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold text-primary-700 leading-tight block">Rezichem</span>
              <span className="text-[10px] font-medium text-neutral-500 tracking-widest uppercase block -mt-0.5">Healthcare</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-4">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  pathname === link.href
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-600 hover:text-primary-700 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search */}
          <div ref={searchRef} className="relative flex-1 max-w-md ml-auto">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search medicines by name or composition"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 transition"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </form>

            <AnimatePresence>
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="py-1 max-h-72 overflow-y-auto">
                    {searchResults.slice(0, 8).map(p => (
                      <Link
                        key={p.id}
                        href={`/products/${p.category_slug}/${p.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary-50 transition-colors"
                      >
                        <div className="w-7 h-7 bg-primary-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Pill className="w-3.5 h-3.5 text-primary-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-neutral-800 truncate">{p.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{p.composition}</p>
                        </div>
                        <span className="ml-auto text-[10px] bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full flex-shrink-0">{p.category_name}</span>
                      </Link>
                    ))}
                    {searchResults.length > 8 && (
                      <button
                        onClick={() => { router.push(`/products?search=${encodeURIComponent(searchQuery)}`); setSearchOpen(false); }}
                        className="w-full flex items-center justify-center gap-1 px-4 py-2.5 text-sm text-primary-600 hover:bg-primary-50 font-medium border-t border-neutral-100"
                      >
                        View all {searchResults.length} results <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
              {searchOpen && searchQuery.length >= 3 && searchResults.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-full mt-1 left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl px-4 py-4 text-sm text-neutral-500 text-center z-50"
                >
                  No products found for &ldquo;{searchQuery}&rdquo;
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-neutral-100 overflow-hidden bg-white"
          >
            <nav className="container-xl py-3 flex flex-col gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    pathname === link.href
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
