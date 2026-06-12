import { Link } from 'react-router-dom';
import { Hammer, Heart, MapPin, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="relative bg-stone-900 text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/image.png')" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 block">Nossa história</span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Arte feita com as mãos,<br />
            <span className="text-amber-400">coração e cimento</span>
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl mx-auto leading-relaxed">
            De uma fábrica à beira da BR-101, o artesão Ricardo leva para jardins, varandas e fazendas de todo o Rio de Janeiro peças únicas que resistem ao tempo.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
                alt="Artesão trabalhando"
                className="w-full h-96 object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3 block">O artesão Ricardo</span>
              <h2 className="text-3xl font-bold text-stone-800 mb-5 leading-tight">Décadas de dedicação ao artesanato em cimento</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed text-base">
                <p>
                  A Arte Rústica nasceu da paixão de Ricardo pelo trabalho manual com cimento. Estabelecido em Itaboraí, cidade reconhecida no Rio de Janeiro pela forte tradição artesanal em argila, barro e cimento, Ricardo transformou sua fábrica em um espaço de criação única.
                </p>
                <p>
                  Localizada na Rodovia Governador Mário Covas — a BR-101 — a loja expositora recebe visitantes, viajantes e clientes de todo o estado. Cada peça é moldada, trabalhada e finalizada à mão, garantindo que nenhuma seja exatamente igual à outra.
                </p>
                <p>
                  Do vaso mais simples ao chafariz de três andares, do pilar de entrada de fazenda à imagem sacra esculpida com devoção, cada criação carrega a identidade de quem a fez e a história de um lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Itaboraí */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3 block">A cidade e a tradição</span>
              <h2 className="text-3xl font-bold text-stone-800 mb-5 leading-tight">Itaboraí e o artesanato em cimento</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed text-base">
                <p>
                  Itaboraí é historicamente conhecida pela produção artesanal em argila e barro, uma tradição que remonta ao período colonial. Com o tempo, o cimento se tornou um material de escolha para artesãos que buscam durabilidade sem abrir mão da beleza.
                </p>
                <p>
                  A cidade abriga dezenas de ateliês e fábricas de artesanato, tornando-a um polo regional de decoração rústica. A Arte Rústica representa o melhor dessa tradição: qualidade de origem, personalização e preço direto ao consumidor.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 text-stone-500 text-sm">
                <MapPin size={16} className="text-amber-600 shrink-0" />
                <span>Rodovia Gov. Mário Covas, 13868 — Itaboraí, RJ</span>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="/image.png"
                alt="Loja expositora Arte Rústica"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-800">Nossos valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Hammer, title: 'Artesanato Autêntico', desc: 'Cada peça é única, feita com técnica e dedicação. Sem produção em massa, sem perda de identidade.' },
              { icon: Heart, title: 'Satisfação do Cliente', desc: 'Fazemos por encomenda, adaptamos ao seu espaço e garantimos que cada entrega supere suas expectativas.' },
              { icon: MapPin, title: 'Orgulho Local', desc: 'Produzido em Itaboraí, levando o nome da cidade e a qualidade fluminense para todo o estado do Rio.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                  <Icon size={24} className="text-amber-700" />
                </div>
                <h3 className="font-bold text-stone-800 text-lg">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Venha nos visitar ou explore o catálogo</h2>
          <p className="text-stone-400 mb-8 leading-relaxed">Estamos à beira da BR-101 esperando por você — ou clique abaixo para ver as peças online.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full transition-all hover:scale-105"
            >
              Ver catálogo <ArrowRight size={18} />
            </Link>
            <Link
              to="/contato"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-stone-600 hover:border-amber-500 text-stone-300 hover:text-amber-400 font-semibold rounded-full transition-colors"
            >
              Fale conosco
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
