import type { Product } from '../types/product';

interface FlyerFeedProps {
  product: Product;
  onOrderClick: () => void;
}

export default function FlyerFeed({ product, onOrderClick }: FlyerFeedProps) {
  return (
    <div className="w-full max-w-[450px] mx-auto px-2 sm:px-0">
      {product.flyers.map((flyer, index) => (
        <div key={index}>
          <div
            className="w-full relative overflow-hidden rounded-lg shadow-md mb-1"
            style={{ aspectRatio: '720 / 1600' }}
          >
            <img
              src={flyer}
              alt={`${product.name} - Flyer ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* CTA buttons after flyers 2 and 4 */}
          {(index === 1 || index === 3) && (
            <div className="py-5">
              <button
                onClick={onOrderClick}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 animate-pulse-slow cursor-pointer"
              >
                <span className="text-2xl">🛒</span>
                REALIZAR PEDIDO AHORA
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Final CTA */}
      <div className="py-8">
        <button
          onClick={onOrderClick}
          className="w-full py-5 bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-extrabold text-xl rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="text-2xl">🔥</span>
          ¡QUIERO EL MÍO AHORA!
          <span className="text-2xl">🔥</span>
        </button>
      </div>
    </div>
  );
}
