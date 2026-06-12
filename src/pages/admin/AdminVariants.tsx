import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import type { FinishType, ProductRow, ProductVariant, ProductVariantInsert } from '../../lib/database.types';
import { getErrorMessage } from '../../lib/errors';
import { deleteVariant, fetchAdminVariants, saveVariant, updateVariantFlags } from '../../lib/services/admin';

type VariantFormState = {
  product_id: string;
  sku: string;
  name: string;
  size_cm: string;
  finish: FinishType;
  color: string;
  price_base: string;
  price_finish_multiplier: string;
  production_time_days: string;
  in_stock_mostruario: string;
  is_active: boolean;
};

const EMPTY_FORM: VariantFormState = {
  product_id: '',
  sku: '',
  name: '',
  size_cm: '',
  finish: 'cru',
  color: '',
  price_base: '',
  price_finish_multiplier: '1.0',
  production_time_days: '7',
  in_stock_mostruario: '0',
  is_active: true,
};

export default function AdminVariants() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductVariant | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchAdminVariants();
      setProducts(data.products);
      setVariants(data.variants);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar as variantes.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openNew(productId?: string) {
    setEditing(null);
    setForm({ ...EMPTY_FORM, product_id: productId || '' });
    setShowForm(true);
  }

  function openEdit(variant: ProductVariant) {
    setEditing(variant);
    setForm({
      product_id: variant.product_id,
      sku: variant.sku,
      name: variant.name,
      size_cm: variant.size_cm,
      finish: variant.finish,
      color: variant.color,
      price_base: String(variant.price_base),
      price_finish_multiplier: String(variant.price_finish_multiplier),
      production_time_days: String(variant.production_time_days),
      in_stock_mostruario: String(variant.in_stock_mostruario),
      is_active: variant.is_active,
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload: ProductVariantInsert = {
      product_id: form.product_id,
      sku: form.sku,
      name: form.name,
      size_cm: form.size_cm,
      finish: form.finish,
      color: form.color,
      price_base: parseFloat(form.price_base),
      price_finish_multiplier: parseFloat(form.price_finish_multiplier),
      production_time_days: parseInt(form.production_time_days),
      in_stock_mostruario: parseInt(form.in_stock_mostruario),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    };

    try {
      await saveVariant(editing?.id ?? null, payload);
      await load();
      setShowForm(false);
      setEditing(null);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel salvar a variante.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Tem certeza que deseja deletar esta variante?')) {
      try {
        await deleteVariant(id);
        setVariants((prev) => prev.filter((variant) => variant.id !== id));
      } catch (err) {
        setError(getErrorMessage(err, 'Nao foi possivel remover a variante.'));
      }
    }
  }

  async function toggleActive(variant: ProductVariant) {
    try {
      await updateVariantFlags(variant.id, { is_active: !variant.is_active });
      setVariants((prev) => prev.map((item) => item.id === variant.id ? { ...item, is_active: !item.is_active } : item));
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel atualizar o status da variante.'));
    }
  }

  const filtered = filter
    ? variants.filter((v) => {
        const product = products.find((p) => p.id === v.product_id);
        return v.sku.includes(filter) || v.name.includes(filter) || product?.name.includes(filter);
      })
    : variants;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Variantes de Produtos</h1>
          <p className="text-stone-500 text-sm mt-0.5">{variants.length} variante(s)</p>
        </div>
        <button
          onClick={() => openNew()}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full text-sm transition-colors"
        >
          <Plus size={16} /> Nova Variante
        </button>
      </div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por SKU ou nome..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Produto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Tamanho</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Acabamento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Preço Base</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Estoque</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map((variant) => {
                  const product = products.find((p) => p.id === variant.product_id);
                  return (
                    <tr key={variant.id} className={`hover:bg-stone-50 transition-colors ${!variant.is_active ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-medium text-stone-800 text-xs">{variant.sku}</td>
                      <td className="px-4 py-3 text-stone-700">{product?.name ?? 'Produto removido'}</td>
                      <td className="px-4 py-3 text-stone-600">{variant.size_cm}</td>
                      <td className="px-4 py-3 text-stone-600 hidden sm:table-cell text-xs">
                        <span className="px-2 py-1 bg-stone-100 rounded text-stone-700 font-medium">
                          {variant.finish === 'cru' ? 'Cru' : variant.finish === 'pre-pintura' ? 'Pré-Pintura' : 'Pintado'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-700 font-medium hidden md:table-cell">
                        R$ {variant.price_base.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          variant.in_stock_mostruario > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {variant.in_stock_mostruario}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(variant)}
                            className="p-1.5 text-stone-400 hover:text-amber-600 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => toggleActive(variant)}
                            className={`p-1.5 transition-colors ${variant.is_active ? 'text-green-500 hover:text-red-500' : 'text-stone-300 hover:text-green-500'}`}
                          >
                            {variant.is_active ? <Check size={15} /> : <X size={15} />}
                          </button>
                          <button
                            onClick={() => handleDelete(variant.id)}
                            className="p-1.5 text-stone-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              <h2 className="font-bold text-stone-800">{editing ? 'Editar Variante' : 'Nova Variante'}</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Produto *</label>
                  <select
                    required
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="">Selecione um produto</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">SKU *</label>
                  <input
                    type="text" required value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="CHA-120-AZUL"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">Nome da Variante</label>
                <input
                  type="text" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                  placeholder="Chafariz M - Azul"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Tamanho *</label>
                  <input
                    type="text" required value={form.size_cm}
                    onChange={(e) => setForm({ ...form, size_cm: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="120cm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Acabamento *</label>
                  <select
                    required
                    value={form.finish}
                    onChange={(e) => setForm({ ...form, finish: e.target.value as FinishType })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                  >
                    <option value="cru">Cru</option>
                    <option value="pre-pintura">Pré-Pintura</option>
                    <option value="pintado">Pintado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Cor</label>
                  <input
                    type="text" value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="Azul Ultramar"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Preço Base (R$) *</label>
                  <input
                    type="number" step="0.01" min="0" required value={form.price_base}
                    onChange={(e) => setForm({ ...form, price_base: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="1200.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Multiplicador (Acabamento)</label>
                  <input
                    type="number" step="0.01" min="1" value={form.price_finish_multiplier}
                    onChange={(e) => setForm({ ...form, price_finish_multiplier: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                    placeholder="1.35"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Dias de Produção</label>
                  <input
                    type="number" min="1" value={form.production_time_days}
                    onChange={(e) => setForm({ ...form, production_time_days: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 mb-1">Estoque Mostruário</label>
                  <input
                    type="number" min="0" value={form.in_stock_mostruario}
                    onChange={(e) => setForm({ ...form, in_stock_mostruario: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`w-10 h-5 rounded-full transition-colors flex items-center ${form.is_active ? 'bg-amber-600' : 'bg-stone-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full mx-0.5 transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
                <span className="text-sm text-stone-700">Ativo</span>
              </label>

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
