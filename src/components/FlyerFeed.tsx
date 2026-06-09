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

        @keyframes slide-up-soft {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shake-btn {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-5px) rotate(-1deg); }
          20% { transform: translateX(5px) rotate(1deg); }
          30% { transform: translateX(-4px) rotate(-0.5deg); }
          40% { transform: translateX(4px) rotate(0.5deg); }
          50% { transform: translateX(-3px); }
          60% { transform: translateX(3px); }
          70% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
          90% { transform: translateX(-1px); }
        }

        .animate-pulse-green-soft {
          animation: pulse-green-soft 2s ease-in-out infinite;
        }

        .animate-float-cart {
          animation: float-cart 1.8s ease-in-out infinite;
        }

        .animate-slide-up-soft {
          animation: slide-up-soft 0.45s ease-out both;
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

          {(index === 0 || index === 3) && (
            <div className="my-2 px-1 animate-slide-up-soft">
              <button
                type="button"
                onClick={onOrderClick}
                className="w-full py-3.5 rounded-2xl border-2 border-white/80 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white font-black text-sm sm:text-base shadow-[0_0_0_2px_rgba(255,255,255,0.45),0_10px_25px_rgba(244,63,94,0.35)] active:scale-[0.98] transition-transform duration-200 hover:scale-[1.01] animate-[shake-btn_1s_ease-in-out_infinite]"
              >
                🛒 COMPRAR AHORA
              </button>
            </div>
          )}
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
