import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Ruler, Weight, MessageCircle, Phone,
  ChevronLeft, ChevronRight, Check, Clock, Package,
} from 'lucide-react';
import type { Product, ProductVariant } from '../lib/database.types';
import { getErrorMessage } from '../lib/errors';
import { fetchProductDetails } from '../lib/services/public';
import { buildWhatsAppUrl, productInquiryMessage } from '../lib/whatsapp';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    const currentSlug: string = slug;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchProductDetails(currentSlug);
        setProduct(data.product);
        setVariants(data.variants);
        setSelectedVariant(data.variants[0] ?? null);
        setImgIndex(0);
      } catch (err) {
        setError(getErrorMessage(err, 'Não foi possível carregar os detalhes do produto.'));
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, [slug]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-terracotta-200 border-t-terracotta-600 rounded-full animate-spin" />
          <p className="text-stone-400 text-sm">Carregando produto...</p>
        </div>
      </div>
    );
  }

  /* ── Not found state ── */
  if (!product) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mb-2">
          <Package size={28} className="text-stone-300" />
        </div>
        <p className="text-stone-500 text-lg font-semibold">{error || 'Produto não encontrado.'}</p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta-600 text-white font-bold rounded-full text-sm hover:bg-terracotta-500 transition-colors"
        >
          <ArrowLeft size={15} /> Voltar ao catálogo
        </Link>
      </div>
    );
  }

  const images = product.images?.length
    ? product.images
    : ['/Chafariz-de-cimento-para-jardim-210cm-fc013__g437801.webp'];

  const waMessage = buildWhatsAppUrl(
    productInquiryMessage(
      selectedVariant
        ? `${product.name} (${selectedVariant.size_cm}, ${selectedVariant.finish}, ${selectedVariant.color || 'natural'})`
        : product.name
    )
  );

  const sizes = [...new Set(variants.map((v) => v.size_cm))];
  const finishes = [...new Set(variants.map((v) => v.finish))];
  const getVariantsBySize = (size: string) => variants.filter((v) => v.size_cm === size);

  const finishLabels: Record<string, string> = {
    cru: 'Cru',
    'pre-pintura': 'Pré-Pintura',
    pintado: 'Pintado',
  };

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8 flex-wrap">
          <Link to="/" className="hover:text-terracotta-600 transition-colors">Início</Link>
          <span className="text-stone-300">/</span>
          <Link to="/catalogo" className="hover:text-terracotta-600 transition-colors">Catálogo</Link>
          {product.category && (
            <>
              <span className="text-stone-300">/</span>
              <Link
                to={`/catalogo?categoria=${product.category.slug}`}
                className="hover:text-terracotta-600 transition-colors"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="text-stone-300">/</span>
          <span className="text-stone-600 font-semibold">{product.name}</span>
        </nav>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* ── Image Gallery ── */}
          <div>
            {/* Main image */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-stone-100 shadow-md group">
              <img
                src={images[imgIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Nav arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110"
                  >
                    <ChevronLeft size={18} className="text-stone-700" />
                  </button>
                  <button
                    onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all hover:scale-110"
                  >
                    <ChevronRight size={18} className="text-stone-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.is_featured && (
                  <span className="px-3 py-1 bg-terracotta-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                    Destaque
                  </span>
                )}
                <span className="px-3 py-1 bg-stone-900/70 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg backdrop-blur-sm">
                  Em Mostruário
                </span>
              </div>

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-stone-900/60 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                  {imgIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 hover:scale-105 ${
                      i === imgIndex
                        ? 'border-terracotta-500 shadow-md shadow-terracotta-200'
                        : 'border-stone-200 hover:border-terracotta-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            {/* Category link */}
            {product.category && (
              <Link
                to={`/catalogo?categoria=${product.category.slug}`}
                className="text-[10px] font-extrabold text-terracotta-600 uppercase tracking-widest hover:text-terracotta-500 transition-colors mb-3 inline-block"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="text-3xl sm:text-4xl font-outfit font-bold text-stone-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <p className="text-stone-600 leading-relaxed mb-8 text-base">
              {product.description}
            </p>

            {/* ── Variants panel ── */}
            {variants.length > 0 && selectedVariant && (
              <div className="mb-8 bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="p-6 space-y-6">
                  {/* Size selector */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-400 mb-3">
                      Tamanho
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => {
                        const isSelected = selectedVariant.size_cm === size;
                        return (
                          <button
                            key={size}
                            onClick={() => {
                              const v = getVariantsBySize(size)[0];
                              if (v) setSelectedVariant(v);
                            }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                              isSelected
                                ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-200'
                                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-terracotta-300 hover:bg-terracotta-50'
                            }`}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Finish selector */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-400 mb-3">
                      Acabamento
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {finishes.map((finish) => {
                        const variantWithFinish = variants.find(
                          (v) => v.finish === finish && v.size_cm === selectedVariant.size_cm
                        );
                        const isSelected = selectedVariant.finish === finish;
                        return (
                          <button
                            key={finish}
                            onClick={() => {
                              const v = variants.find(
                                (v) => v.finish === finish && v.size_cm === selectedVariant.size_cm
                              );
                              if (v) setSelectedVariant(v);
                            }}
                            disabled={!variantWithFinish}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                              isSelected
                                ? 'bg-terracotta-600 text-white shadow-md shadow-terracotta-200'
                                : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-terracotta-300 hover:bg-terracotta-50'
                            }`}
                          >
                            {finishLabels[finish] ?? finish}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color selector */}
                  {selectedVariant.finish === 'pintado' && (
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-widest text-stone-400 mb-3">
                        Cor
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {getVariantsBySize(selectedVariant.size_cm)
                          .filter((v) => v.finish === 'pintado')
                          .map((variant) => {
                            const isSelected = selectedVariant.id === variant.id;
                            return (
                              <button
                                key={variant.id}
                                onClick={() => setSelectedVariant(variant)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                  isSelected
                                    ? 'bg-terracotta-600 text-white shadow-md'
                                    : 'bg-stone-50 text-stone-700 border border-stone-200 hover:border-terracotta-300 hover:bg-terracotta-50'
                                }`}
                              >
                                {isSelected && <Check size={14} />}
                                {variant.color}
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price + availability footer */}
                <div className="bg-stone-50 border-t border-stone-100 px-6 py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold mb-1">
                      Preço selecionado
                    </p>
                    <p className="text-3xl font-outfit font-extrabold text-stone-900">
                      R$ {selectedVariant.price_final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  {selectedVariant.in_stock_mostruario > 0 ? (
                    <span className="flex items-center gap-2 px-4 py-2 bg-forest-100 text-forest-700 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse" />
                      {selectedVariant.in_stock_mostruario} disponível
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                      <Clock size={12} />
                      {selectedVariant.production_time_days}–{selectedVariant.production_time_days + 3} dias
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* ── Specs ── */}
            {(product.dimensions || product.weight) && (
              <div className="grid grid-cols-2 gap-3 mb-8">
                {product.dimensions && (
                  <div className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-stone-100 shadow-sm">
                    <div className="w-8 h-8 bg-terracotta-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Ruler size={15} className="text-terracotta-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Dimensões</p>
                      <p className="text-stone-700 text-sm font-semibold mt-0.5">{product.dimensions}</p>
                    </div>
                  </div>
                )}
                {product.weight && (
                  <div className="bg-white rounded-2xl p-4 flex items-start gap-3 border border-stone-100 shadow-sm">
                    <div className="w-8 h-8 bg-terracotta-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Weight size={15} className="text-terracotta-600" />
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 uppercase tracking-wide font-bold">Peso</p>
                      <p className="text-stone-700 text-sm font-semibold mt-0.5">{product.weight}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CTAs ── */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={waMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-green-900/20 text-base"
              >
                <MessageCircle size={20} />
                Solicitar orçamento
              </a>
              <a
                href="tel:+5521981099926"
                className="flex items-center justify-center gap-2.5 px-6 py-4 bg-white border-2 border-stone-200 hover:border-terracotta-400 text-stone-700 hover:text-terracotta-700 font-semibold rounded-2xl transition-all text-base shadow-sm"
              >
                <Phone size={18} />
                Ligar
              </a>
            </div>

            {/* Info note */}
            <p className="text-xs text-stone-400 mt-4 leading-relaxed">
              {selectedVariant && selectedVariant.in_stock_mostruario > 0
                ? '✓ Produto disponível em mostruário para retirada ou entrega.'
                : `⏱ Prazo de produção: ${selectedVariant?.production_time_days ?? '–'} dias úteis.`}
            </p>
          </div>
        </div>

        {/* ── Back link ── */}
        <div className="mt-14 pt-8 border-t border-stone-200">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-terracotta-600 transition-colors font-semibold group"
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
