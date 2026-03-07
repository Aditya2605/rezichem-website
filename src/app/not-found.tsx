import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-display font-bold text-primary-100">404</p>
        <h2 className="text-2xl font-display text-neutral-700 mt-2 mb-4">Page Not Found</h2>
        <p className="text-neutral-500 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </div>
  );
}
