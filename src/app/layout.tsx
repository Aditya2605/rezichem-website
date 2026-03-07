import type { Metadata } from 'next';
import '@/styles/globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'Rezichem Healthcare | Quality Pharmaceutical Solutions',
    template: '%s | Rezichem Healthcare',
  },
  description:
    'Rezichem Healthcare delivers quality pharmaceutical products across India. Browse our extensive range of medicines, vitamins, and healthcare solutions.',
  keywords: ['pharma', 'medicines', 'healthcare', 'Rezichem', 'pharmaceutical'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Rezichem Healthcare',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
