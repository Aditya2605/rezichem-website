'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Pill, MapPin, Phone, Mail, Linkedin, Facebook, Instagram, Download, Package } from 'lucide-react';

export default function Footer() {
  const [assets, setAssets] = useState({
    brochure: '/downloads/company-brochure.pdf',
    catalogue: '/downloads/product-catalogue.pdf',
    logo: '',
    linkedin: '',
    facebook: '',
    instagram: '',
  });

  useEffect(() => {
    fetch('/api/site-assets', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        const assets = (d.assets ?? []) as Array<{ key: string; url: string }>;
        const map = assets.reduce<Record<string, string>>((acc, row) => {
          acc[row.key] = row.url;
          return acc;
        }, {});
        setAssets({
          brochure: map.company_brochure_pdf_url || '/downloads/company-brochure.pdf',
          catalogue: map.product_catalogue_pdf_url || '/downloads/product-catalogue.pdf',
          logo: map.company_logo_url || '',
          linkedin: map.social_linkedin_url || '',
          facebook: map.social_facebook_url || '',
          instagram: map.social_instagram_url || '',
        });
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-xl py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {assets.logo ? (
                <div className="bg-white rounded-lg px-2 py-1.5 shadow-sm border border-neutral-200/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={assets.logo} alt="Rezichem logo" className="h-9 w-auto max-w-[170px] object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-display text-white font-bold text-base">Rezichem Healthcare</span>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed mb-5">
              Delivering quality pharmaceutical solutions for a healthier tomorrow. Trusted by healthcare professionals across India.
            </p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Company</p>
              <Link href="/about" className="block text-sm hover:text-primary-400 transition-colors">About Rezichem Healthcare</Link>
              <Link href="/careers" className="block text-sm hover:text-primary-400 transition-colors">Careers</Link>
              <Link href="/contact" className="block text-sm hover:text-primary-400 transition-colors">Contact Us</Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Products</p>
            <div className="space-y-2">
              <Link
                href="/products"
                className="flex items-center gap-1.5 text-sm hover:text-primary-400 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                Browse All Products
              </Link>
              <a
                href={assets.catalogue}
                download
                className="flex items-center gap-1.5 text-sm hover:text-primary-400 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download Product List
              </a>
              <a
                href={assets.brochure}
                download
                className="flex items-center gap-1.5 text-sm hover:text-primary-400 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Company Brochure
              </a>
            </div>
          </div>

          {/* Business */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Business Opportunities</p>
            <div className="space-y-2">
              <Link href="/contact?type=distribution" className="block text-sm hover:text-primary-400 transition-colors">Distribution Partnership</Link>
              <Link href="/contact?type=b2b" className="block text-sm hover:text-primary-400 transition-colors">B2B Collaboration</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">Corporate Office</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-neutral-400 leading-relaxed">
                  AF-9, Mamta Complex-1,<br />
                  Sarkhej–Sanand Road, Sarkhej,<br />
                  Ahmedabad – 382210, Gujarat
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="tel:+919904257395" className="hover:text-primary-400 transition-colors">+91 99042 57395</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:rezichemhealthcarepvtltd@gmail.com" className="hover:text-primary-400 transition-colors">rezichemhealthcarepvtltd@gmail.com</a>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href={assets.linkedin || '#'}
                target={assets.linkedin ? '_blank' : undefined}
                rel={assets.linkedin ? 'noopener noreferrer' : undefined}
                aria-label="LinkedIn"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  assets.linkedin ? 'bg-neutral-800 hover:bg-primary-600' : 'bg-neutral-800/50 cursor-default'
                }`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={assets.facebook || '#'}
                target={assets.facebook ? '_blank' : undefined}
                rel={assets.facebook ? 'noopener noreferrer' : undefined}
                aria-label="Facebook"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  assets.facebook ? 'bg-neutral-800 hover:bg-primary-600' : 'bg-neutral-800/50 cursor-default'
                }`}
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={assets.instagram || '#'}
                target={assets.instagram ? '_blank' : undefined}
                rel={assets.instagram ? 'noopener noreferrer' : undefined}
                aria-label="Instagram"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  assets.instagram ? 'bg-neutral-800 hover:bg-primary-600' : 'bg-neutral-800/50 cursor-default'
                }`}
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800">
        <div className="container-xl py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Rezichem Healthcare. All rights reserved.</p>
          <p>Pharmaceutical products are for use under medical supervision.</p>
        </div>
      </div>
    </footer>
  );
}
