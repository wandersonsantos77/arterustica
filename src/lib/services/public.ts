import type {
  Category,
  LeadInsert,
  Product,
  ProductRow,
  ProductVariant,
  Testimonial,
} from '../database.types';
import { supabase } from '../supabase';

function mapProduct(product: ProductRow & { category?: Category | null }): Product {
  return {
    ...product,
    category: product.category ?? null,
  };
}

export async function fetchHomePageData(): Promise<{
  featured: Product[];
  testimonials: Testimonial[];
  categories: Category[];
}> {
  const [featuredResult, testimonialsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .eq('is_active', true)
      .limit(4),
    supabase.from('testimonials').select('*').eq('is_active', true).limit(4),
    supabase.from('categories').select('*').order('display_order'),
  ]);

  if (featuredResult.error) throw featuredResult.error;
  if (testimonialsResult.error) throw testimonialsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;

  return {
    featured: (featuredResult.data ?? []).map((product) => mapProduct(product as ProductRow & { category?: Category | null })),
    testimonials: (testimonialsResult.data ?? []) as Testimonial[],
    categories: (categoriesResult.data ?? []) as Category[],
  };
}

export async function fetchCatalogData(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('display_order'),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (categoriesResult.error) throw categoriesResult.error;

  return {
    products: (productsResult.data ?? []).map((product) => mapProduct(product as ProductRow & { category?: Category | null })),
    categories: (categoriesResult.data ?? []) as Category[],
  };
}

export async function fetchProductDetails(slug: string): Promise<{
  product: Product | null;
  variants: ProductVariant[];
}> {
  const productResult = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (productResult.error) {
    throw productResult.error;
  }

  const product = productResult.data
    ? mapProduct(productResult.data as ProductRow & { category?: Category | null })
    : null;

  if (!product) {
    return { product: null, variants: [] };
  }

  const variantsResult = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', product.id)
    .eq('is_active', true)
    .order('price_base', { ascending: true });

  if (variantsResult.error) {
    throw variantsResult.error;
  }

  return {
    product,
    variants: (variantsResult.data ?? []) as ProductVariant[],
  };
}

export async function submitLead(payload: LeadInsert): Promise<void> {
  const { error } = await supabase.from('leads').insert(payload);

  if (error) {
    throw error;
  }
}
