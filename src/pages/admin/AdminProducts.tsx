import { useEffect, useState } from 'react';
import { Plus, Pencil, ToggleLeft, ToggleRight, Star, X, Check } from 'lucide-react';
import type { Product, Category, ProductInsert } from '../../lib/database.types';
import { getErrorMessage } from '../../lib/errors';
import { fetchAdminProducts, saveProduct, updateProductFlags } from '../../lib/services/admin';

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  dimensions: string;
  weight: string;
  category_id: string;
  images: string;
  in_stock: boolean;
  is_featured: boolean;
  is_active: boolean;
};

const EMPTY_FORM: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  dimensions: '',
  weight: '',
  category_id: '',
  images: '',
  in_stock: true,
  is_featured: false,
  is_active: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAdminProducts();
      setProducts(data.products);
      setCategories(data.categories);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os produtos do painel.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price != null ? String(product.price) : '',
      dimensions: product.dimensions,
      weight: product.weight,
      category_id: product.category_id ?? '',
      images: product.images?.join('\n') ?? '',
      in_stock: product.in_stock,
      is_featured: product.is_featured,
      is_active: product.is_active,
    });
    setShowForm(true);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload: ProductInsert = {
      name: form.name,
      slug: form.slug || generateSlug(form.name),
      description: form.description,
      price: form.price ? parseFloat(form.price) : null,
      dimensions: form.dimensions,
      weight: form.weight,
      category_id: form.category_id || null,
      images: form.images.split('\n').map((s) => s.trim()).filter(Boolean),
      in_stock: form.in_stock,
      is_featured: form.is_featured,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      await saveProduct(editing?.id ?? null, payload);
      await load();
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar o produto.'));
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(product: Product) {
    try {
      await updateProductFlags(product.id, { is_active: !product.is_active });
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_active: !p.is_active } : p));
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel atualizar o status do produto.'));
    }
  }

  async function toggleFeatured(product: Product) {
    try {
      await updateProductFlags(product.id, { is_featured: !product.is_featured });
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, is_featured: !p.is_featured } : p));
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel atualizar o destaque do produto.'));
    }
  }

  function toggleFormField(field: 'in_stock' | 'is_featured' | 'is_active') {
    setForm((current) => ({ ...current, [field]: !current[field] }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Produtos</h1>
          <p className="text-stone-500 text-sm mt-0.5">{products.length} produto(s) no catálogo</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full text-sm transition-colors"
        >
          <Plus size={16} /> Novo Produto
        </button>
      </div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Produto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Preço</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Estoque</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {products.map((product) => (
                  <tr key={product.id} className={`hover:bg-stone-50 transition-colors ${!product.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-stone-800 leading-tight">{product.name}</p>
                          {product.is_featured && (
                            <span className="text-xs text-amber-600 font-medium">Destaque</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-stone-500 hidden sm:table-cell">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-700 font-medium hidden md:table-cell">
                      {product.price != null ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Consulta'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.in_stock ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'}`}>
                        {product.in_stock ? 'Em Estoque' : 'Encomenda'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product.is_active ? 'bg-blue-100 text-blue-700' : 'bg-stone-100 text-stone-500'}`}>
                        {product.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 text-stone-400 hover:text-amber-600 transition-colors"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => toggleFeatured(product)}
                          className={`p-1.5 transition-colors ${product.is_featured ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}
                          title="Destaque"
                        >
                          <Star size={15} />
                        </button>
                        <button
                          onClick={() => toggleActive(product)}
                          className={`p-1.5 transition-colors ${product.is_active ? 'text-green-500 hover:text-red-400' : 'text-stone-300 hover:text-green-400'}`}
                          title={product.is_active ? 'Desativar' : 'Ativar'}
                        >
                          {product.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-6 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-bold text-stone-800">{editing ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Nome *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="Nome do produto"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Slug</label>
                  <input
                    type="text" value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="gerado-automaticamente"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Descrição</label>
                <textarea
                  rows={3} value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Preço (R$)</label>
                  <input
                    type="number" step="0.01" min="0" value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="0,00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Dimensões</label>
                  <input
                    type="text" value={form.dimensions}
                    onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="50cm x 45cm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Peso</label>
                  <input
                    type="text" value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="18kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Categoria</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">URLs das Imagens (uma por linha)</label>
                <textarea
                  rows={3} value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex flex-wrap gap-4">
                {([
                  { key: 'in_stock', label: 'Em Estoque' },
                  { key: 'is_featured', label: 'Destaque' },
                  { key: 'is_active', label: 'Ativo' },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => toggleFormField(key)}
                      className={`w-10 h-5 rounded-full transition-colors flex items-center ${form[key] ? 'bg-amber-600' : 'bg-stone-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mx-0.5 transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-stone-700">{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-semibold rounded-full text-sm transition-colors"
                >
                  <Check size={15} /> {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 border border-stone-200 text-stone-600 font-semibold rounded-full text-sm hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
