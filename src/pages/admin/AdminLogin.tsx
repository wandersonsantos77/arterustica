import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Hammer, Eye, EyeOff } from 'lucide-react';
import { signInAsAdmin } from '../../lib/auth';
import { getErrorMessage } from '../../lib/errors';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { error?: string } | null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInAsAdmin(email, password);
      navigate('/admin');
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel fazer login no painel.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-3">
            <Hammer size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Arte Rústica</h1>
          <p className="text-stone-400 text-sm mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="bg-stone-800 rounded-2xl p-8 border border-stone-700 space-y-5">
          {(locationState?.error || error) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error || locationState?.error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-stone-700 border border-stone-600 rounded-xl text-sm text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
              placeholder="admin@arterustica.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-300 mb-1.5">Senha</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-700 border border-stone-600 rounded-xl text-sm text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold rounded-full transition-colors text-sm"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
