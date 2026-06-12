import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, X, Loader2, Calendar } from 'lucide-react';
import type { Mold, Product, TablesInsert } from '../../lib/database.types';
import { fetchAdminMolds, fetchAdminProducts, saveMold, deleteMold } from '../../lib/services/admin';
import { getErrorMessage } from '../../lib/errors';

export default function AdminMolds() {
  const [molds, setMolds] = useState<(Mold & { product: { name: string } | null })[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [productId, setProductId] = useState<string>('');
  const [description, setDescription] = useState('');
  const [moldType, setMoldType] = useState('standard');
  const [material, setMaterial] = useState('silicone');
  const [condition, setCondition] = useState('boa');
  const [lifetimeUses, setLifetimeUses] = useState(0);
  const [maintenanceDays, setMaintenanceDays] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [moldsData, productsData] = await Promise.all([
        fetchAdminMolds(),
        fetchAdminProducts(),
      ]);
      setMolds(moldsData);
      setProducts(productsData.products);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os moldes ou produtos.'));
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedId(null);
    setName('');
    setProductId('');
    setDescription('');
    setMoldType('standard');
    setMaterial('silicone');
    setCondition('boa');
    setLifetimeUses(0);
    setMaintenanceDays(30);
    setError('');
    setModalOpen(true);
  }

  function openEditModal(mold: Mold) {
    setSelectedId(mold.id);
    setName(mold.name);
    setProductId(mold.product_id || '');
    setDescription(mold.description || '');
    setMoldType(mold.mold_type);
    setMaterial(mold.material);
    setCondition(mold.condition);
    setLifetimeUses(mold.lifetime_uses);
    setMaintenanceDays(mold.maintenance_schedule_days);
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor, digite o nome do molde.');
      return;
    }

    setSaving(true);
    setError('');

    const payload: TablesInsert<'molds'> = {
      name: name.trim(),
      product_id: productId || null,
      description: description.trim() || null,
      mold_type: moldType.trim(),
      material: material.trim(),
      condition: condition.trim(),
      lifetime_uses: Number(lifetimeUses),
      maintenance_schedule_days: Number(maintenanceDays),
      is_active: true,
    };

    try {
      await saveMold(selectedId, payload);
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Ocorreu um erro ao salvar o molde.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja remover o molde "${name}"?`)) {
      return;
    }

    setError('');
    try {
      await deleteMold(id);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel remover o molde.'));
    }
  }

  const filteredMolds = molds.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      (m.product?.name && m.product.name.toLowerCase().includes(search.toLowerCase())) ||
      m.material.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Formas e Moldes</h1>
          <p className="text-sm text-stone-500">Controle de durabilidade, manutenção e integridade dos moldes físicos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus size={16} /> Novo Molde
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Total de Moldes</p>
          <p className="text-2xl font-bold text-stone-800 mt-1">{molds.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Moldes Desgastados/Danificados</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {molds.filter((m) => m.condition === 'desgastada' || m.condition === 'danificada' || m.condition === 'ruim').length}
            </p>
          </div>
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Material Predominante</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">Silicone</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar moldes por nome, produto associado ou material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Molds List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-amber-600" />
            <p className="text-sm text-stone-400">Carregando moldes...</p>
          </div>
        ) : filteredMolds.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 text-lg">Nenhum molde encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Molde / Produto Vinculado</th>
                  <th className="px-6 py-4">Especificações</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Usos Acumulados</th>
                  <th className="px-6 py-4">Manutenção</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMolds.map((mold) => {
                  const isDamaged = mold.condition === 'danificada' || mold.condition === 'ruim';
                  const isWorn = mold.condition === 'desgastada' || mold.condition === 'gasta';
                  return (
                    <tr key={mold.id} className="hover:bg-stone-50 transition-colors text-sm text-stone-700">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-900">{mold.name}</p>
                        {mold.product ? (
                          <span className="text-xs text-stone-400">Produto: {mold.product.name}</span>
                        ) : (
                          <span className="text-xs text-stone-400 italic">Nenhum produto associado</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-stone-800 font-medium capitalize">{mold.mold_type}</p>
                        <span className="text-xs text-stone-400 capitalize">{mold.material}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                          isDamaged
                            ? 'bg-red-100 text-red-700'
                            : isWorn
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {mold.condition}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        {mold.lifetime_uses} usos
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-stone-500">
                          <Calendar size={14} className="text-stone-400" />
                          <span>A cada {mold.maintenance_schedule_days} dias</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(mold)}
                            className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-amber-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(mold.id, mold.name)}
                            className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-800">
                {selectedId ? 'Editar Molde' : 'Novo Molde'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-stone-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Nome do Molde <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Molde Chafariz 3 Andares"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Associar ao Produto (Opcional)
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                >
                  <option value="">Nenhum produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Descrição
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalhes ou observações sobre o molde..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Tipo do Molde
                  </label>
                  <input
                    type="text"
                    value={moldType}
                    onChange={(e) => setMoldType(e.target.value)}
                    placeholder="Ex: standard, custom"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Material do Molde
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Ex: silicone, gesso, madeira"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Conservação
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="boa">Boa</option>
                    <option value="desgastada">Desgastada</option>
                    <option value="danificada">Danificada</option>
                    <option value="manutencao">Em Manutenção</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Usos Realizados
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={lifetimeUses}
                    onChange={(e) => setLifetimeUses(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Ciclo Manutenção (Dias)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={maintenanceDays}
                    onChange={(e) => setMaintenanceDays(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
