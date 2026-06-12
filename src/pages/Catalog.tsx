import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MessageCircle, Package2 } from 'lucide-react';
import type { Product, Category } from '../lib/database.types';
import ProductCard from '../components/ui/ProductCard';
import { getErrorMessage } from '../lib/errors';
import { fetchCatalogData } from '../lib/services/public';
import { buildWhatsAppUrl, generalInquiryMessage } from '../lib/whatsapp';

/* ─── Loading skeleton ───────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 animate-pulse">
      <div className="aspect-[4/3] bg-stone-100" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 bg-stone-100 rounded w-1/4" />
        <div className="h-4 bg-stone-100 rounded w-3/4" />
        <div className="h-3 bg-stone-100 rounded w-full" />
        <div className="h-3 bg-stone-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');

  const activeCategory = searchParams.get('categoria') ?? '';
  const stockFilter = searchParams.get('estoque') ?? '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchCatalogData();
        setProducts(data.products);
        setCategories(data.categories);
      } catch (err) {
        setError(getErrorMessage(err, 'Não foi possível carregar o catálogo agora.'));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (activeCategory) result = result.filter((p) => p.category?.slug === activeCategory);
    if (stockFilter === 'estoque') result = result.filter((p) => p.in_stock);
    else if (stockFilter === 'encomenda') result = result.filter((p) => !p.in_stock);
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category?.name.toLowerCase().includes(term)
      );
    }
    return result;
  }, [activeCategory, products, search, stockFilter]);

  const activeLabel = categories.find((c) => c.slug === activeCategory)?.name;

  function setCategory(slug: string) {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('categoria', slug);
    else params.delete('categoria');
    setSearchParams(params);
  }

  function setStock(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value) params.set('estoque', value);
    else params.delete('estoque');
    setSearchParams(params);
  }

  function clearFilters() {
    setSearchParams({});
    setSearch('');
  }

  const hasFilters = activeCategory || stockFilter || search;

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      {/* ── Hero Banner ── */}
      <div className="relative bg-stone-950 py-16 px-4 text-center overflow-hidden">
        {/* Decorative glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-terracotta-900/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-clay-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <span className="inline-block text-[10px] font-extrabold uppercase tracking-widest text-terracotta-400 mb-3">
            Arte Rústica
          </span>
          <h1 className="text-4xl font-outfit font-bold text-white mt-1 mb-3">
            {activeLabel ? `Catálogo · ${activeLabel}` : 'Catálogo Completo'}
          </h1>
          <p className="text-stone-400 text-sm max-w-md mx-auto">
            Artesanatos em cimento feitos à mão para transformar seus espaços
          </p>
        </div>
      </div>

      {/* ── Category pill-tabs ── */}
      <div className="bg-white border-b border-stone-100 sticky top-[80px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setCategory('')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                !activeCategory
                  ? 'bg-terracotta-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-terracotta-50 hover:text-terracotta-700'
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-terracotta-600 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-terracotta-50 hover:text-terracotta-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Search + filter toolbar ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 transition-all shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-300 hover:text-stone-500"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-2xl border transition-all sm:hidden ${
              showFilters
                ? 'bg-terracotta-600 border-terracotta-600 text-white shadow-md'
                : 'bg-white border-stone-200 text-stone-600 hover:border-terracotta-300'
            }`}
          >
            <SlidersHorizontal size={15} />
            Filtros
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-5 py-3 text-sm font-semibold rounded-2xl border border-stone-200 bg-white text-stone-500 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
            >
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>

        <div className="flex gap-8">
          {/* ── Sidebar ── */}
          <aside className={`shrink-0 w-56 ${showFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="bg-white rounded-2xl border border-stone-100 p-5 sticky top-36 space-y-7 shadow-sm">
              {/* Availability filter */}
              <div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
                  Disponibilidade
                </h3>
                <ul className="space-y-1">
                  {[
                    { value: '', label: 'Todos' },
                    { value: 'estoque', label: 'Em Estoque' },
                    { value: 'encomenda', label: 'Sob Encomenda' },
                  ].map((opt) => (
                    <li key={opt.value}>
                      <button
                        onClick={() => setStock(opt.value)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                          stockFilter === opt.value
                            ? 'bg-terracotta-50 text-terracotta-700 font-semibold'
                            : 'text-stone-600 hover:text-terracotta-700 hover:bg-terracotta-50/60'
                        }`}
                      >
                        {opt.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category filter (also in pills above, for sidebar mode) */}
              <div>
                <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 mb-4">
                  Ambiente
                </h3>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setCategory('')}
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                        !activeCategory
                          ? 'bg-terracotta-50 text-terracotta-700 font-semibold'
                          : 'text-stone-600 hover:text-terracotta-700 hover:bg-terracotta-50/60'
                      }`}
                    >
                      Todos os ambientes
                    </button>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <button
                        onClick={() => setCategory(cat.slug)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${
                          activeCategory === cat.slug
                            ? 'bg-terracotta-50 text-terracotta-700 font-semibold'
                            : 'text-stone-600 hover:text-terracotta-700 hover:bg-terracotta-50/60'
                        }`}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-center text-red-600 text-sm">
                {error}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-24 flex flex-col items-center gap-5">
                <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center">
                  <Package2 size={32} className="text-stone-300" />
                </div>
                <div>
                  <p className="text-stone-500 text-lg font-semibold mb-1">Nenhum produto encontrado</p>
                  <p className="text-stone-400 text-sm">Tente outros filtros ou busque por outro termo.</p>
                </div>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-terracotta-600 text-white font-semibold rounded-full text-sm hover:bg-terracotta-500 transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-stone-400 mb-6 font-medium">
                  <span className="text-stone-700 font-bold">{filteredProducts.length}</span>{' '}
                  produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-gradient-to-br from-terracotta-800 to-terracotta-950 text-white py-14 text-center mt-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        <div className="relative max-w-xl mx-auto px-4">
          <h3 className="text-2xl font-outfit font-bold mb-2">Não encontrou o que procura?</h3>
          <p className="text-terracotta-200 text-sm mb-7 leading-relaxed">
            Fazemos encomendas personalizadas. Fale conosco e descreva o que precisa — trabalhamos com qualquer medida.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/contato"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-terracotta-700 font-bold rounded-full hover:bg-terracotta-50 transition-colors text-sm shadow-lg"
            >
              Solicitar encomenda personalizada
            </Link>
            <a
              href={buildWhatsAppUrl(generalInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-terracotta-700/50 hover:bg-terracotta-600 border border-terracotta-600 text-white font-semibold rounded-full transition-colors text-sm backdrop-blur-sm"
            >
              <MessageCircle size={15} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
