import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Hammer, LayoutDashboard, Package, Users, LogOut, Menu, X, Wrench, ClipboardList } from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { getValidatedAdminSession, isAdminSession } from '../../lib/auth';
import { getErrorMessage } from '../../lib/errors';
import { supabase } from '../../lib/supabase';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin' },
  { icon: Package, label: 'Produtos', to: '/admin/produtos' },
  { icon: Package, label: 'Variantes', to: '/admin/variantes' },
  { icon: Package, label: 'Estoque', to: '/admin/estoque' },
  { icon: Hammer, label: 'Produção', to: '/admin/producao' },
  { icon: Wrench, label: 'Moldes', to: '/admin/moldes' },
  { icon: ClipboardList, label: 'Insumos', to: '/admin/materiais' },
  { icon: Users, label: 'Leads', to: '/admin/leads' },
];

export default function AdminLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function validateCurrentSession() {
      try {
        const currentSession = await getValidatedAdminSession();
        setSession(currentSession);

        if (!currentSession) {
          navigate('/admin/login', {
            replace: true,
            state: { error: 'Faça login com uma conta administradora para acessar o painel.' },
          });
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Nao foi possivel validar a sessao atual.'));
        setSession(null);
      }
    }

    void validateCurrentSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setSession(null);
        navigate('/admin/login', { replace: true });
        return;
      }

      if (!isAdminSession(session)) {
        void supabase.auth.signOut();
        setSession(null);
        navigate('/admin/login', {
          replace: true,
          state: { error: 'Sua conta nao possui permissao de administrador.' },
        });
        return;
      }

      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-100">
          <p className="font-semibold">Falha ao carregar o painel</p>
          <p className="mt-2 text-sm text-red-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-stone-900 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-stone-700">
          <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center shrink-0">
            <Hammer size={15} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-bold leading-tight">Arte Rústica</p>
            <p className="text-stone-400 text-xs">Admin</p>
          </div>
        </div>
        <nav className="flex-1 py-4 px-3">
          {navItems.map(({ icon: Icon, label, to }) => {
            const active = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${active ? 'bg-amber-600 text-white' : 'text-stone-300 hover:bg-stone-800 hover:text-white'}`}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-stone-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-red-400 hover:bg-stone-800 transition-colors"
          >
            <LogOut size={17} />
            Sair
          </button>
          <Link
            to="/"
            className="mt-1 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            Ver site
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-stone-200 px-4 sm:px-6 h-14 flex items-center justify-between lg:justify-end sticky top-0 z-30">
          <button
            className="lg:hidden p-2 text-stone-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm text-stone-500">Painel Arte Rústica</span>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
