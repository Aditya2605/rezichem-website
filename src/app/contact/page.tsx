import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Rezichem Health Care Pvt. Ltd. — AF-9, Mamta Complex-1, Sarkhej-Sanand Road, Ahmedabad. Call +91-9904257395.',
};

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20 md:py-28">
        <div className="container-xl">
          <p className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3">Contact</p>
          <h1 className="text-4xl md:text-5xl font-display max-w-2xl leading-tight">
            Let&rsquo;s Start a Conversation
          </h1>
          <p className="text-primary-200 mt-4 text-lg max-w-xl">
            Reach out for PCD Pharma franchise inquiries, distribution partnerships or any general information.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="container-xl">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Contact Details */}
            <div>
              <h2 className="text-2xl font-display text-neutral-800 mb-6">Corporate Office</h2>
              <div className="space-y-5">

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700 mb-1">Address</p>
                    <p className="text-neutral-600 leading-relaxed">
                      AF-9, Mamta Complex-1,<br />
                      Sarkhej–Sanand Road, Sarkhej,<br />
                      Ahmedabad – 382210,<br />
                      Gujarat, India
                    </p>
                    <a
                      href="https://maps.google.com/?q=22.987320891616847,72.48213921349326"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 text-sm font-medium hover:underline mt-1 inline-block"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700 mb-1">Phone / Mobile</p>
                    <a href="tel:+919904257395" className="text-neutral-600 hover:text-primary-600 transition-colors block">
                      +91 99042 57395
                    </a>
                    <a href="tel:+919430257395" className="text-neutral-600 hover:text-primary-600 transition-colors block">
                      +91 94302 57395
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700 mb-1">Email</p>
                    <a href="mailto:rezichemhealthcarepvtltd@gmail.com" className="text-neutral-600 hover:text-primary-600 transition-colors break-all">
                      rezichemhealthcarepvtltd@gmail.com
                    </a>
                    <br />
                    <a href="mailto:rezichemhealthcarepvtltd@yahoo.in" className="text-neutral-600 hover:text-primary-600 transition-colors break-all text-sm">
                      rezichemhealthcarepvtltd@yahoo.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700 mb-1">Website</p>
                    <a href="https://www.rezichem.co.in" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 transition-colors">
                      www.rezichem.co.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-700 mb-1">Business Hours</p>
                    <p className="text-neutral-600">Monday – Saturday: 9:00 AM – 6:00 PM</p>
                    <p className="text-neutral-500 text-sm">Closed on Sundays and national holidays</p>
                  </div>
                </div>
              </div>

              {/* Quick action cards */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <a
                  href="mailto:rezichemhealthcarepvtltd@gmail.com?subject=PCD Franchise Inquiry"
                  className="card p-4 text-center hover:border-primary-200 transition-colors"
                >
                  <p className="font-semibold text-neutral-700 text-sm">PCD Franchise Inquiry</p>
                  <p className="text-xs text-neutral-500 mt-1">Monopoly rights available district-wise</p>
                </a>
                <a
                  href="mailto:rezichemhealthcarepvtltd@gmail.com?subject=Distribution Partnership"
                  className="card p-4 text-center hover:border-primary-200 transition-colors"
                >
                  <p className="font-semibold text-neutral-700 text-sm">Distribution Partnership</p>
                  <p className="text-xs text-neutral-500 mt-1">Pan-India distribution network</p>
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div>
              <h2 className="text-2xl font-display text-neutral-800 mb-6">Find Us</h2>
              <div className="w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3672.2!2d72.48213921349326!3d22.987320891616847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDU5JzE0LjQiTiA3MsKwMjgnNTUuNyJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Rezichem Health Care Pvt. Ltd. — AF-9 Mamta Complex, Sarkhej, Ahmedabad"
                />
              </div>
              <p className="text-xs text-neutral-400 mt-2 text-center">
                AF-9, Mamta Complex-1, Sarkhej–Sanand Road, Sarkhej, Ahmedabad – 382210
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
