import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Pill, Package, FlaskConical, FileText } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getProductBySlug, getRelatedProducts } from '@/lib/db';

interface Props {
  params: { category: string; product: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.category, params.product);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: `${product.name} – ${product.composition}. ${product.description ?? ''}`,
    openGraph: {
      title: `${product.name} | Rezichem Health Care`,
      description: product.description ?? product.composition ?? '',
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.category, params.product);
  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 4);

  const details = [
    { icon: FlaskConical, label: 'Composition', value: product.composition },
    { icon: Package,      label: 'Dosage Form', value: product.dosage_form },
    { icon: Pill,         label: 'Category',    value: product.category_name },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Rezichem Health Care Pvt. Ltd.' },
    category: product.category_name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="container-xl py-3">
          <nav className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/products/${product.category_slug}`} className="hover:text-primary-600 transition-colors">
              {product.category_name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-neutral-800 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="section-pad bg-white">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Placeholder image */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl h-80 md:h-96 flex items-center justify-center">
              <Pill className="w-24 h-24 text-primary-200" />
            </div>

            {/* Info */}
            <div>
              <span className="tag mb-3 inline-block">{product.category_name}</span>
              <h1 className="text-3xl md:text-4xl font-display text-neutral-800 mb-4">{product.name}</h1>

              <div className="space-y-3 mb-6">
                {details.map(d => d.value && (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <d.icon className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{d.label}</p>
                      <p className="text-neutral-800 text-sm mt-0.5">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {product.description && (
                <div className="border-t border-neutral-100 pt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-neutral-400" />
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Description</p>
                  </div>
                  <p className="text-neutral-600 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 leading-relaxed">
                <strong>Disclaimer:</strong> This product is for use under medical supervision only. Please consult a qualified healthcare professional before use.
              </div>

              <div className="mt-5 flex gap-3">
                <Link href="/contact" className="btn-primary">Enquire Now</Link>
                <Link href={`/products/${product.category_slug}`} className="btn-outline">View Category</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="section-pad bg-neutral-50">
          <div className="container-xl">
            <h2 className="text-2xl font-display text-neutral-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
