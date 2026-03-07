export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url?: string | null;
  product_count?: number;
  is_active?: boolean;
  sort_order?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  composition: string | null;
  dosage_form: string | null;
  description: string | null;
  image_url: string | null;
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
}

export interface SearchResult {
  products: Product[];
  query: string;
  total: number;
}

export interface SiteAsset {
  key: string;
  url: string;
  updated_at?: string;
}
