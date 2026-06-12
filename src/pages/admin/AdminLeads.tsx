import { useEffect, useState } from 'react';
import { MessageCircle, Phone, User } from 'lucide-react';
import type { Lead } from '../../lib/database.types';
import { getErrorMessage } from '../../lib/errors';
import { fetchLeads, updateLeadStatus } from '../../lib/services/admin';
import { buildWhatsAppUrl } from '../../lib/whatsapp';

const statusLabels: Record<Lead['status'], string> = {
  new: 'Novo',
  contacted: 'Contactado',
  closed: 'Fechado',
};

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-green-100 text-green-700',
  contacted: 'bg-blue-100 text-blue-700',
  closed: 'bg-stone-100 text-stone-500',
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Lead['status']>('all');
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    setError('');

    try {
      setLeads(await fetchLeads());
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel carregar os contatos.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function updateStatus(id: string, status: Lead['status']) {
    try {
      await updateLeadStatus(id, { status });
      setLeads((prev) => prev.map((lead) => lead.id === id ? { ...lead, status } : lead));
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel atualizar o status do contato.'));
    }
  }

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Contatos e Leads</h1>
          <p className="text-stone-500 text-sm mt-0.5">{leads.length} contato(s) recebido(s)</p>
        </div>
      </div>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['all', 'new', 'contacted', 'closed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? 'bg-amber-600 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-300'}`}
          >
            {f === 'all' ? 'Todos' : statusLabels[f]}
            {f !== 'all' && (
              <span className="ml-1.5 text-xs opacity-75">
                ({leads.filter((l) => l.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          Nenhum contato encontrado.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <User size={18} className="text-amber-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-stone-800">{lead.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[lead.status]}`}>
                      {statusLabels[lead.status]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lead.client_type === 'professional' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>
                      {lead.client_type === 'professional' ? 'Profissional' : 'Individual'}
                    </span>
                  </div>
                  {lead.product_name && (
                    <p className="text-xs text-amber-700 font-medium mb-1">Interesse: {lead.product_name}</p>
                  )}
                  <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{lead.message}</p>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-stone-400">
                    <span>{lead.phone}</span>
                    {lead.email && <span>{lead.email}</span>}
                    <span>{new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={buildWhatsAppUrl(`Ola ${lead.name}! Vi seu contato pelo site Arte Rustica. Como posso te ajudar?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-400 text-white text-xs font-semibold rounded-full transition-colors"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1.5 px-3 py-2 border border-stone-200 hover:border-amber-300 text-stone-600 hover:text-amber-700 text-xs font-semibold rounded-full transition-colors"
                  >
                    <Phone size={13} /> Ligar
                  </a>
                </div>
              </div>
              {/* Status update */}
              <div className="mt-3 pt-3 border-t border-stone-50 flex gap-2">
                <span className="text-xs text-stone-400 self-center">Mudar status:</span>
                {(['new', 'contacted', 'closed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(lead.id, s)}
                    disabled={lead.status === s}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-default ${lead.status === s ? statusColors[s] : 'bg-stone-50 text-stone-500 hover:bg-stone-100'}`}
                  >
                    {statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
