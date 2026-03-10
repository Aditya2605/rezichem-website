'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Truck, Award, Users, FlaskConical } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' }
  }),
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [downloadLinks, setDownloadLinks] = useState({
    brochure: '/downloads/company-brochure.pdf',
    catalogue: '/downloads/product-catalogue.pdf',
  });

  const stats = [
    { icon: FlaskConical, label: 'Products', value: `${productCount ?? 100}+` },
    { icon: Award, label: 'Years of Excellence', value: '15+' },
    { icon: Users, label: 'Healthcare Partners', value: '500+' },
    { icon: Truck, label: 'States Covered', value: '20+' },
  ];

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then(r => r.json())
      .then(d => setFeatured(d.products ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => {
        const products = Array.isArray(d.products) ? d.products : [];
        if (products.length > 0) setProductCount(products.length);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/site-assets', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const assets = (d.assets ?? []) as Array<{ key: string; url: string }>;
        const map = assets.reduce<Record<string, string>>((acc, row) => {
          acc[row.key] = row.url;
          return acc;
        }, {});
        setDownloadLinks({
          brochure: map.company_brochure_pdf_url || '/downloads/company-brochure.pdf',
          catalogue: map.product_catalogue_pdf_url || '/downloads/product-catalogue.pdf',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        {/* Background image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&q=80"
            alt="Healthcare background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -left-16 bottom-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="container-xl relative z-10 py-24 md:py-32">
          <div className="max-w-3xl">
            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-4"
            >
              Rezichem Healthcare
            </motion.p>
            <motion.h1
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-display text-white leading-tight mb-6"
            >
              Delivering Quality Pharmaceutical Solutions for a Healthier Tomorrow
            </motion.h1>
            <motion.p
              variants={fadeUp} initial="hidden" animate="visible" custom={2}
              className="text-lg text-primary-200/80 leading-relaxed mb-10 max-w-xl"
            >
              Trusted pharmaceutical formulations crafted with precision, quality, and care — serving healthcare professionals and patients across India.
            </motion.p>
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={3}
              className="flex flex-wrap gap-4"
            >
              <Link href="/products" className="btn-primary text-base px-8 py-3.5">
                Explore Products <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={downloadLinks.brochure}
                download
                className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/60 text-base px-8 py-3.5"
              >
                <Download className="w-4 h-4" /> Download Brochure
              </a>
              <a
                href={downloadLinks.catalogue}
                download
                className="btn-outline border-white/30 text-white hover:bg-white/10 hover:border-white/60 text-base px-8 py-3.5"
              >
                <Download className="w-4 h-4" /> Download Product List
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-neutral-100">
        <div className="container-xl py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-1">
                  <s.icon className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-3xl font-display font-bold text-primary-700">{s.value}</p>
                <p className="text-sm text-neutral-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ────────────────────────────────────────────────────────── */}
      <section className="section-pad bg-neutral-50">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative rounded-2xl overflow-hidden h-80 md:h-96">
                <Image
                  src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80"
                  alt="Pharmaceutical lab"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-3">Who We Are</p>
              <h2 className="text-3xl md:text-4xl font-display text-neutral-800 mb-5">
                Committed to Quality. Driven by Care.
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Rezichem Healthcare is a trusted pharmaceutical company committed to providing high-quality, affordable medicines to healthcare professionals and patients across India. With over 15 years of experience, we combine innovation with integrity to meet evolving healthcare needs.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-8">
                Our extensive product portfolio spans across multiple therapeutic categories, ensuring comprehensive coverage for diverse medical needs. We work closely with doctors, pharmacists, and distributors to deliver reliable healthcare solutions.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="section-pad bg-white">
          <div className="container-xl">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-2">Our Products</p>
                <h2 className="text-3xl md:text-4xl font-display text-neutral-800">Featured Products</h2>
              </div>
              <Link href="/products?featured=true" className="hidden sm:flex items-center gap-1 text-primary-600 font-medium text-sm hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link href="/products?featured=true" className="btn-outline">
                View All Products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Business Opportunity ─────────────────────────────────────────── */}
      <section className="section-pad bg-gradient-to-br from-primary-800 to-primary-900 text-white">
        <div className="container-xl">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Truck className="w-12 h-12 text-primary-300 mx-auto mb-5" />
              <h2 className="text-3xl md:text-4xl font-display mb-4">Partner With Us</h2>
              <p className="text-primary-200 text-lg leading-relaxed mb-8">
                We invite distributors, stockists, and healthcare businesses to join our growing network. Build a profitable partnership with a trusted pharmaceutical brand and serve your region with quality products.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/contact?type=distribution" className="btn-accent px-8 py-3.5 text-base">
                  Distribution Partnership <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact?type=b2b" className="btn-outline border-white/30 text-white hover:bg-white/10 px-8 py-3.5 text-base">
                  B2B Collaboration
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
