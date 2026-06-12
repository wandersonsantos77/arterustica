/*
  # Fix RLS Policies - Restrict Write Access to Admin Users Only

  ## Problem
  All write policies (INSERT, UPDATE, DELETE) for categories, products, testimonials,
  and leads were using `true` as the condition, effectively allowing any authenticated
  user unrestricted write access.

  ## Solution
  Replace all write policies with ones that verify the authenticated user has
  `is_admin = true` in their `app_metadata` (set server-side via Supabase Auth admin API).

  This means:
  - Only users explicitly granted admin status can modify data
  - Regular authenticated users (e.g. future customer accounts) cannot write
  - The `leads` INSERT policy remains open to anon/authenticated for form submissions,
    but is now intentionally documented as a public intake form (no user data exposed)
  - The `leads` UPDATE policy is restricted to admins only (for status changes)

  ## Tables affected
  - categories: INSERT, UPDATE, DELETE
  - products: INSERT, UPDATE, DELETE
  - testimonials: INSERT, UPDATE, DELETE
  - leads: UPDATE (INSERT kept open for public form submission)
*/

-- Helper: check if current user is admin via app_metadata
-- app_metadata cannot be modified by the user themselves (only via service_role)
-- so this is a safe authorization check

-- ============================================================
-- CATEGORIES - drop old permissive policies, add admin-only
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;

CREATE POLICY "Admin users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- ============================================================
-- PRODUCTS - drop old permissive policies, add admin-only
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

CREATE POLICY "Admin users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- ============================================================
-- TESTIMONIALS - drop old permissive policies, add admin-only
-- ============================================================

DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can delete testimonials" ON testimonials;

CREATE POLICY "Admin users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

CREATE POLICY "Admin users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );

-- ============================================================
-- LEADS - keep INSERT open (public contact form), restrict UPDATE
-- ============================================================

-- The INSERT policy for leads is intentionally open to anon/authenticated:
-- it is a public intake form. No sensitive data is read back.
-- The WITH CHECK (true) is acceptable here because:
--   1. Only INSERT is allowed (no SELECT for anon, no UPDATE/DELETE)
--   2. The data submitted is contact info voluntarily provided by the user
-- We leave it as-is but document it explicitly.

DROP POLICY IF EXISTS "Authenticated users can update leads" ON leads;

CREATE POLICY "Admin users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean = true
  );
