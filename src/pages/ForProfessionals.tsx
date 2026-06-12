import { useState } from 'react';
import { CheckCircle, Users, Package, Ruler, Truck, Award, ArrowRight } from 'lucide-react';
import { getErrorMessage } from '../lib/errors';
import { submitLead } from '../lib/services/public';
import { buildWhatsAppUrl, professionalInquiryMessage } from '../lib/whatsapp';

const portfolioItems = [
  {
    title: 'Residência com Jardim Projetado',
    description: 'Conjunto de vasos e fonte central para jardim residencial em Niterói.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    category: 'Paisagismo Residencial',
  },
  {
    title: 'Entrada de Fazenda',
    description: 'Pilares e vasos sob encomenda para entrada monumental de fazenda no interior do RJ.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'Projeto Rural',
  },
  {
    title: 'Área de Lazer com Piscina',
    description: 'Bancos, vasos e esculturas decorativas para área de lazer em condomínio.',
    image: 'https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&q=80',
    category: 'Área de Lazer',
  },
  {
    title: 'Varanda Gourmet',
    description: 'Mesa e bancos rústicos em cimento para varanda gourmet em apartamento cobertura.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    category: 'Design de Interiores',
  },
];

export default function ForProfessionals() {
  const [form, setForm] = useState({ name: '', role: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await submitLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: `[${form.role.trim()}] ${form.message.trim()}`,
        client_type: 'professional',
        product_name: 'Parceria Profissional',
      });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel enviar sua mensagem agora.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero */}
      <section className="bg-stone-900 text-white py-20 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1400&q=80')" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-600/90 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6">
            <Users size={14} /> Para arquitetos e decoradores
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Parceria para projetos.<br /><span className="text-amber-400">Qualidade artesanal.</span>
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed mb-8">
            Fornecemos peças únicas em cimento para arquitetos, decoradores e paisagistas que buscam autenticidade, personalização e preço de fábrica.
          </p>
          <a
            href={buildWhatsAppUrl(professionalInquiryMessage(form.name || 'Profissional', form.role || 'Arquiteto/Decorador'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-4 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full text-lg transition-all hover:scale-105 shadow-xl"
          >
            Falar agora pelo WhatsApp <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Vantagens da parceria</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2">O que oferecemos a profissionais</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Ruler, title: 'Personalização Completa', desc: 'Dimensões, texturas, acabamentos e cores adaptados às especificações técnicas do seu projeto.' },
              { icon: Package, title: 'Fornecimento em Volume', desc: 'Capacidade de produção para atender projetos de grande escala com consistência de qualidade.' },
              { icon: Truck, title: 'Entrega no RJ', desc: 'Entregamos em todo o estado do Rio de Janeiro. Consulte prazos e logística para sua região.' },
              { icon: Award, title: 'Peças Exclusivas', desc: 'Criamos peças exclusivas para cada projeto, com moldes desenvolvidos especialmente para sua demanda.' },
              { icon: Users, title: 'Atendimento Dedicado', desc: 'Atendimento direto com o artesão. Sem intermediários, mais agilidade e fidelidade ao projeto.' },
              { icon: CheckCircle, title: 'Preço de Fábrica', desc: 'Por trabalharmos diretamente com o profissional, oferecemos condições comerciais diferenciadas.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-800 mb-1">{title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-16 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Portfólio</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2">Projetos realizados</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioItems.map((item) => (
              <div key={item.title} className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white border border-stone-100">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{item.category}</span>
                  <h3 className="font-semibold text-stone-800 mt-1 mb-1 leading-snug text-sm">{item.title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">Parceria</span>
            <h2 className="text-3xl font-bold text-stone-800 mt-2">Entre em contato</h2>
            <p className="text-stone-500 mt-2 text-sm">Preencha o formulário e entraremos em contato pelo WhatsApp.</p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-green-50 rounded-2xl border border-green-100">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-800 mb-2">Mensagem enviada!</h3>
              <p className="text-stone-500 text-sm">Entraremos em contato em breve pelo WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-stone-50 rounded-2xl p-8 border border-stone-100">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Nome *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Profissão *</label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Ex: Arquiteto, Decorador..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="(21) 99999-9999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Descreva seu projeto ou necessidade *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  placeholder="Conte sobre o projeto, as peças que precisa, quantidade estimada e prazo..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold rounded-full transition-colors text-base"
              >
                {submitting ? 'Enviando...' : 'Enviar mensagem'}
              </button>
              <p className="text-xs text-center text-stone-400">Após o envio, também podemos conversar pelo WhatsApp para agilizar.</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
