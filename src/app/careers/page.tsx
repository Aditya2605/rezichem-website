import type { Metadata } from 'next';
import { Mail, Phone, Briefcase, Heart, TrendingUp, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join the Rezichem Healthcare team. We are always looking for talented professionals in the pharmaceutical industry.',
};

const perks = [
  { icon: Heart, title: 'Meaningful Work', text: 'Contribute to healthcare that makes a real difference in people\'s lives.' },
  { icon: TrendingUp, title: 'Growth Opportunities', text: 'Continuous learning, mentorship, and career advancement in a growing company.' },
  { icon: Users, title: 'Collaborative Culture', text: 'Work with passionate professionals who care about quality and innovation.' },
  { icon: Briefcase, title: 'Competitive Benefits', text: 'Attractive compensation packages and employee wellness programs.' },
];

export default function CareersPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20 md:py-28">
        <div className="container-xl">
          <p className="text-primary-300 text-sm font-semibold tracking-widest uppercase mb-3">Careers</p>
          <h1 className="text-4xl md:text-5xl font-display max-w-2xl leading-tight mb-5">
            Build a Career That Matters
          </h1>
          <p className="text-primary-200 text-lg max-w-xl leading-relaxed">
            Join a team of dedicated professionals working to improve healthcare outcomes across India.
          </p>
        </div>
      </section>

      {/* Message */}
      <section className="section-pad bg-white">
        <div className="container-xl max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display text-neutral-800 mb-6">
              We&rsquo;re Always Happy to Connect
            </h2>
            <p className="text-neutral-600 text-lg leading-relaxed">
              We are always happy to connect with talented professionals. Please reach out to us via email or phone to learn about current opportunities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:careers@rezichem.com"
              className="card p-6 flex items-center gap-4 group hover:border-primary-200"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                <Mail className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Email Us</p>
                <p className="font-semibold text-neutral-800">careers@rezichem.com</p>
              </div>
            </a>
            <a
              href="tel:+911234567890"
              className="card p-6 flex items-center gap-4 group hover:border-primary-200"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-600 transition-colors">
                <Phone className="w-5 h-5 text-primary-600 group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-0.5">Call Us</p>
                <p className="font-semibold text-neutral-800">+91 12345 67890</p>
              </div>
            </a>
          </div>

          <div className="mt-8 bg-primary-50 border border-primary-100 rounded-2xl p-6 text-sm text-primary-800 leading-relaxed">
            <strong>How to apply:</strong> Send your resume and a brief introduction to <a href="mailto:careers@rezichem.com" className="underline">careers@rezichem.com</a>. Our HR team will get back to you within 5 business days if your profile matches our requirements.
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="section-pad bg-neutral-50">
        <div className="container-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display text-neutral-800">Why Work With Us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map(p => (
              <div key={p.title} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-800 mb-2">{p.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
