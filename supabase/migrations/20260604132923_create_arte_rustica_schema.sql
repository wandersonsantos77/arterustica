/*
  # Arte Rustica - Schema Inicial

  ## Tabelas criadas

  1. `categories` - Categorias de ambientes de decoracao
     - id, name, slug, description, icon_name, image_url, display_order

  2. `products` - Catalogo de produtos
     - id, name, slug, description, price, dimensions, weight
     - category_id (FK), images (array), in_stock, is_featured, is_active
     - created_at, updated_at

  3. `leads` - Contatos e pedidos de orcamento
     - id, name, phone, email, message, product_id (opcional)
     - client_type (individual | professional), status, created_at

  4. `testimonials` - Depoimentos de clientes
     - id, author_name, author_role, content, rating, is_active, created_at

  ## Seguranca
  - RLS habilitado em todas as tabelas
  - Leitura publica para catalogo ativo (products, categories, testimonials)
  - Insercao publica para leads (formulario de contato)
  - Escrita restrita a usuarios autenticados (admin)
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon_name text DEFAULT 'flower',
  image_url text DEFAULT '',
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  price numeric(10,2),
  dimensions text DEFAULT '',
  weight text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  images text[] DEFAULT '{}',
  in_stock boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  message text DEFAULT '',
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text DEFAULT '',
  client_type text DEFAULT 'individual' CHECK (client_type IN ('individual', 'professional')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_role text DEFAULT '',
  content text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active testimonials"
  ON testimonials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- SEED DATA - Categories
-- ============================================================
INSERT INTO categories (name, slug, description, icon_name, display_order) VALUES
  ('Jardim', 'jardim', 'Vasos, fontes, estatuas e decoracoes para jardins e areas verdes', 'flower-2', 1),
  ('Varanda', 'varanda', 'Pecas elegantes para varandas, sacadas e areas de lazer externas', 'home', 2),
  ('Piscina', 'piscina', 'Decoracoes resistentes a umidade para bordas e areas de piscina', 'waves', 3),
  ('Entrada e Porteira', 'entrada-porteira', 'Pilares, vasos e pecas para entradas de garagem, sitios e fazendas', 'gate', 4),
  ('Arte Religiosa', 'arte-religiosa', 'Imagens sacras, oragoes esculpidas e pecas de devoção', 'church', 5),
  ('Mobiliario Rustico', 'mobiliario-rustico', 'Mesas, bancos e conjuntos com acabamento rustico em cimento', 'armchair', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- SEED DATA - Testimonials
-- ============================================================
INSERT INTO testimonials (author_name, author_role, content, rating) VALUES
  ('Ana Lima', 'Arquiteta de Interiores', 'Trabalho com o Ricardo ha 3 anos. A qualidade das pecas e a capacidade de personalizacao sao excepcionais. Meus clientes sempre ficam encantados com o resultado final.', 5),
  ('Carlos Mendes', 'Dono de Sitio em Marica', 'Comprei os pilares para a entrada da minha fazenda e ficou lindo. Pecas solidas, bem acabadas e com um preco justo. Recomendo demais!', 5),
  ('Patricia Souza', 'Paisagista', 'A fonte de tres andares e simplesmente deslumbrante. O artesanato e feito com muito cuidado e os detalhes sao impressionantes. Ja indiquei para varios clientes.', 5),
  ('Roberto Alves', 'Decorador', 'Encontrei o atelier na BR101 e foi amor a primeira vista. As pecas tem uma autenticidade que produtos industrializados jamais terao. Parceiro fixo para meus projetos.', 5)
ON CONFLICT DO NOTHING;

-- ============================================================
-- SEED DATA - Products
-- ============================================================
INSERT INTO products (name, slug, description, price, dimensions, weight, category_id, images, in_stock, is_featured) VALUES
  (
    'Vaso Redondo Grande',
    'vaso-redondo-grande',
    'Vaso classico em cimento com acabamento liso, ideal para plantas de grande porte. Resistente as intemperies e com otimo escoamento de agua.',
    280.00,
    '50cm x 45cm',
    '18kg',
    (SELECT id FROM categories WHERE slug = 'jardim'),
    ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80'],
    true,
    true
  ),
  (
    'Fonte Tres Andares',
    'fonte-tres-andares',
    'Elegante fonte de tres andares com detalhes esculpidos a mao. Um ponto focal perfeito para jardins, entradas e espacos de relaxamento.',
    1850.00,
    '120cm altura x 90cm base',
    '85kg',
    (SELECT id FROM categories WHERE slug = 'jardim'),
    ARRAY['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80'],
    false,
    true
  ),
  (
    'Conjunto Mesa e Bancos Rusticos',
    'conjunto-mesa-bancos-rusticos',
    'Conjunto de mesa e 4 bancos com acabamento imitando tronco de arvore. Ideal para jardins e varandas. Pecas robustas com pintura protetora.',
    2200.00,
    'Mesa: 100cm x 75cm | Bancos: 40cm',
    '120kg conjunto',
    (SELECT id FROM categories WHERE slug = 'mobiliario-rustico'),
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
    true,
    true
  ),
  (
    'Pilar de Entrada',
    'pilar-de-entrada',
    'Pilar decorativo para entradas de garagem, sitios e fazendas. Disponivel em diferentes alturas. Vendido em par para uma entrada imponente.',
    650.00,
    '120cm altura x 30cm base',
    '45kg cada',
    (SELECT id FROM categories WHERE slug = 'entrada-porteira'),
    ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'],
    true,
    true
  ),
  (
    'Vaso Tulipa',
    'vaso-tulipa',
    'Vaso com formato tulipa, design delicado e elegante. Perfeito para varandas e jardins. Disponivel em tamanhos P, M e G.',
    180.00,
    '35cm x 30cm',
    '8kg',
    (SELECT id FROM categories WHERE slug = 'varanda'),
    ARRAY['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80'],
    true,
    false
  ),
  (
    'Nossa Senhora das Gracas',
    'nossa-senhora-gracas',
    'Imagem de Nossa Senhora das Gracas esculpida em cimento com acabamento envelhecido. Detalhes finos e expressao serena. Peca de colecao.',
    420.00,
    '60cm altura',
    '12kg',
    (SELECT id FROM categories WHERE slug = 'arte-religiosa'),
    ARRAY['https://images.unsplash.com/photo-1548625149-720754520a5a?w=600&q=80'],
    true,
    false
  ),
  (
    'Fonte Parede',
    'fonte-parede',
    'Fonte de parede com mascara decorativa. Ideal para jardins verticais, muros e entradas. Inclui bomba dagua.',
    780.00,
    '60cm x 80cm',
    '30kg',
    (SELECT id FROM categories WHERE slug = 'jardim'),
    ARRAY['https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80'],
    true,
    false
  ),
  (
    'Banco Rustico Simples',
    'banco-rustico-simples',
    'Banco individual com acabamento rustico em cimento. Robusto, resistente e com visual natural. Perfeito para jardins e varandas.',
    320.00,
    '100cm x 40cm x 45cm',
    '35kg',
    (SELECT id FROM categories WHERE slug = 'varanda'),
    ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'],
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;
