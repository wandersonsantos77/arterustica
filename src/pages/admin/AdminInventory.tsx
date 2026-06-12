import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { ProductVariant, InventoryStock } from '../../lib/database.types';
import { getErrorMessage } from '../../lib/errors';
import { fetchInventoryData, upsertInventoryStock } from '../../lib/services/admin';

export default function AdminInventory() {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [inventory, setInventory] = useState<InventoryStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({ location: 'mostruario', quantity_available: 0 });
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchInventoryData();
      setVariants(data.variants);
      setInventory(data.inventory);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar o estoque.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const lowStockVariants = variants.filter(v =>
    v.in_stock_mostruario > 0 && v.in_stock_mostruario <= 2
  );

  const getInventoryForVariant = (variantId: string) =>
    inventory.filter(inv => inv.product_variant_id === variantId);

  async function handleUpdateStock(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVariant) return;

    setUpdating(true);
    setError('');

    try {
      await upsertInventoryStock({
        product_variant_id: selectedVariant,
        location: updateForm.location,
        quantity_available: updateForm.quantity_available,
        quantity_reserved: inventory.find(
          (item) => item.product_variant_id === selectedVariant && item.location === updateForm.location
        )?.quantity_reserved ?? 0,
        last_updated: new Date().toISOString(),
      });
      await load();
      setSelectedVariant(null);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel atualizar o estoque.'));
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Controle de Estoque</h1>
        <p className="text-stone-500 text-sm mt-0.5">{variants.length} variante(s)</p>
      </div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Low stock alert */}
      {lowStockVariants.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">{lowStockVariants.length} variante(s) com estoque baixo</p>
            <p className="text-amber-800 text-xs mt-1">
              {lowStockVariants.map(v => v.name).join(', ')}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Variants list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Variante</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden sm:table-cell">Mostruário</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider hidden md:table-cell">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {variants.map((variant) => {
                    const variantInv = getInventoryForVariant(variant.id);
                    const mostruario = variantInv.find(inv => inv.location === 'mostruario');
                    const total = variantInv.reduce((sum, inv) => sum + inv.quantity_available, 0);
                    const isLowStock = variant.in_stock_mostruario > 0 && variant.in_stock_mostruario <= 2;

                    return (
                      <tr
                        key={variant.id}
                        className={`hover:bg-stone-50 transition-colors cursor-pointer ${isLowStock ? 'bg-amber-50' : ''}`}
                        onClick={() => setSelectedVariant(variant.id)}
                      >
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-stone-800">{variant.name}</p>
                            <p className="text-xs text-stone-500">{variant.sku}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            (mostruario?.quantity_available ?? 0) > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-stone-100 text-stone-600'
                          }`}>
                            {mostruario?.quantity_available ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell text-stone-600">{total}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedVariant(variant.id);
                            }}
                            className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit form */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 h-fit">
            <h3 className="font-semibold text-stone-800 mb-4 text-sm">Atualizar Estoque</h3>

            {selectedVariant ? (
              <form onSubmit={handleUpdateStock} className="space-y-4">
                {(() => {
                  const variant = variants.find(v => v.id === selectedVariant);
                  if (!variant) return null;
                  return (
                    <>
                      <div>
                        <p className="text-xs text-stone-500 mb-1">Variante</p>
                        <p className="font-medium text-stone-800 text-sm">{variant.name}</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Local</label>
                        <select
                          value={updateForm.location}
                          onChange={(e) => setUpdateForm({ ...updateForm, location: e.target.value })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option value="mostruario">Mostruário</option>
                          <option value="deposito">Depósito</option>
                          <option value="em-transito">Em Trânsito</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-600 mb-1.5">Quantidade</label>
                        <input
                          type="number"
                          min="0"
                          value={updateForm.quantity_available}
                          onChange={(e) => setUpdateForm({ ...updateForm, quantity_available: parseInt(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={updating}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-semibold rounded-full text-xs transition-colors"
                      >
                        {updating ? 'Atualizando...' : 'Atualizar'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedVariant(null)}
                        className="w-full py-2.5 border border-stone-200 text-stone-600 font-semibold rounded-full text-xs hover:bg-stone-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  );
                })()}
              </form>
            ) : (
              <p className="text-sm text-stone-500 text-center py-8">
                Selecione uma variante para atualizar o estoque
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
