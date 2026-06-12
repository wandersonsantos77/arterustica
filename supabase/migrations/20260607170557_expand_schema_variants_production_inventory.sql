/*
  # Expand Schema: Product Variants, Production & Inventory Management
  
  Adds comprehensive support for:
  - Product variations (size, finish, color)
  - Materials and molds tracking
  - Production orders and batches
  - Inventory management
  - Shipping zones and logistics
  - Order history with status tracking
*/

-- ============================================================
-- ENUMS for finish types and production status
-- ============================================================

CREATE TYPE finish_type AS ENUM ('cru', 'pre-pintura', 'pintado');
CREATE TYPE production_status AS ENUM ('design', 'moldagem', 'cura', 'acabamento', 'qualidade', 'embalagem', 'pronto', 'entregue');
CREATE TYPE order_status AS ENUM ('novo', 'orcamento_enviado', 'negociacao', 'confirmado', 'em_producao', 'pronto', 'em_entrega', 'entregue', 'cancelado');

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku text NOT NULL,
  name text DEFAULT '',
  size_cm text DEFAULT '',
  finish finish_type DEFAULT 'cru',
  color text DEFAULT '',
  price_base numeric(10,2) DEFAULT 0,
  price_finish_multiplier numeric(5,2) DEFAULT 1.0,
  price_final numeric(10,2) GENERATED ALWAYS AS (price_base * price_finish_multiplier) STORED,
  production_time_days integer DEFAULT 7,
  in_stock_mostruario integer DEFAULT 0,
  requires_custom_mold boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(product_id, sku)
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active variants"
  ON product_variants FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admin can manage variants"
  ON product_variants FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update variants"
  ON product_variants FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can delete variants"
  ON product_variants FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- MATERIALS (matérias-primas)
-- ============================================================

CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  unit text DEFAULT 'kg',
  cost_per_unit numeric(10,4) DEFAULT 0,
  stock_current numeric(12,2) DEFAULT 0,
  stock_minimum numeric(12,2) DEFAULT 50,
  supplier text DEFAULT '',
  last_purchase_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read materials"
  ON materials FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can manage materials"
  ON materials FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update materials"
  ON materials FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- MOLDS (formas/moldes)
-- ============================================================

CREATE TABLE IF NOT EXISTS molds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  mold_type text DEFAULT 'standard',
  material text DEFAULT 'silicone',
  last_used_date timestamptz,
  condition text DEFAULT 'boa',
  lifetime_uses integer DEFAULT 0,
  maintenance_schedule_days integer DEFAULT 30,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE molds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read molds"
  ON molds FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can manage molds"
  ON molds FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update molds"
  ON molds FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- SHIPPING ZONES (zonas de entrega)
-- ============================================================

CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cities text[] DEFAULT '{}',
  base_shipping_cost numeric(10,2) DEFAULT 0,
  cost_per_km numeric(6,2) DEFAULT 0,
  estimated_days integer DEFAULT 3,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read zones"
  ON shipping_zones FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Public can read zones"
  ON shipping_zones FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "Admin can manage zones"
  ON shipping_zones FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update zones"
  ON shipping_zones FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- PRODUCTION BATCHES (lotes de produção)
-- ============================================================

CREATE TABLE IF NOT EXISTS production_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  mold_id uuid REFERENCES molds(id) ON DELETE SET NULL,
  batch_number text UNIQUE NOT NULL,
  quantity_planned integer DEFAULT 1,
  quantity_produced integer DEFAULT 0,
  status production_status DEFAULT 'design',
  started_at timestamptz,
  completed_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE production_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read batches"
  ON production_batches FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can manage batches"
  ON production_batches FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update batches"
  ON production_batches FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- INVENTORY STOCK (controle de estoque)
-- ============================================================

CREATE TABLE IF NOT EXISTS inventory_stock (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  location text DEFAULT 'mostruario',
  quantity_available integer DEFAULT 0,
  quantity_reserved integer DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(product_variant_id, location)
);

ALTER TABLE inventory_stock ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read stock"
  ON inventory_stock FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update stock"
  ON inventory_stock FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- ORDER HISTORY (histórico de pedidos)
-- ============================================================

CREATE TABLE IF NOT EXISTS order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  shipping_zone_id uuid REFERENCES shipping_zones(id) ON DELETE SET NULL,
  shipping_address text,
  status order_status DEFAULT 'novo',
  total_value numeric(12,2),
  shipping_cost numeric(10,2) DEFAULT 0,
  notes text DEFAULT '',
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read orders"
  ON order_history FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can manage orders"
  ON order_history FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can update orders"
  ON order_history FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- ORDER ITEMS (itens do pedido - variantes)
-- ============================================================

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES order_history(id) ON DELETE CASCADE,
  product_variant_id uuid NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
  quantity integer DEFAULT 1,
  price_unit numeric(10,2),
  subtotal numeric(12,2) GENERATED ALWAYS AS (quantity * price_unit) STORED
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can read order items"
  ON order_items FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can manage order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- INDEXES para performance
-- ============================================================

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_finish ON product_variants(finish);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_production_batches_status ON production_batches(status);
CREATE INDEX idx_production_batches_variant_id ON production_batches(product_variant_id);
CREATE INDEX idx_inventory_stock_variant_id ON inventory_stock(product_variant_id);
CREATE INDEX idx_order_history_status ON order_history(status);
CREATE INDEX idx_order_history_created_at ON order_history(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================================
-- SEED DATA: Chafariz Variants and Materials
-- ============================================================

-- Add materials
INSERT INTO materials (name, category, unit, cost_per_unit, stock_current, stock_minimum, is_active)
VALUES 
  ('Cimento CP II 32', 'cimento', 'kg', 0.45, 500, 100, true),
  ('Pigmento Azul Ultramar', 'pigmento', 'kg', 25.00, 50, 10, true),
  ('Pigmento Verde Óxido', 'pigmento', 'kg', 22.00, 30, 10, true),
  ('Aditivo Superplastificante', 'aditivo', 'litro', 8.00, 20, 5, true),
  ('Selante Acrílico Transparente', 'selante', 'litro', 45.00, 15, 5, true)
ON CONFLICT DO NOTHING;

-- Add mold for chafariz
INSERT INTO molds (product_id, name, description, mold_type, material, condition, lifetime_uses, is_active)
SELECT id, 'Forma Chafariz 3 Andares', 'Molde silicone alta resistência', 'standard', 'silicone', 'boa', 0, true
FROM products WHERE slug = 'fonte-tres-andares' LIMIT 1
ON CONFLICT DO NOTHING;

-- Add product variants for chafariz
INSERT INTO product_variants (product_id, sku, name, size_cm, finish, color, price_base, price_finish_multiplier, production_time_days, in_stock_mostruario, is_active)
SELECT 
  id,
  variant_data->>'sku',
  variant_data->>'name',
  variant_data->>'size_cm',
  (variant_data->>'finish')::finish_type,
  variant_data->>'color',
  (variant_data->>'price_base')::numeric,
  (variant_data->>'multiplier')::numeric,
  (variant_data->>'days')::integer,
  (variant_data->>'stock')::integer,
  true
FROM products,
LATERAL jsonb_array_elements('[
  {"sku":"CHA-80-CRU","name":"Chafariz P - Cru","size_cm":"80cm","finish":"cru","color":"","price_base":"1200.00","multiplier":"1.0","days":7,"stock":0},
  {"sku":"CHA-80-PRE","name":"Chafariz P - Pré-Pintura","size_cm":"80cm","finish":"pre-pintura","color":"","price_base":"1200.00","multiplier":"1.15","days":10,"stock":0},
  {"sku":"CHA-80-BRANCO","name":"Chafariz P - Branco","size_cm":"80cm","finish":"pintado","color":"Branco","price_base":"1200.00","multiplier":"1.35","days":12,"stock":1},
  {"sku":"CHA-80-AZUL","name":"Chafariz P - Azul","size_cm":"80cm","finish":"pintado","color":"Azul Ultramar","price_base":"1200.00","multiplier":"1.35","days":12,"stock":0},
  {"sku":"CHA-120-CRU","name":"Chafariz M - Cru","size_cm":"120cm","finish":"cru","color":"","price_base":"1850.00","multiplier":"1.0","days":10,"stock":1},
  {"sku":"CHA-120-PRE","name":"Chafariz M - Pré-Pintura","size_cm":"120cm","finish":"pre-pintura","color":"","price_base":"1850.00","multiplier":"1.15","days":14,"stock":0},
  {"sku":"CHA-120-BRANCO","name":"Chafariz M - Branco","size_cm":"120cm","finish":"pintado","color":"Branco","price_base":"1850.00","multiplier":"1.35","days":16,"stock":2},
  {"sku":"CHA-120-AZUL","name":"Chafariz M - Azul","size_cm":"120cm","finish":"pintado","color":"Azul Ultramar","price_base":"1850.00","multiplier":"1.35","days":16,"stock":1},
  {"sku":"CHA-120-VERDE","name":"Chafariz M - Verde","size_cm":"120cm","finish":"pintado","color":"Verde Óxido","price_base":"1850.00","multiplier":"1.35","days":16,"stock":0},
  {"sku":"CHA-150-CRU","name":"Chafariz G - Cru","size_cm":"150cm","finish":"cru","color":"","price_base":"2500.00","multiplier":"1.0","days":14,"stock":0},
  {"sku":"CHA-150-PRE","name":"Chafariz G - Pré-Pintura","size_cm":"150cm","finish":"pre-pintura","color":"","price_base":"2500.00","multiplier":"1.15","days":18,"stock":0},
  {"sku":"CHA-150-AZUL","name":"Chafariz G - Azul","size_cm":"150cm","finish":"pintado","color":"Azul Ultramar","price_base":"2500.00","multiplier":"1.35","days":20,"stock":0}
]'::jsonb) AS variant_data
WHERE slug = 'fonte-tres-andares'
ON CONFLICT (product_id, sku) DO NOTHING;

-- Initialize inventory for all variants
INSERT INTO inventory_stock (product_variant_id, location, quantity_available, quantity_reserved)
SELECT id, 'mostruario', in_stock_mostruario, 0
FROM product_variants
WHERE in_stock_mostruario > 0
ON CONFLICT DO NOTHING;

-- Add shipping zones
INSERT INTO shipping_zones (name, description, cities, base_shipping_cost, cost_per_km, estimated_days, is_active)
VALUES
  ('Grande Rio', 'Rio de Janeiro capital, Niterói, Duque de Caxias, São Gonçalo', 
   ARRAY['Rio de Janeiro', 'Niterói', 'Duque de Caxias', 'São Gonçalo', 'Nova Iguaçu', 'Nilópolis', 'Itaboraí', 'Maricá', 'Seropédica']::text[],
   150.00, 1.50, 2, true),
  ('Região dos Lagos', 'Arraial do Cabo, Búzios, Cabo Frio, Iguaba Grande, Araruama',
   ARRAY['Arraial do Cabo', 'Búzios', 'Cabo Frio', 'Iguaba Grande', 'Araruama', 'Saquarema']::text[],
   300.00, 2.00, 3, true),
  ('Interior RJ', 'Nova Friburgo, Teresópolis, Petrópolis, Vale do Café',
   ARRAY['Nova Friburgo', 'Teresópolis', 'Petrópolis', 'Vassouras', 'Valença']::text[],
   400.00, 2.50, 4, true),
  ('Outras regiões', 'Fora do estado do RJ - orçamento sob consulta',
   ARRAY[]::text[],
   0.00, 0.00, 7, true)
ON CONFLICT DO NOTHING;
