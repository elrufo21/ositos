import type { Product } from "../types/product";

interface FlyerFeedProps {
  product: Product;
  onOrderClick: () => void;
}

export default function FlyerFeed({ product, onOrderClick }: FlyerFeedProps) {
  return (
    <div className="w-full max-w-[450px] mx-auto px-2 sm:px-0">
      <style>{`
        @keyframes pulse-green-soft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 24px rgba(34, 197, 94, 0.25);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 18px 36px rgba(34, 197, 94, 0.35);
          }
        }

        @keyframes float-cart {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .animate-pulse-green-soft {
          animation: pulse-green-soft 2s ease-in-out infinite;
        }

        .animate-float-cart {
          animation: float-cart 1.8s ease-in-out infinite;
        }
      `}</style>

      {product.flyers.map((flyer, index) => (
        <div key={index}>
          <div
            className="w-full relative overflow-hidden rounded-lg shadow-md mb-1"
            style={{ aspectRatio: "720 / 1600" }}
          >
            <img
              src={flyer}
              alt={`${product.name} - Flyer ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      ))}

      {/* Final CTA - Strongest animation */}
      <div className="sticky bottom-4 z-20 py-4">
        <div className="rounded-3xl border border-emerald-100 bg-white/95 p-3 shadow-2xl backdrop-blur-sm">
          <button
            onClick={onOrderClick}
            className="w-full py-5 bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600 hover:from-emerald-500 hover:via-green-400 hover:to-emerald-500 text-white font-extrabold text-xl rounded-3xl shadow-2xl transform transition-all duration-300 flex items-center justify-center gap-3 animate-pulse-green-soft cursor-pointer active:scale-95"
          >
            <span className="text-3xl animate-float-cart">🛒</span>
            REALIZAR MI PEDIDO AHORA
            <span
              className="text-3xl animate-float-cart"
              style={{ animationDelay: "0.1s" }}
            >
              🛒
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
