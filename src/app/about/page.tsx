import type { Metadata } from 'next';
import { CheckCircle2, Target, Eye, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Rezichem Health Care Pvt. Ltd. — ISO certified PCD Pharma Franchise Company established in 2011 in Ahmedabad, Gujarat. Led by Mr. Jitendra Kumar Giri.',
};

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To achieve and sustain our position as a leading pharmaceutical healthcare company. Our continuous improvement translates into success and benefits for our team, our customers and communities.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    text: 'To be the most admired and affordable pharmaceutical company — continuously developing and manufacturing a wide range of pharmaceutical products with the highest regulatory standard.',
  },
  {
    icon: Award,
    title: 'Our Promise',
    text: 'Every product in our portfolio is reasonably priced keeping the patients in mind. Orders are serviced on time, in full quantity, with a portfolio aligned to the latest requirements of the medical fraternity.',
  },
];

const highlights = [
  'ISO Certified PCD Pharma Franchise Company',
  'Established in 2011 — 14+ years of excellence',
  'PAN India presence with monopoly franchise rights',
  'District-level franchise with area-specific monopoly',
  '100+ products across 13 therapeutic categories',
  'Pharmaceutical Syrups, Tablets, Injectables & more',
  'Reasonably priced — patient-first philosophy',
  'Orders serviced on time, in full quantity',
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20 md:py-28">
        <div className="container-xl">
          <p className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3">About Us</p>
          <h1 className="text-4xl md:text-5xl font-display max-w-2xl leading-tight">
            Hope for Better Life
          </h1>
          <p className="text-primary-200 mt-4 text-lg max-w-xl">
            ISO certified PCD Pharma Franchise Company — delivering quality healthcare across India since 2011.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="section-pad bg-white">
        <div className="container-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="text-3xl font-display text-neutral-800 mb-5">
                Established in 2011, Growing Stronger Every Year
              </h2>
              <p className="text-neutral-600 leading-relaxed mb-4">
                Rezichem Health Care Private Limited is a leading PCD Pharma Company with a PAN India presence through a dedicated network of Franchise Partners with Area Specific Monopoly Rights. Situated in Ahmedabad, Gujarat, we have developed full-scale infrastructure across all departments.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-4">
                We offer a robust and well-designed portfolio of a wide range of Pharmaceutical Syrups, Injectables, Tablets and Pharmaceutical Products. Our portfolio is aligned with the latest requirements of the medical fraternity, keeping the interests of patients and partners in mind.
              </p>
              <p className="text-neutral-600 leading-relaxed mb-6">
                Under the headship of <strong className="text-neutral-800">Mr. Jitendra Kumar Giri</strong> (Managing Director), we have gained a huge clientele across the nation by providing PCD Pharma franchise in different parts of India on a monopoly basis at the district level.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '2011', label: 'Year Established' },
                { value: '100+', label: 'Products' },
                { value: '13', label: 'Therapeutic Categories' },
                { value: 'PAN India', label: 'Distribution Reach' },
              ].map(stat => (
                <div key={stat.label} className="card p-6 text-center">
                  <p className="text-3xl font-display font-bold text-primary-600 mb-1">{stat.value}</p>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Promise */}
      <section className="section-pad bg-neutral-50">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-2">What Drives Us</p>
            <h2 className="text-3xl font-display text-neutral-800">Mission, Vision & Promise</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="card p-7">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                  <v.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-display font-semibold text-neutral-800 mb-3">{v.title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-pad bg-white">
        <div className="container-xl">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-semibold tracking-widest uppercase mb-2">Leadership</p>
            <h2 className="text-3xl font-display text-neutral-800">The People Behind Rezichem</h2>
          </div>
          <div className="max-w-sm mx-auto">
            <div className="card p-8 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-display font-bold text-primary-600">JG</span>
              </div>
              <h3 className="text-xl font-display font-semibold text-neutral-800">Mr. Jitendra Kumar Giri</h3>
              <p className="text-primary-600 text-sm font-medium mt-1">Managing Director</p>
              <p className="text-neutral-500 text-sm mt-3 leading-relaxed">
                Under his leadership since 2011, Rezichem has grown into a trusted PAN India pharma franchise company with a dedicated network of partners and a patient-first philosophy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-gradient-to-br from-primary-900 to-primary-800 text-white">
        <div className="container-xl text-center">
          <h2 className="text-3xl font-display mb-4">Become a Franchise Partner</h2>
          <p className="text-primary-200 mb-8 max-w-xl mx-auto">
            Join our growing network of PCD Pharma franchise partners across India with area-specific monopoly rights.
          </p>
          <a href="/contact" className="btn-primary bg-white text-primary-800 hover:bg-primary-50">
            Contact Us Today
          </a>
        </div>
      </section>
    </div>
  );
}
