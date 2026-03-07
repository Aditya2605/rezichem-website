import Link from 'next/link';
import { ArrowRight, Beaker, Leaf, Syringe, Pill, Heart, ShieldPlus, Zap, Droplets, Sun, Activity } from 'lucide-react';
import { Category } from '@/types';

const categoryIcons: Record<string, React.ReactNode> = {
  'digestive-enzymes': <Beaker className="w-6 h-6" />,
  'anti-allergic-cough': <ShieldPlus className="w-6 h-6" />,
  'gastro-hyperacidity': <Activity className="w-6 h-6" />,
  'anthelmintics': <Zap className="w-6 h-6" />,
  'ayurvedic-medicines': <Leaf className="w-6 h-6" />,
  'injections': <Syringe className="w-6 h-6" />,
  'antibacterial': <Pill className="w-6 h-6" />,
  'pain-management': <Heart className="w-6 h-6" />,
  'nutrition-vitamins': <Sun className="w-6 h-6" />,
  'steroids': <Droplets className="w-6 h-6" />,
};

const categoryColors: Record<string, string> = {
  'digestive-enzymes': 'bg-blue-50 text-blue-600',
  'anti-allergic-cough': 'bg-purple-50 text-purple-600',
  'gastro-hyperacidity': 'bg-orange-50 text-orange-600',
  'anthelmintics': 'bg-yellow-50 text-yellow-600',
  'ayurvedic-medicines': 'bg-green-50 text-green-700',
  'injections': 'bg-red-50 text-red-600',
  'antibacterial': 'bg-primary-50 text-primary-600',
  'pain-management': 'bg-pink-50 text-pink-600',
  'nutrition-vitamins': 'bg-amber-50 text-amber-600',
  'steroids': 'bg-indigo-50 text-indigo-600',
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const icon = categoryIcons[category.slug] ?? <Pill className="w-6 h-6" />;
  const color = categoryColors[category.slug] ?? 'bg-primary-50 text-primary-600';
  const hasImage = typeof category.image_url === 'string' && category.image_url.trim().length > 0;

  return (
    <Link
      href={`/products/${category.slug}`}
      className="card p-6 flex flex-col gap-4 group cursor-pointer"
    >
      {hasImage ? (
        <div className="w-full h-28 rounded-xl overflow-hidden bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image_url as string}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      )}
      <div>
        <h3 className="font-display text-base font-semibold text-neutral-800 group-hover:text-primary-700 transition-colors mb-1">
          {category.name}
        </h3>
        {category.description && (
          <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">{category.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto">
        {category.product_count !== undefined && (
          <span className="text-xs text-neutral-400">{category.product_count} products</span>
        )}
        <span className="flex items-center gap-1 text-primary-600 text-sm font-medium group-hover:gap-2 transition-all ml-auto">
          Browse <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
