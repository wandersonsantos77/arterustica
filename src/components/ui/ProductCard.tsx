import { Link } from 'react-router-dom';
import { MessageCircle, Package, Eye } from 'lucide-react';
import type { Product } from '../../lib/database.types';
import { buildWhatsAppUrl, productInquiryMessage } from '../../lib/whatsapp';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const image = product.images?.[0] ?? 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80';

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-terracotta-900/10 transition-all duration-500 border border-stone-100/80 hover:border-terracotta-200/60 flex flex-col">
      {/* Image wrapper */}
      <Link to={`/produto/${product.slug}`} className="relative overflow-hidden aspect-[4/3] flex-shrink-0">
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
        />
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* Badge row */}
        <div className="absolute top-3 left-3 flex gap-2">
          {product.is_featured && (
            <span className="px-2.5 py-1 bg-terracotta-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              Destaque
            </span>
          )}
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg ${
            product.in_stock
              ? 'bg-forest-700 text-white'
              : 'bg-stone-700/90 text-stone-300'
          }`}>
            {product.in_stock ? 'Em Estoque' : 'Sob Encomenda'}
          </span>
        </div>

        {/* Hover quick-view button */}
        <div className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 text-stone-800 text-xs font-bold rounded-full shadow-xl backdrop-blur-sm">
            <Eye size={13} /> Ver detalhes
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {product.category && (
          <span className="text-[10px] text-terracotta-600 font-bold uppercase tracking-widest mb-1.5">
            {product.category.name}
          </span>
        )}
        <Link to={`/produto/${product.slug}`}>
          <h3 className="font-outfit font-semibold text-stone-800 text-base mb-1.5 group-hover:text-terracotta-700 transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        {/* Price + action row */}
        <div className="flex items-center justify-between mt-auto gap-3">
          <div>
            {product.price ? (
              <div>
                <span className="text-xl font-outfit font-extrabold text-stone-900">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ) : (
              <span className="text-sm text-stone-500 italic flex items-center gap-1.5">
                <Package size={14} /> Consultar preço
              </span>
            )}
          </div>
          <a
            href={buildWhatsAppUrl(productInquiryMessage(product.name))}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded-full transition-all hover:scale-105 shadow-md shadow-green-900/20 flex-shrink-0"
          >
            <MessageCircle size={13} />
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}
