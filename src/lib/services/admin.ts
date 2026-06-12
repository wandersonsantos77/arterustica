import { supabase } from '../supabase';
import { Database, TablesInsert, TablesUpdate } from '../database.types';

// Definindo os atalhos de forma segura baseados no seu arquivo gerado
type Category = Database['public']['Tables']['categories']['Row'];
type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];
type ProductVariant = Database['public']['Tables']['product_variants']['Row'];
type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert'];
type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update'];
type InventoryStock = Database['public']['Tables']['inventory_stock']['Row'];
type InventoryStockInsert = Database['public']['Tables']['inventory_stock']['Insert'];
type Lead = Database['public']['Tables']['leads']['Row'];
type LeadUpdate = Database['public']['Tables']['leads']['Update'];
type Material = Database['public']['Tables']['materials']['Row'];
type Mold = Database['public']['Tables']['molds']['Row'];
type ProductionBatch = Database['public']['Tables']['production_batches']['Row'];

// Tipo Product para manter compatibilidade com a função mapProduct
type Product = ProductRow & { category?: Category | null };

function mapProduct(product: ProductRow & { category?: Category | null }): Product {
  return {
    ...product,
    category: product.category ?? null,
  };
}

export async function fetchDashboardCounts() {
  const [productsResult, leadsResult, newLeadsResult, featuredResult] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('leads').select('id', { count: 'exact', head: true }),
    supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_featured', true).eq('is_active', true),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (leadsResult.error) throw leadsResult.error;
  if (newLeadsResult.error) throw newLeadsResult.error;
  if (featuredResult.error) throw featuredResult.error;

  return {
    products: productsResult.count ?? 0,
    leads: leadsResult.count ?? 0,
    newLeads: newLeadsResult.count ?? 0,
    featured: featuredResult.count ?? 0,
  };
}

export async function fetchAdminProducts(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  const [productsResult, categoriesResult] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(*)')
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

export async function saveProduct(productId: string | null, payload: ProductInsert | ProductUpdate): Promise<void> {
  const result = productId
    ? await supabase.from('products').update(payload as ProductUpdate).eq('id', productId)
    : await supabase.from('products').insert(payload as ProductInsert);

  if (result.error) {
    throw result.error;
  }
}

export async function updateProductFlags(productId: string, payload: Pick<ProductUpdate, 'is_active' | 'is_featured'>): Promise<void> {
  const { error } = await supabase.from('products').update(payload).eq('id', productId);

  if (error) {
    throw error;
  }
}

export async function fetchAdminVariants(): Promise<{
  products: ProductRow[];
  variants: ProductVariant[];
}> {
  const [productsResult, variantsResult] = await Promise.all([
    supabase.from('products').select('*').order('name'),
    supabase.from('product_variants').select('*').order('created_at', { ascending: false }),
  ]);

  if (productsResult.error) throw productsResult.error;
  if (variantsResult.error) throw variantsResult.error;

  return {
    products: (productsResult.data ?? []) as ProductRow[],
    variants: (variantsResult.data ?? []) as ProductVariant[],
  };
}

export async function saveVariant(variantId: string | null, payload: ProductVariantInsert | ProductVariantUpdate): Promise<void> {
  const result = variantId
    ? await supabase.from('product_variants').update(payload as ProductVariantUpdate).eq('id', variantId)
    : await supabase.from('product_variants').insert(payload as ProductVariantInsert);

  if (result.error) {
    throw result.error;
  }
}

export async function updateVariantFlags(variantId: string, payload: Pick<ProductVariantUpdate, 'is_active'>): Promise<void> {
  const { error } = await supabase.from('product_variants').update(payload).eq('id', variantId);

  if (error) {
    throw error;
  }
}

export async function deleteVariant(variantId: string): Promise<void> {
  const { error } = await supabase.from('product_variants').delete().eq('id', variantId);

  if (error) {
    throw error;
  }
}

export async function fetchInventoryData(): Promise<{
  variants: ProductVariant[];
  inventory: InventoryStock[];
}> {
  const [variantsResult, inventoryResult] = await Promise.all([
    supabase.from('product_variants').select('*').eq('is_active', true).order('name'),
    supabase.from('inventory_stock').select('*').order('location'),
  ]);

  if (variantsResult.error) throw variantsResult.error;
  if (inventoryResult.error) throw inventoryResult.error;

  return {
    variants: (variantsResult.data ?? []) as ProductVariant[],
    inventory: (inventoryResult.data ?? []) as InventoryStock[],
  };
}

export async function upsertInventoryStock(payload: InventoryStockInsert): Promise<void> {
  const { error } = await supabase.from('inventory_stock').upsert(payload, {
    onConflict: 'product_variant_id,location',
  });

  if (error) {
    throw error;
  }
}

export async function fetchLeads(): Promise<Lead[]> {
  const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Lead[];
}

export async function updateLeadStatus(leadId: string, payload: Pick<LeadUpdate, 'status'>): Promise<void> {
  const { error } = await supabase.from('leads').update(payload).eq('id', leadId);

  if (error) {
    throw error;
  }
}

export async function fetchAdminMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('name');

  if (error) throw error;
  return (data ?? []) as Material[];
}

export async function saveMaterial(
  materialId: string | null,
  payload: TablesInsert<'materials'> | TablesUpdate<'materials'>
): Promise<void> {
  const result = materialId
    ? await supabase.from('materials').update(payload as TablesUpdate<'materials'>).eq('id', materialId)
    : await supabase.from('materials').insert(payload as TablesInsert<'materials'>);

  if (result.error) throw result.error;
}

export async function deleteMaterial(materialId: string): Promise<void> {
  const { error } = await supabase.from('materials').delete().eq('id', materialId);
  if (error) throw error;
}

export async function fetchAdminMolds(): Promise<(Mold & { product: { name: string } | null })[]> {
  const { data, error } = await supabase
    .from('molds')
    .select('*, product:products(name)')
    .order('name');

  if (error) throw error;
  return (data ?? []) as (Mold & { product: { name: string } | null })[];
}

export async function saveMold(
  moldId: string | null,
  payload: TablesInsert<'molds'> | TablesUpdate<'molds'>
): Promise<void> {
  const result = moldId
    ? await supabase.from('molds').update(payload as TablesUpdate<'molds'>).eq('id', moldId)
    : await supabase.from('molds').insert(payload as TablesInsert<'molds'>);

  if (result.error) throw result.error;
}

export async function deleteMold(moldId: string): Promise<void> {
  const { error } = await supabase.from('molds').delete().eq('id', moldId);
  if (error) throw error;
}

export type ProductionBatchWithDetails = ProductionBatch & {
  product_variant: {
    name: string;
    sku: string;
    product: {
      name: string;
    };
  } | null;
  mold: {
    name: string;
  } | null;
};

export async function fetchProductionBatches(): Promise<ProductionBatchWithDetails[]> {
  const { data, error } = await supabase
    .from('production_batches')
    .select('*, product_variant:product_variants(*, product:products(name)), mold:molds(name)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProductionBatchWithDetails[];
}

export async function saveProductionBatch(
  batchId: string | null,
  payload: TablesInsert<'production_batches'> | TablesUpdate<'production_batches'>
): Promise<void> {
  const result = batchId
    ? await supabase.from('production_batches').update(payload as TablesUpdate<'production_batches'>).eq('id', batchId)
    : await supabase.from('production_batches').insert(payload as TablesInsert<'production_batches'>);

  if (result.error) throw result.error;
}

export async function deleteProductionBatch(batchId: string): Promise<void> {
  const { error } = await supabase.from('production_batches').delete().eq('id', batchId);
  if (error) throw error;
}