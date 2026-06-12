export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          icon_name: string;
          image_url: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          icon_name?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          icon_name?: string;
          image_url?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          price: number | null;
          dimensions: string;
          weight: string;
          category_id: string | null;
          images: string[];
          in_stock: boolean;
          is_featured: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          price?: number | null;
          dimensions?: string;
          weight?: string;
          category_id?: string | null;
          images?: string[];
          in_stock?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          price?: number | null;
          dimensions?: string;
          weight?: string;
          category_id?: string | null;
          images?: string[];
          in_stock?: boolean;
          is_featured?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ];
      };
      leads: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string;
          message: string;
          product_id: string | null;
          product_name: string;
          client_type: 'individual' | 'professional';
          status: 'new' | 'contacted' | 'closed';
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string;
          message?: string;
          product_id?: string | null;
          product_name?: string;
          client_type?: 'individual' | 'professional';
          status?: 'new' | 'contacted' | 'closed';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          email?: string;
          message?: string;
          product_id?: string | null;
          product_name?: string;
          client_type?: 'individual' | 'professional';
          status?: 'new' | 'contacted' | 'closed';
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'leads_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string;
          content: string;
          rating: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_name: string;
          author_role?: string;
          content: string;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_name?: string;
          author_role?: string;
          content?: string;
          rating?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          sku: string;
          name: string;
          size_cm: string;
          finish: Database['public']['Enums']['finish_type'];
          color: string;
          price_base: number;
          price_finish_multiplier: number;
          price_final: number;
          production_time_days: number;
          in_stock_mostruario: number;
          requires_custom_mold: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          sku: string;
          name?: string;
          size_cm?: string;
          finish?: Database['public']['Enums']['finish_type'];
          color?: string;
          price_base?: number;
          price_finish_multiplier?: number;
          production_time_days?: number;
          in_stock_mostruario?: number;
          requires_custom_mold?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          sku?: string;
          name?: string;
          size_cm?: string;
          finish?: Database['public']['Enums']['finish_type'];
          color?: string;
          price_base?: number;
          price_finish_multiplier?: number;
          production_time_days?: number;
          in_stock_mostruario?: number;
          requires_custom_mold?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      materials: {
        Row: {
          id: string;
          name: string;
          category: string;
          unit: string;
          cost_per_unit: number;
          stock_current: number;
          stock_minimum: number;
          supplier: string;
          last_purchase_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          unit?: string;
          cost_per_unit?: number;
          stock_current?: number;
          stock_minimum?: number;
          supplier?: string;
          last_purchase_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          unit?: string;
          cost_per_unit?: number;
          stock_current?: number;
          stock_minimum?: number;
          supplier?: string;
          last_purchase_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      molds: {
        Row: {
          id: string;
          product_id: string | null;
          name: string;
          description: string | null;
          mold_type: string;
          material: string;
          last_used_date: string | null;
          condition: string;
          lifetime_uses: number;
          maintenance_schedule_days: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          name: string;
          description?: string | null;
          mold_type?: string;
          material?: string;
          last_used_date?: string | null;
          condition?: string;
          lifetime_uses?: number;
          maintenance_schedule_days?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          name?: string;
          description?: string | null;
          mold_type?: string;
          material?: string;
          last_used_date?: string | null;
          condition?: string;
          lifetime_uses?: number;
          maintenance_schedule_days?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'molds_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'products';
            referencedColumns: ['id'];
          },
        ];
      };
      shipping_zones: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          cities: string[];
          base_shipping_cost: number;
          cost_per_km: number;
          estimated_days: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          cities?: string[];
          base_shipping_cost?: number;
          cost_per_km?: number;
          estimated_days?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          cities?: string[];
          base_shipping_cost?: number;
          cost_per_km?: number;
          estimated_days?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      production_batches: {
        Row: {
          id: string;
          product_variant_id: string;
          mold_id: string | null;
          batch_number: string;
          quantity_planned: number;
          quantity_produced: number;
          status: Database['public']['Enums']['production_status'];
          started_at: string | null;
          completed_at: string | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_variant_id: string;
          mold_id?: string | null;
          batch_number: string;
          quantity_planned?: number;
          quantity_produced?: number;
          status?: Database['public']['Enums']['production_status'];
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_variant_id?: string;
          mold_id?: string | null;
          batch_number?: string;
          quantity_planned?: number;
          quantity_produced?: number;
          status?: Database['public']['Enums']['production_status'];
          started_at?: string | null;
          completed_at?: string | null;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'production_batches_product_variant_id_fkey';
            columns: ['product_variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'production_batches_mold_id_fkey';
            columns: ['mold_id'];
            isOneToOne: false;
            referencedRelation: 'molds';
            referencedColumns: ['id'];
          },
        ];
      };
      inventory_stock: {
        Row: {
          id: string;
          product_variant_id: string;
          location: string;
          quantity_available: number;
          quantity_reserved: number;
          last_updated: string;
        };
        Insert: {
          id?: string;
          product_variant_id: string;
          location?: string;
          quantity_available?: number;
          quantity_reserved?: number;
          last_updated?: string;
        };
        Update: {
          id?: string;
          product_variant_id?: string;
          location?: string;
          quantity_available?: number;
          quantity_reserved?: number;
          last_updated?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'inventory_stock_product_variant_id_fkey';
            columns: ['product_variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
        ];
      };
      order_history: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          shipping_zone_id: string | null;
          shipping_address: string | null;
          status: Database['public']['Enums']['order_status'];
          total_value: number | null;
          shipping_cost: number;
          notes: string;
          lead_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_zone_id?: string | null;
          shipping_address?: string | null;
          status?: Database['public']['Enums']['order_status'];
          total_value?: number | null;
          shipping_cost?: number;
          notes?: string;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          shipping_zone_id?: string | null;
          shipping_address?: string | null;
          status?: Database['public']['Enums']['order_status'];
          total_value?: number | null;
          shipping_cost?: number;
          notes?: string;
          lead_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_history_shipping_zone_id_fkey';
            columns: ['shipping_zone_id'];
            isOneToOne: false;
            referencedRelation: 'shipping_zones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_history_lead_id_fkey';
            columns: ['lead_id'];
            isOneToOne: false;
            referencedRelation: 'leads';
            referencedColumns: ['id'];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_variant_id: string;
          quantity: number;
          price_unit: number | null;
          subtotal: number | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_variant_id: string;
          quantity?: number;
          price_unit?: number | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_variant_id?: string;
          quantity?: number;
          price_unit?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'order_history';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_variant_id_fkey';
            columns: ['product_variant_id'];
            isOneToOne: false;
            referencedRelation: 'product_variants';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      finish_type: 'cru' | 'pre-pintura' | 'pintado';
      production_status: 'design' | 'moldagem' | 'cura' | 'acabamento' | 'qualidade' | 'embalagem' | 'pronto' | 'entregue';
      order_status:
        | 'novo'
        | 'orcamento_enviado'
        | 'negociacao'
        | 'confirmado'
        | 'em_producao'
        | 'pronto'
        | 'em_entrega'
        | 'entregue'
        | 'cancelado';
    };
    CompositeTypes: Record<string, never>;
  };
}

type PublicSchema = Database['public'];

export type TableName = keyof PublicSchema['Tables'];
export type EnumName = keyof PublicSchema['Enums'];

export type Tables<T extends TableName> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends TableName> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends TableName> = PublicSchema['Tables'][T]['Update'];
export type Enums<T extends EnumName> = PublicSchema['Enums'][T];

export type Category = Tables<'categories'>;
export type ProductRow = Tables<'products'>;
export type Lead = Tables<'leads'>;
export type Testimonial = Tables<'testimonials'>;
export type ProductVariant = Tables<'product_variants'>;
export type Material = Tables<'materials'>;
export type Mold = Tables<'molds'>;
export type ShippingZone = Tables<'shipping_zones'>;
export type ProductionBatch = Tables<'production_batches'>;
export type InventoryStock = Tables<'inventory_stock'>;
export type OrderHistory = Tables<'order_history'>;
export type OrderItem = Tables<'order_items'>;

export type CategoryInsert = TablesInsert<'categories'>;
export type ProductInsert = TablesInsert<'products'>;
export type LeadInsert = TablesInsert<'leads'>;
export type ProductVariantInsert = TablesInsert<'product_variants'>;
export type InventoryStockInsert = TablesInsert<'inventory_stock'>;

export type CategoryUpdate = TablesUpdate<'categories'>;
export type ProductUpdate = TablesUpdate<'products'>;
export type LeadUpdate = TablesUpdate<'leads'>;
export type ProductVariantUpdate = TablesUpdate<'product_variants'>;
export type InventoryStockUpdate = TablesUpdate<'inventory_stock'>;

export type FinishType = Enums<'finish_type'>;
export type ProductionStatus = Enums<'production_status'>;
export type OrderStatus = Enums<'order_status'>;

export type Product = ProductRow & {
  category?: Category | null;
};
