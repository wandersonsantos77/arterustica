import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Facebook, MessageCircle, ArrowRight } from 'lucide-react';
import { buildWhatsAppUrl, generalInquiryMessage } from '../../lib/whatsapp';

const navCategories = [
  { label: 'Jardim', slug: 'jardim' },
  { label: 'Varanda', slug: 'varanda' },
  { label: 'Piscina', slug: 'piscina' },
  { label: 'Entrada & Porteira', slug: 'entrada-porteira' },
  { label: 'Arte Religiosa', slug: 'arte-religiosa' },
  { label: 'Mobiliário Rústico', slug: 'mobiliario-rustico' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      {/* Top CTA banner */}
      <div className="border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-terracotta-400 mb-1">
                Pronto para transformar seu espaço?
              </p>
              <h3 className="text-2xl font-outfit font-bold text-white leading-tight">
                Peça seu orçamento sem compromisso
              </h3>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href={buildWhatsAppUrl(generalInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-terracotta-900/30 text-sm"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
              <Link
                to="/catalogo"
                className="inline-flex items-center gap-2 px-6 py-3 border border-stone-700 hover:border-terracotta-500 text-stone-300 hover:text-white font-semibold rounded-full transition-all text-sm"
              >
                Ver Catálogo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 group mb-5">
              <div className="w-10 h-10 rounded-full bg-terracotta-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-outfit font-extrabold text-sm">AR</span>
              </div>
              <div className="leading-tight">
                <span className="font-outfit font-extrabold text-xl text-white tracking-wide block">
                  Arte Rústica
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-stone-500 block">
                  Itaboraí · RJ
                </span>
              </div>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed mb-6">
              Artesanatos decorativos em cimento, feitos à mão com tradição e cuidado. Direto da fábrica para o seu espaço.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              <a
                href="#"
                aria-label="Instagram Arte Rústica"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-terracotta-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Instagram size={16} className="text-white" />
              </a>
              <a
                href="#"
                aria-label="Facebook Arte Rústica"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-terracotta-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <Facebook size={16} className="text-white" />
              </a>
              <a
                href={buildWhatsAppUrl(generalInquiryMessage())}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Arte Rústica"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-green-600 flex items-center justify-center transition-all hover:scale-110"
              >
                <MessageCircle size={16} className="text-white" />
              </a>
            </div>
          </div>

          {/* Catalog links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-terracotta-600" />
              Catálogo
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/catalogo"
                  className="text-sm text-stone-400 hover:text-terracotta-400 transition-colors font-medium"
                >
                  Ver Todo o Catálogo
                </Link>
              </li>
              {navCategories.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/catalogo?categoria=${item.slug}`}
                    className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Institutional links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-terracotta-600" />
              Institucional
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/sobre" className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors">
                  Nossa História
                </Link>
              </li>
              <li>
                <Link to="/para-profissionais" className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors">
                  Para Profissionais
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors">
                  Solicitar Orçamento
                </Link>
              </li>
              <li>
                <a
                  href={buildWhatsAppUrl(generalInquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors"
                >
                  Contato via WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Contact / Location */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-terracotta-600" />
              Localização
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-terracotta-500 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-500 leading-relaxed">
                  Rodovia Gov. Mário Covas, 13868<br />
                  Itaboraí · RJ
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-terracotta-500 shrink-0" />
                <a
                  href={buildWhatsAppUrl(generalInquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-500 hover:text-terracotta-400 transition-colors"
                >
                  (21) 98109-9926
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="text-terracotta-500 mt-0.5 shrink-0" />
                <span className="text-sm text-stone-500 leading-relaxed">
                  Seg–Sáb: 8h às 18h<br />
                  Dom: 8h às 14h
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-stone-600">
            &copy; {new Date().getFullYear()} Arte Rústica. Todos os direitos reservados.
          </p>
          <p className="text-xs text-stone-700">
            Feito com cuidado em Itaboraí, Rio de Janeiro.
          </p>
        </div>
      </div>
    </footer>
  );
}
