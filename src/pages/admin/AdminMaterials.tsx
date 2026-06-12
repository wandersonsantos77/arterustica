import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import type { Material, TablesInsert } from '../../lib/database.types';
import { fetchAdminMaterials, saveMaterial, deleteMaterial } from '../../lib/services/admin';
import { getErrorMessage } from '../../lib/errors';

export default function AdminMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('cimento');
  const [unit, setUnit] = useState('kg');
  const [costPerUnit, setCostPerUnit] = useState(0);
  const [stockCurrent, setStockCurrent] = useState(0);
  const [stockMinimum, setStockMinimum] = useState(10);
  const [supplier, setSupplier] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminMaterials();
      setMaterials(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar a lista de materiais.'));
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setSelectedId(null);
    setName('');
    setCategory('cimento');
    setUnit('kg');
    setCostPerUnit(0);
    setStockCurrent(0);
    setStockMinimum(10);
    setSupplier('');
    setError('');
    setModalOpen(true);
  }

  function openEditModal(material: Material) {
    setSelectedId(material.id);
    setName(material.name);
    setCategory(material.category);
    setUnit(material.unit);
    setCostPerUnit(material.cost_per_unit);
    setStockCurrent(material.stock_current);
    setStockMinimum(material.stock_minimum);
    setSupplier(material.supplier || '');
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !category.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setError('');

    const payload: TablesInsert<'materials'> = {
      name: name.trim(),
      category: category.trim(),
      unit: unit.trim(),
      cost_per_unit: Number(costPerUnit),
      stock_current: Number(stockCurrent),
      stock_minimum: Number(stockMinimum),
      supplier: supplier.trim(),
      is_active: true,
    };

    try {
      await saveMaterial(selectedId, payload);
      setModalOpen(false);
      await loadMaterials();
    } catch (err) {
      setError(getErrorMessage(err, 'Ocorreu um erro ao salvar o material.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Tem certeza que deseja remover o material "${name}"?`)) {
      return;
    }

    setError('');
    try {
      await deleteMaterial(id);
      await loadMaterials();
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel remover o material.'));
    }
  }

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      (m.supplier && m.supplier.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Controle de Insumos</h1>
          <p className="text-sm text-stone-500">Gerenciamento de matérias-primas e estoque operacional</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus size={16} /> Novo Insumo
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Total de Itens</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">{materials.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Abaixo do Mínimo</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {materials.filter((m) => m.stock_current < m.stock_minimum).length}
            </p>
          </div>
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Fornecedores Ativos</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {[...new Set(materials.map((m) => m.supplier).filter(Boolean))].length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar materiais por nome, categoria ou fornecedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-amber-600" />
            <p className="text-sm text-stone-400">Carregando insumos...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 text-lg">Nenhum insumo encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Insumo / Categoria</th>
                  <th className="px-6 py-4">Custo Unitário</th>
                  <th className="px-6 py-4">Estoque Atual / Mínimo</th>
                  <th className="px-6 py-4">Fornecedor</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMaterials.map((material) => {
                  const belowMin = material.stock_current < material.stock_minimum;
                  return (
                    <tr key={material.id} className="hover:bg-stone-50 transition-colors text-sm text-stone-700">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-900">{material.name}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-stone-100 text-stone-500 rounded-full text-xs font-medium uppercase tracking-wide">
                          {material.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        R$ {material.cost_per_unit.toFixed(2)} / {material.unit}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold font-mono ${belowMin ? 'text-red-600' : 'text-stone-800'}`}>
                            {material.stock_current} {material.unit}
                          </span>
                          <span className="text-stone-400 text-xs font-mono">/ mín: {material.stock_minimum} {material.unit}</span>
                          {belowMin && (
                            <span className="p-1 bg-red-100 text-red-700 rounded-full" title="Abaixo do estoque mínimo">
                              <AlertTriangle size={12} />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {material.supplier || 'Não informado'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(material)}
                            className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-amber-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(material.id, material.name)}
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
                {selectedId ? 'Editar Insumo' : 'Novo Insumo'}
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
                  Nome do Insumo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Cimento CP II 32"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Categoria <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="cimento">Cimento</option>
                    <option value="pigmento">Pigmento</option>
                    <option value="selante">Selante</option>
                    <option value="aditivo">Aditivo</option>
                    <option value="areia">Areia / Brita</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Unidade de Medida
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="Ex: kg, litro, saco"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Custo Unitário (R$)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Estoque Atual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={stockCurrent}
                    onChange={(e) => setStockCurrent(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Estoque Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={stockMinimum}
                    onChange={(e) => setStockMinimum(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Fornecedor
                </label>
                <input
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  placeholder="Nome do fornecedor"
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
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
