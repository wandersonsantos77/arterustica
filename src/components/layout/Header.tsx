import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Hammer, ChevronDown } from 'lucide-react';

const environments = [
  { label: 'Jardim', slug: 'jardim' },
  { label: 'Varanda', slug: 'varanda' },
  { label: 'Piscina', slug: 'piscina' },
  { label: 'Entrada & Porteira', slug: 'entrada-porteira' },
  { label: 'Arte Religiosa', slug: 'arte-religiosa' },
  { label: 'Mobiliário Rústico', slug: 'mobiliario-rustico' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Novo visual de vidro/blur sofisticado
  const headerBg = isHome && !scrolled
    ? 'bg-transparent border-transparent'
    : 'bg-stone-900/90 backdrop-blur-md shadow-lg border-b border-stone-800/40';

  const textColor = 'text-white';
  const textMuted = isHome && !scrolled ? 'text-stone-300' : 'text-stone-400';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-terracotta-600 rounded-full flex items-center justify-center group-hover:bg-terracotta-500 transition-all group-hover:scale-105 shadow-md shadow-terracotta-900/10">
              <Hammer size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <span className={`font-outfit font-extrabold text-xl tracking-wide block ${textColor}`}>
                Arte Rústica
              </span>
              <span className={`block text-[10px] font-bold tracking-widest uppercase ${textMuted}`}>
                Itaboraí · RJ
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7">
            <div
              className="relative"
              onMouseEnter={() => setCatalogOpen(true)}
              onMouseLeave={() => setCatalogOpen(false)}
            >
              <button className="flex items-center gap-1.5 font-semibold text-sm transition-colors hover:text-terracotta-400 text-stone-200">
                Catálogo <ChevronDown size={14} className={`transition-transform duration-200 ${catalogOpen ? 'rotate-180 text-terracotta-400' : ''}`} />
              </button>
              
              {/* Dropdown com animação e bordas arredondadas modernas */}
              {catalogOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-60 bg-stone-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-800/50 py-2.5 z-50 animate-fade-in">
                  <Link
                    to="/catalogo"
                    className="block px-4 py-2.5 text-sm text-stone-200 hover:text-terracotta-400 hover:bg-stone-800/60 transition-colors font-semibold"
                  >
                    Ver Todo o Catálogo
                  </Link>
                  <div className="h-px bg-stone-800/60 my-1.5 mx-4" />
                  {environments.map((env) => (
                    <Link
                      key={env.slug}
                      to={`/catalogo?categoria=${env.slug}`}
                      className="block px-4 py-2 text-sm text-stone-300 hover:text-terracotta-400 hover:bg-stone-800/40 transition-colors"
                    >
                      {env.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/para-profissionais" className="font-semibold text-sm transition-colors hover:text-terracotta-400 text-stone-200">
              Para Profissionais
            </Link>
            <Link to="/sobre" className="font-semibold text-sm transition-colors hover:text-terracotta-400 text-stone-200">
              Nossa História
            </Link>
            <Link to="/contato" className="font-semibold text-sm transition-colors hover:text-terracotta-400 text-stone-200">
              Contato
            </Link>
            <Link
              to="/contato"
              className="ml-2 px-6 py-2.5 bg-terracotta-600 hover:bg-terracotta-500 text-white text-sm font-bold rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-terracotta-600/20"
            >
              Orçamento Rápido
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={`lg:hidden p-2 rounded-xl transition-colors hover:bg-white/5 ${textColor}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu com blur de vidro */}
      {menuOpen && (
        <div className="lg:hidden bg-stone-900/95 backdrop-blur-lg border-t border-stone-800/60 max-h-[85vh] overflow-y-auto">
          <div className="px-4 py-5 space-y-1">
            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-extrabold px-3 py-1.5">Catálogo por Ambiente</p>
            {environments.map((env) => (
              <Link
                key={env.slug}
                to={`/catalogo?categoria=${env.slug}`}
                className="block px-3 py-2 text-stone-300 hover:text-terracotta-400 text-sm transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {env.label}
              </Link>
            ))}
            <div className="h-px bg-stone-800/60 my-3 mx-3" />
            <Link to="/catalogo" className="block px-3 py-2 text-stone-300 hover:text-terracotta-400 text-sm transition-colors" onClick={() => setMenuOpen(false)}>Ver Todo o Catálogo</Link>
            <Link to="/para-profissionais" className="block px-3 py-2 text-stone-300 hover:text-terracotta-400 text-sm transition-colors" onClick={() => setMenuOpen(false)}>Para Profissionais</Link>
            <Link to="/sobre" className="block px-3 py-2 text-stone-300 hover:text-terracotta-400 text-sm transition-colors" onClick={() => setMenuOpen(false)}>Nossa História</Link>
            <Link to="/contato" className="block px-3 py-2 text-stone-300 hover:text-terracotta-400 text-sm transition-colors" onClick={() => setMenuOpen(false)}>Contato</Link>
            <div className="pt-4 px-3">
              <Link
                to="/contato"
                className="block w-full text-center py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold rounded-full transition-colors text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Solicitar Orçamento
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
