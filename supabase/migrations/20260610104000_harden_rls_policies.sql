/*
  # Harden RLS Policies

  Ajusta politicas legadas que estavam permissivas demais para usuarios autenticados.
  Objetivos:
  - Garantir que apenas administradores possam gerenciar catalogo e depoimentos
  - Restringir leitura e atualizacao de leads a administradores
  - Permitir insert/upsert de estoque apenas para administradores
*/

-- ============================================================
-- CATEGORIES
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
DROP POLICY IF EXISTS "Admin users can insert categories" ON categories;
DROP POLICY IF EXISTS "Admin users can update categories" ON categories;
DROP POLICY IF EXISTS "Admin users can delete categories" ON categories;

CREATE POLICY "Admin users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- PRODUCTS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Admin users can insert products" ON products;
DROP POLICY IF EXISTS "Admin users can update products" ON products;
DROP POLICY IF EXISTS "Admin users can delete products" ON products;

CREATE POLICY "Admin users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- LEADS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can read leads" ON leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;
DROP POLICY IF EXISTS "Admin users can read leads" ON leads;

CREATE POLICY "Admin users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- A policy de update admin-only ja existe em uma migration anterior, mas garantimos aqui.
DROP POLICY IF EXISTS "Admin users can update leads" ON leads;

CREATE POLICY "Admin users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- TESTIMONIALS
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin users can delete testimonials" ON testimonials;

CREATE POLICY "Admin users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true)
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

-- ============================================================
-- INVENTORY STOCK
-- ============================================================

DROP POLICY IF EXISTS "Admin can insert stock" ON inventory_stock;
DROP POLICY IF EXISTS "Admin can delete stock" ON inventory_stock;

CREATE POLICY "Admin can insert stock"
  ON inventory_stock FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);

CREATE POLICY "Admin can delete stock"
  ON inventory_stock FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true);
