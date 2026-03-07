import Link from 'next/link';
import { Pill, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImage = typeof product.image_url === 'string' && product.image_url.trim().length > 0;

  return (
    <Link
      href={`/products/${product.category_slug}/${product.slug}`}
      className="card p-5 flex flex-col gap-3 group cursor-pointer"
    >
      {hasImage ? (
        <div className="w-full h-36 rounded-xl overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image_url as string}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="w-full h-36 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center">
          <Pill className="w-10 h-10 text-primary-300" />
        </div>
      )}

      <div className="flex-1 flex flex-col gap-1.5">
        <span className="tag">{product.category_name}</span>
        <h3 className="font-display text-base font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors leading-snug">
          {product.name}
        </h3>
        {product.composition && (
          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{product.composition}</p>
        )}
        {product.dosage_form && (
          <span className="text-xs text-neutral-400 font-medium">{product.dosage_form}</span>
        )}
      </div>

      <div className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all">
        View Details <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </Link>
  );
}
