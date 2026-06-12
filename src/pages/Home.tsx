import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Hammer, Leaf, Truck, Star,
  Award, Users, ChevronDown, MessageCircle,
  MapPin, Clock, Phone, Sparkles,
} from 'lucide-react';
import type { Product, Testimonial, Category } from '../lib/database.types';
import ProductCard from '../components/ui/ProductCard';
import { getErrorMessage } from '../lib/errors';
import { fetchHomePageData } from '../lib/services/public';
import { buildWhatsAppUrl, generalInquiryMessage } from '../lib/whatsapp';

/* ─── Category image map ─────────────────────────────────────────────── */
const categoryImages: Record<string, string> = {
  jardim: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  varanda: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
  piscina: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=600&q=80',
  'entrada-porteira': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'arte-religiosa': 'https://images.unsplash.com/photo-1548625149-720754520a5a?w=600&q=80',
  'mobiliario-rustico': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
};

/* ─── Differentials ──────────────────────────────────────────────────── */
const differentials = [
  {
    icon: Hammer,
    title: 'Feito à Mão',
    desc: 'Cada peça é produzida artesanalmente com atenção aos detalhes e tradição de ofício.',
    color: 'from-terracotta-900/40 to-terracotta-800/20',
    iconColor: 'text-terracotta-400',
  },
  {
    icon: Award,
    title: 'Qualidade Garantida',
    desc: 'Cimento de alta resistência que suporta sol, chuva e o tempo, sem perder o charme.',
    color: 'from-clay-900/40 to-clay-800/20',
    iconColor: 'text-clay-300',
  },
  {
    icon: Leaf,
    title: 'Personalização',
    desc: 'Encomende com as medidas, cores e detalhes que você precisa para o seu projeto.',
    color: 'from-forest-900/40 to-forest-800/20',
    iconColor: 'text-forest-400',
  },
  {
    icon: Truck,
    title: 'Direto da Fábrica',
    desc: 'Sem intermediários. Preço justo e atendimento direto com quem fabrica cada peça.',
    color: 'from-stone-800/40 to-stone-700/20',
    iconColor: 'text-stone-300',
  },
];

/* ─── Component ──────────────────────────────────────────────────────── */
export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHomePageData();
        setFeatured(data.featured);
        setTestimonials(data.testimonials);
        setCategories(data.categories);
      } catch (err) {
        setError(getErrorMessage(err, 'Não foi possível carregar o conteúdo inicial da página.'));
      }
    }
    void load();
  }, []);

  /* Parallax subtle effect on hero */
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const y = window.scrollY * 0.35;
      heroRef.current.style.transform = `translateY(${y}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax background */}
        <div
          ref={heroRef}
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/image.png')" }}
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/75 via-stone-900/50 to-stone-950/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-terracotta-950/30 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-terracotta-600/20 border border-terracotta-500/30 backdrop-blur-sm rounded-full">
            <Sparkles size={12} className="text-terracotta-400" />
            <span className="text-terracotta-300 text-xs font-bold uppercase tracking-widest">
              Artesanatos em Cimento · Itaboraí, RJ
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-outfit font-extrabold text-white leading-[1.08] mb-7 drop-shadow-2xl">
            Arte que transforma<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta-400 via-amber-300 to-terracotta-400">
              espaços em vida
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-stone-300 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Vasos, fontes, chafarizes, mesas e esculturas feitos à mão com cimento de qualidade.
            Perfeitos para jardins, varandas, piscinas e entradas de fazenda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold rounded-full text-base transition-all shadow-2xl shadow-terracotta-900/50 hover:scale-105 hover:shadow-terracotta-600/30"
            >
              Explorar Catálogo
              <ArrowRight size={18} />
            </Link>
            <a
              href={buildWhatsAppUrl(generalInquiryMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/25 text-white font-semibold rounded-full text-base transition-all hover:border-white/40"
            >
              <MessageCircle size={18} />
              Falar pelo WhatsApp
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            {[
              { value: '500+', label: 'Peças no catálogo' },
              { value: '20+', label: 'Anos de tradição' },
              { value: '100%', label: 'Feito à mão' },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-3xl font-outfit font-extrabold text-terracotta-400">{value}</span>
                <span className="text-xs text-stone-400 uppercase tracking-widest mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-stone-400 text-[10px] uppercase tracking-widest animate-bounce">
          <span>Role para ver</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* ══════════════════════════════ AUDIENCE CTAs ═══════════════════════════════ */}
      <section className="bg-stone-100 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            to="/catalogo"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-terracotta-800 to-terracotta-950 text-white p-9 flex flex-col justify-between min-h-52 shadow-xl hover:shadow-2xl hover:shadow-terracotta-900/30 transition-all duration-500"
          >
            {/* Decorative circle */}
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-terracotta-600/20 rounded-full" />
            <div className="absolute -right-2 -bottom-10 w-24 h-24 bg-terracotta-600/10 rounded-full" />

            <div className="relative">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-300 mb-3 block">
                Para você
              </span>
              <h3 className="text-2xl font-outfit font-bold leading-tight mb-3">
                Quero decorar meu espaço
              </h3>
              <p className="text-terracotta-200 text-sm leading-relaxed">
                Jardim, varanda, piscina ou entrada. Encontre a peça ideal para cada ambiente.
              </p>
            </div>
            <div className="relative flex items-center gap-2 text-sm font-bold mt-5 group-hover:translate-x-1.5 transition-transform duration-300">
              Ver catálogo <ArrowRight size={16} />
            </div>
          </Link>

          <Link
            to="/para-profissionais"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-800 to-stone-950 text-white p-9 flex flex-col justify-between min-h-52 shadow-xl hover:shadow-2xl hover:shadow-stone-900/40 transition-all duration-500"
          >
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-stone-600/10 rounded-full" />
            <div className="absolute -right-2 -bottom-10 w-24 h-24 bg-clay-600/10 rounded-full" />

            <div className="relative">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-clay-400 mb-3 block">
                Para profissionais
              </span>
              <h3 className="text-2xl font-outfit font-bold leading-tight mb-3">
                Sou arquiteto ou decorador
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed">
                Fornecimento para projetos, encomendas em volume e parceria comercial em todo o RJ.
              </p>
            </div>
            <div className="relative flex items-center gap-2 text-sm font-bold mt-5 group-hover:translate-x-1.5 transition-transform duration-300">
              Conhecer parceria <ArrowRight size={16} />
            </div>
          </Link>
        </div>
      </section>

      {/* Error */}
      {error && (
        <section className="bg-red-50 py-4">
          <div className="mx-auto max-w-5xl rounded-2xl border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════ CATEGORIES ═════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 mb-3 block">
              Navegue por ambiente
            </span>
            <h2 className="text-4xl font-outfit font-bold text-stone-900 leading-tight">
              Encontre a peça ideal<br />
              <span className="text-stone-500 font-normal">para cada espaço</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="group flex flex-col items-center gap-3.5 p-4 rounded-2xl border border-stone-100 hover:border-terracotta-300 hover:bg-terracotta-50/60 transition-all duration-300 text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-terracotta-100"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-stone-200 group-hover:border-terracotta-400 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <img
                    src={categoryImages[cat.slug] ?? ''}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <span className="text-xs font-semibold text-stone-700 group-hover:text-terracotta-700 transition-colors leading-tight">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURED PRODUCTS ════════════════════════════════ */}
      <section className="py-20 bg-clay-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 mb-2 block">
                Destaques
              </span>
              <h2 className="text-4xl font-outfit font-bold text-stone-900 leading-tight">
                Peças em evidência
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-terracotta-600 hover:text-terracotta-500 transition-colors group"
            >
              Ver tudo
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-stone-300" />
              </div>
              <p className="text-sm">Nenhum produto em destaque no momento.</p>
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-7 py-3.5 border-2 border-terracotta-600 text-terracotta-700 font-bold rounded-full hover:bg-terracotta-600 hover:text-white transition-all text-sm"
            >
              Ver catálogo completo <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ DIFFERENTIALS ════════════════════════════════════ */}
      <section className="py-24 bg-stone-950 relative overflow-hidden">
        {/* Decorative background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-500 mb-3 block">
              Nossos diferenciais
            </span>
            <h2 className="text-4xl font-outfit font-bold text-white leading-tight">
              Por que escolher<br />
              <span className="text-terracotta-400">Arte Rústica?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentials.map(({ icon: Icon, title, desc, color, iconColor }) => (
              <div
                key={title}
                className={`group relative p-7 rounded-3xl bg-gradient-to-br ${color} border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <h3 className="font-outfit font-bold text-white text-lg mb-3">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ STORE / LOCATION ═══════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Image side */}
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-200">
                <img
                  src="/image.png"
                  alt="Loja Arte Rústica na BR-101 em Itaboraí"
                  className="w-full h-96 object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -right-5 bg-terracotta-600 rounded-2xl p-5 shadow-xl text-white">
                <p className="text-3xl font-outfit font-extrabold">20+</p>
                <p className="text-xs font-bold uppercase tracking-widest text-terracotta-200 mt-0.5">Anos de tradição</p>
              </div>
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 mb-3 block">
                Nossa loja
              </span>
              <h2 className="text-4xl font-outfit font-bold text-stone-900 leading-tight mb-6">
                À beira da BR-101<br />
                <span className="text-stone-500 font-normal">em Itaboraí</span>
              </h2>
              <p className="text-stone-500 text-base leading-relaxed mb-8">
                Nossa fábrica e loja expositora ficam na Rodovia Governador Mário Covas, 13868, em Itaboraí.
                Venha nos visitar e ver de perto a qualidade de cada peça. Atendemos viajantes, moradores da região e profissionais de todo o RJ.
              </p>

              <ul className="space-y-4 mb-9">
                {[
                  { icon: MapPin, text: 'Rod. Gov. Mário Covas, 13868 — Itaboraí, RJ' },
                  { icon: Clock, text: 'Seg–Sáb: 8h às 18h | Domingo: 8h às 14h' },
                  { icon: Phone, text: '(21) 98109-9926' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-terracotta-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={14} className="text-terracotta-600" />
                    </div>
                    <span className="text-stone-600 text-sm pt-1.5">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://maps.app.goo.gl/KcGAfabN5mHqY1Fk7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-300 hover:border-terracotta-400 text-stone-700 hover:text-terracotta-700 text-sm font-semibold rounded-full transition-all"
                >
                  <MapPin size={14} /> Ver no Google Maps
                </a>
                <a
                  href={buildWhatsAppUrl(generalInquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-600 hover:bg-terracotta-500 text-white text-sm font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-terracotta-900/20"
                >
                  <MessageCircle size={14} /> Falar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ TESTIMONIALS ══════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-clay-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-600 mb-3 block">
                Depoimentos
              </span>
              <h2 className="text-4xl font-outfit font-bold text-stone-900 leading-tight">
                O que nossos clientes dizem
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-lg hover:shadow-terracotta-100 transition-all duration-300 border border-stone-100 hover:-translate-y-1 flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                    {Array.from({ length: 5 - t.rating }).map((_, i) => (
                      <Star key={`e-${i}`} size={14} className="text-stone-200 fill-stone-200" />
                    ))}
                  </div>

                  <p className="text-stone-600 text-sm leading-relaxed mb-5 flex-1 italic">
                    "{t.content}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                    <div className="w-9 h-9 rounded-full bg-terracotta-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-terracotta-700 font-bold text-sm">
                        {t.author_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{t.author_name}</p>
                      {t.author_role && (
                        <p className="text-stone-400 text-xs mt-0.5">{t.author_role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════ PROFESSIONALS CTA ════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-stone-900 via-stone-950 to-terracotta-950 relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-clay-900/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-7">
            <Users size={26} className="text-terracotta-400" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-terracotta-500 mb-4 block">
            Parceria profissional
          </span>
          <h2 className="text-4xl font-outfit font-bold text-white mb-5 leading-tight">
            Arquitetos e decoradores:<br />
            <span className="text-terracotta-400">conheça nossa proposta de parceria</span>
          </h2>
          <p className="text-stone-400 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Fornecemos peças personalizadas para projetos residenciais, comerciais e de paisagismo em todo o estado do Rio de Janeiro.
          </p>
          <Link
            to="/para-profissionais"
            className="inline-flex items-center gap-2.5 px-9 py-4 bg-terracotta-600 hover:bg-terracotta-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-2xl shadow-terracotta-900/50 text-base"
          >
            Quero ser parceiro <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
