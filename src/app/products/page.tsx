import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsContent from '@/components/products/ProductsContent';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rezichem.com';

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse all Rezichem Healthcare product categories and pharmaceutical formulations.',
  alternates: {
    canonical: '/products',
  },
  openGraph: {
    title: 'Products | Rezichem Healthcare',
    description: 'Browse all Rezichem Healthcare product categories and pharmaceutical formulations.',
    url: `${SITE_URL}/products`,
    type: 'website',
  },
};

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
