import { useState } from 'react';
import { MapPin, Phone, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { getErrorMessage } from '../lib/errors';
import { submitLead } from '../lib/services/public';
import { buildWhatsAppUrl, quoteRequestMessage } from '../lib/whatsapp';

const environments = ['Jardim', 'Varanda', 'Piscina', 'Entrada / Porteira', 'Arte Religiosa', 'Mobiliário Rústico', 'Outro'];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    environment: '',
    message: '',
    client_type: 'individual' as 'individual' | 'professional',
  });
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
        message: form.environment ? `[${form.environment}] ${form.message.trim()}` : form.message.trim(),
        client_type: form.client_type,
        product_name: form.environment || '',
      });
      setSubmitted(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Nao foi possivel enviar sua solicitacao agora.'));
    } finally {
      setSubmitting(false);
    }
  }

  const waLink = buildWhatsAppUrl(
    quoteRequestMessage(form.name || 'visitante', form.environment || 'decoração', form.message || 'Gostaria de um orçamento.')
  );

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      {/* Banner */}
      <div className="bg-stone-900 py-14 px-4 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3 block">Orçamento e Contato</span>
        <h1 className="text-4xl font-bold text-white mb-3">Solicite um orçamento</h1>
        <p className="text-stone-400 text-base max-w-xl mx-auto">
          Descreva o que você precisa e entraremos em contato pelo WhatsApp para conversar sobre as opções.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
              <h3 className="font-bold text-stone-800 text-lg mb-5">Informações de Contato</h3>
              <div className="space-y-5">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={17} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">Endereço</p>
                    <p className="text-stone-500 text-sm mt-0.5">Rodovia Gov. Mário Covas, 13868<br />Itaboraí — Rio de Janeiro</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={17} className="text-green-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">WhatsApp</p>
                    <a
                      href={buildWhatsAppUrl('Ola, vim pelo site Arte Rustica!')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-500 text-sm font-medium mt-0.5 block transition-colors"
                    >
                      (21) 98109-9926
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={17} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">Telefone</p>
                    <a href="tel:+5521981099926" className="text-stone-600 text-sm mt-0.5 hover:text-amber-700 transition-colors block">
                      (21) 98109-9926
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-stone-100 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={17} className="text-stone-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">Horário de Atendimento</p>
                    <p className="text-stone-500 text-sm mt-0.5">Segunda a Sábado: 8h às 18h<br />Domingo: 8h às 14h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp direct CTA */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
              <MessageCircle size={28} className="text-green-500 mx-auto mb-3" />
              <h4 className="font-bold text-stone-800 mb-1.5">Prefere falar direto?</h4>
              <p className="text-stone-500 text-xs mb-4 leading-relaxed">Clique abaixo e abra uma conversa no WhatsApp agora mesmo.</p>
              <a
                href={buildWhatsAppUrl('Ola! Vim pelo site Arte Rustica e gostaria de um orcamento.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full transition-colors text-sm"
              >
                <MessageCircle size={16} /> Abrir WhatsApp
              </a>
            </div>

            {/* Map image */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100">
              <img
                src="/image.png"
                alt="Loja Arte Rústica"
                className="w-full h-44 object-cover"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-stone-100 shadow-sm">
                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-stone-800 mb-2">Mensagem enviada!</h3>
                <p className="text-stone-500 leading-relaxed mb-6 max-w-sm mx-auto">Recebemos seu contato e entraremos em touch pelo WhatsApp em breve.</p>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-full text-sm transition-colors"
                >
                  <MessageCircle size={16} /> Falar agora pelo WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 space-y-6">
                <h2 className="text-xl font-bold text-stone-800">Formulário de Orçamento</h2>
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {/* Client type toggle */}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Você é:</label>
                  <div className="flex rounded-xl overflow-hidden border border-stone-200">
                    {[
                      { value: 'individual', label: 'Comprador Individual' },
                      { value: 'professional', label: 'Profissional (Arquiteto/Decorador)' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setForm({ ...form, client_type: opt.value as 'individual' | 'professional' })}
                        className={`flex-1 py-2.5 text-sm font-medium transition-colors ${form.client_type === opt.value ? 'bg-amber-600 text-white' : 'bg-white text-stone-500 hover:bg-stone-50'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Nome *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="(21) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Ambiente de decoração</label>
                  <select
                    value={form.environment}
                    onChange={(e) => setForm({ ...form, environment: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors"
                  >
                    <option value="">Selecione um ambiente</option>
                    {environments.map((env) => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Mensagem *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    placeholder="Descreva o que você precisa: tipo de peça, tamanho aproximado, quantidade, ambiente..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold rounded-full transition-colors text-base"
                >
                  {submitting ? 'Enviando...' : 'Enviar solicitação'}
                </button>
                <p className="text-xs text-center text-stone-400">
                  Seus dados são usados apenas para atender ao seu pedido. Não enviamos spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
