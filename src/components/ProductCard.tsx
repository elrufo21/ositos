import { Link } from 'react-router-dom';
import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/producto/${product.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.cover}
          alt={product.name}
          className="w-full aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {product.oldPrice && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-5">
        <p className="text-xs font-bold text-rose-700 uppercase tracking-widest mb-1">
          {product.brand}
        </p>
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-rose-800 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-extrabold text-rose-800">
            S/. {product.price.toFixed(2)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">
              S/. {product.oldPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-800 to-rose-900 text-white py-3 rounded-xl font-bold text-sm tracking-wide group-hover:from-rose-700 group-hover:to-rose-800 transition-all duration-300 shadow-md">
          <span>🛒</span>
          <span>Ver Producto</span>
        </div>
      </div>
    </Link>
  );
}
