import { MetadataRoute } from 'next';
import { getAllCategories, getAllProducts } from '@/lib/db';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rezichem.com';

  let categories: { slug: string }[] = [];
  let products: { category_slug?: string; slug: string }[] = [];

  try {
    categories = await getAllCategories();
    products   = await getAllProducts();
  } catch {
    // DB not available at build time — return static pages only
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/careers`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products
    .filter(p => p.category_slug)
    .map(p => ({
      url: `${baseUrl}/products/${p.category_slug}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}
