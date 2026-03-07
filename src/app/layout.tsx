import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rezichem.com';
const S3_BASE = process.env.AWS_S3_PUBLIC_BASE_URL?.replace(/\/$/, '');
const COMPANY_LOGO_ICON = S3_BASE ? `${S3_BASE}/banners/logo/company-logo` : '/favicon.ico';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rezichem Healthcare | Quality Pharmaceutical Solutions',
    template: '%s | Rezichem Healthcare',
  },
  description:
    'Rezichem Healthcare delivers quality pharmaceutical products across India. Browse our extensive range of medicines, vitamins, and healthcare solutions.',
  keywords: ['pharma', 'medicines', 'healthcare', 'Rezichem', 'pharmaceutical'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: COMPANY_LOGO_ICON }],
    shortcut: [{ url: COMPANY_LOGO_ICON }],
    apple: [{ url: COMPANY_LOGO_ICON }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Rezichem Healthcare',
    title: 'Rezichem Healthcare | Quality Pharmaceutical Solutions',
    description:
      'Rezichem Healthcare delivers quality pharmaceutical products across India. Browse our extensive range of medicines, vitamins, and healthcare solutions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rezichem Healthcare | Quality Pharmaceutical Solutions',
    description:
      'Rezichem Healthcare delivers quality pharmaceutical products across India. Browse our extensive range of medicines, vitamins, and healthcare solutions.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rezichem Healthcare',
    url: SITE_URL,
    logo: COMPANY_LOGO_ICON,
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: '+91-9904257395',
      email: 'rezichemhealthcarepvtltd@gmail.com',
      areaServed: 'IN',
    }],
    sameAs: ['https://www.rezichem.com', 'https://www.rezichem.co.in'],
  };

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
