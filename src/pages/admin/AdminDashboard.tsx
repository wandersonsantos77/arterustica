import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, Star, ArrowRight } from 'lucide-react';
import { getErrorMessage } from '../../lib/errors';
import { fetchDashboardCounts } from '../../lib/services/admin';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ products: 0, leads: 0, newLeads: 0, featured: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setCounts(await fetchDashboardCounts());
      } catch (err) {
        setError(getErrorMessage(err, 'Nao foi possivel carregar os indicadores do dashboard.'));
      }
    }

    void load();
  }, []);

  const stats = [
    { label: 'Produtos Ativos', value: counts.products, icon: Package, color: 'bg-amber-100 text-amber-700', to: '/admin/produtos' },
    { label: 'Contatos Totais', value: counts.leads, icon: Users, color: 'bg-blue-100 text-blue-700', to: '/admin/leads' },
    { label: 'Novos Contatos', value: counts.newLeads, icon: Users, color: 'bg-green-100 text-green-700', to: '/admin/leads' },
    { label: 'Produtos em Destaque', value: counts.featured, icon: Star, color: 'bg-stone-100 text-stone-700', to: '/admin/produtos' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Dashboard</h1>
      <p className="text-stone-500 text-sm mb-8">Bem-vindo ao painel da Arte Rústica.</p>
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{value}</p>
              <p className="text-stone-500 text-xs mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Link
          to="/admin/produtos"
          className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-800">Gerenciar Produtos</h3>
            <ArrowRight size={18} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <p className="text-stone-500 text-sm">Adicione, edite ou desative produtos do catálogo. Marque destaques e controle estoque.</p>
        </Link>
        <Link
          to="/admin/leads"
          className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-stone-800">Ver Contatos</h3>
            <ArrowRight size={18} className="text-stone-400 group-hover:text-amber-600 transition-colors" />
          </div>
          <p className="text-stone-500 text-sm">Visualize todos os pedidos de orçamento e contatos recebidos pelo site.</p>
        </Link>
      </div>
    </div>
  );
}
