import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getCategoryBySlug, getProductsByCategory } from '@/lib/db';

interface Props {
  params: { category: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: category.name,
    description: `Browse ${category.name} products from Rezichem Health Care. ${category.description ?? ''}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = await getCategoryBySlug(params.category);
  if (!category) notFound();

  const products = await getProductsByCategory(params.category);

  return (
    <div>
      {/* Breadcrumb + hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16 md:py-20">
        <div className="container-xl">
          <nav className="flex items-center gap-1.5 text-sm text-primary-300 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-display leading-tight mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-primary-200 text-base max-w-xl">{category.description}</p>
          )}
          <p className="text-primary-400 text-sm mt-3">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-xl">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-neutral-500">
              No products found in this category.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
