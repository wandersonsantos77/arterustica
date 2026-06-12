import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Mold, ProductVariant, TablesInsert, ProductionStatus } from '../../lib/database.types';
import {
  fetchProductionBatches,
  fetchAdminVariants,
  fetchAdminMolds,
  saveProductionBatch,
  deleteProductionBatch,
  type ProductionBatchWithDetails,
} from '../../lib/services/admin';
import { getErrorMessage } from '../../lib/errors';

export default function AdminProduction() {
  const [batches, setBatches] = useState<ProductionBatchWithDetails[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [molds, setMolds] = useState<(Mold & { product: { name: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [variantId, setVariantId] = useState('');
  const [moldId, setMoldId] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantityPlanned, setQuantityPlanned] = useState(1);
  const [quantityProduced, setQuantityProduced] = useState(0);
  const [status, setStatus] = useState<ProductionStatus>('design');
  const [startedAt, setStartedAt] = useState('');
  const [completedAt, setCompletedAt] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [batchesData, variantsData, moldsData] = await Promise.all([
        fetchProductionBatches(),
        fetchAdminVariants(),
        fetchAdminMolds(),
      ]);
      setBatches(batchesData);
      setVariants(variantsData.variants);
      setMolds(moldsData);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os dados de producao.'));
    } finally {
      setLoading(false);
    }
  }

  function generateBatchNumber() {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `LOTE-${year}-${random}`;
  }

  function openCreateModal() {
    setSelectedId(null);
    setVariantId(variants[0]?.id || '');
    setMoldId('');
    setBatchNumber(generateBatchNumber());
    setQuantityPlanned(1);
    setQuantityProduced(0);
    setStatus('design');
    setStartedAt(new Date().toISOString().substring(0, 10));
    setCompletedAt('');
    setNotes('');
    setError('');
    setModalOpen(true);
  }

  function openEditModal(batch: ProductionBatchWithDetails) {
    setSelectedId(batch.id);
    setVariantId(batch.product_variant_id);
    setMoldId(batch.mold_id || '');
    setBatchNumber(batch.batch_number);
    setQuantityPlanned(batch.quantity_planned);
    setQuantityProduced(batch.quantity_produced);
    setStatus(batch.status);
    setStartedAt(batch.started_at ? batch.started_at.substring(0, 10) : '');
    setCompletedAt(batch.completed_at ? batch.completed_at.substring(0, 10) : '');
    setNotes(batch.notes);
    setError('');
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!variantId || !batchNumber.trim()) {
      setError('Por favor, preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    setError('');

    const payload: TablesInsert<'production_batches'> = {
      product_variant_id: variantId,
      mold_id: moldId || null,
      batch_number: batchNumber.trim(),
      quantity_planned: Number(quantityPlanned),
      quantity_produced: Number(quantityProduced),
      status: status,
      started_at: startedAt ? new Date(startedAt).toISOString() : null,
      completed_at: completedAt ? new Date(completedAt).toISOString() : null,
      notes: notes.trim(),
    };

    try {
      await saveProductionBatch(selectedId, payload);
      setModalOpen(false);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Erro ao salvar lote de producao.'));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, number: string) {
    if (!confirm(`Deseja mesmo remover o lote ${number}?`)) {
      return;
    }

    setError('');
    try {
      await deleteProductionBatch(id);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel remover o lote.'));
    }
  }

  const filteredBatches = batches.filter(
    (b) =>
      b.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      (b.product_variant?.name && b.product_variant.name.toLowerCase().includes(search.toLowerCase())) ||
      (b.product_variant?.sku && b.product_variant.sku.toLowerCase().includes(search.toLowerCase()))
  );

  const statusColors: Record<ProductionStatus, string> = {
    design: 'bg-stone-100 text-stone-700 border-stone-200',
    moldagem: 'bg-amber-100 text-amber-800 border-amber-200',
    cura: 'bg-blue-100 text-blue-800 border-blue-200',
    acabamento: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    qualidade: 'bg-purple-100 text-purple-800 border-purple-200',
    embalagem: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    pronto: 'bg-green-100 text-green-800 border-green-200',
    entregue: 'bg-stone-800 text-stone-100 border-stone-900',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Lotes de Produção</h1>
          <p className="text-sm text-stone-500">Acompanhamento de fabricação por moldagem, cura e acabamento</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-xl text-sm transition-all shadow-sm"
        >
          <Plus size={16} /> Planejar Lote
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Lotes Ativos</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">
              {batches.filter((b) => b.status !== 'pronto' && b.status !== 'entregue').length}
            </p>
          </div>
          <Play size={20} className="text-amber-600" />
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Em Cura</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {batches.filter((b) => b.status === 'cura').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Controle Qualidade</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {batches.filter((b) => b.status === 'qualidade').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide font-bold">Lotes Concluídos</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {batches.filter((b) => b.status === 'pronto' || b.status === 'entregue').length}
            </p>
          </div>
          <CheckCircle2 size={20} className="text-green-600" />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar lotes por número, SKU ou nome do produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      {/* Batches list */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 size={32} className="animate-spin text-amber-600" />
            <p className="text-sm text-stone-400">Carregando lotes...</p>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-stone-400 text-lg">Nenhum lote de produção encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Lote / Data Início</th>
                  <th className="px-6 py-4">Produto & SKU</th>
                  <th className="px-6 py-4">Quantidade</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Molde Utilizado</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBatches.map((batch) => {
                  return (
                    <tr key={batch.id} className="hover:bg-stone-50 transition-colors text-sm text-stone-700">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-stone-900">{batch.batch_number}</p>
                        <span className="text-xs text-stone-400">
                          Início: {batch.started_at ? new Date(batch.started_at).toLocaleDateString('pt-BR') : 'Não iniciado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {batch.product_variant ? (
                          <>
                            <p className="font-medium text-stone-800">
                              {batch.product_variant.product?.name} - {batch.product_variant.name}
                            </p>
                            <span className="text-xs font-mono text-stone-400">{batch.product_variant.sku}</span>
                          </>
                        ) : (
                          <span className="text-xs text-red-500 italic flex items-center gap-1">
                            <AlertCircle size={12} /> Variante não encontrada
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-stone-800">
                            {batch.quantity_produced} / {batch.quantity_planned} un
                          </span>
                          <span className="text-xs text-stone-400">produzidas</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusColors[batch.status]}`}>
                          {batch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {batch.mold?.name || <span className="text-stone-400 italic">Sem molde cadastrado</span>}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(batch)}
                            className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-amber-700 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(batch.id, batch.batch_number)}
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
          <div className="bg-white w-full max-w-xl rounded-2xl border border-stone-200 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="text-lg font-bold text-stone-800">
                {selectedId ? 'Editar Lote de Produção' : 'Planejar Lote de Produção'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-stone-100 text-stone-400 hover:text-stone-600 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Número do Lote <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="LOTE-2026-001"
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Selecione a Variante <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={variantId}
                    onChange={(e) => setVariantId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors animate-none"
                  >
                    <option value="" disabled>Selecione uma variante</option>
                    {variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.sku} - {variant.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Molde Utilizado
                  </label>
                  <select
                    value={moldId}
                    onChange={(e) => setMoldId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="">Nenhum molde</option>
                    {molds.map((mold) => (
                      <option key={mold.id} value={mold.id}>
                        {mold.name} ({mold.condition})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Status de Produção
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductionStatus)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="design">Design</option>
                    <option value="moldagem">Moldagem</option>
                    <option value="cura">Cura</option>
                    <option value="acabamento">Acabamento</option>
                    <option value="qualidade">Controle de Qualidade</option>
                    <option value="embalagem">Embalagem</option>
                    <option value="pronto">Pronto</option>
                    <option value="entregue">Entregue</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Quantidade Planejada
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityPlanned}
                    onChange={(e) => setQuantityPlanned(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Quantidade Produzida (Sucesso)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={quantityProduced}
                    onChange={(e) => setQuantityProduced(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                    Data de Conclusão
                  </label>
                  <input
                    type="date"
                    value={completedAt}
                    onChange={(e) => setCompletedAt(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1.5">
                  Observações
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções de mistura, pigmentação ou anomalias observadas..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
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
