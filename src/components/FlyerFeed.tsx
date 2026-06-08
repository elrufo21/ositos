import type { Product } from "../types/product";

interface FlyerFeedProps {
  product: Product;
  onOrderClick: () => void;
}

export default function FlyerFeed({ product, onOrderClick }: FlyerFeedProps) {
  return (
    <div className="w-full max-w-[450px] mx-auto px-2 sm:px-0">
      <style>{`
        @keyframes shake-intense {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-1px) rotate(-0.2deg); }
          20% { transform: translateX(1px) rotate(0.2deg); }
          30% { transform: translateX(-1px) rotate(-0.2deg); }
          40% { transform: translateX(1px) rotate(0.2deg); }
          50% { transform: translateX(-0.5px) rotate(-0.1deg); }
          60% { transform: translateX(0.5px) rotate(0.1deg); }
          70% { transform: translateX(-0.5px) rotate(-0.1deg); }
          80% { transform: translateX(0.5px) rotate(0.1deg); }
          90% { transform: translateX(0) rotate(0deg); }
        }
        
        @keyframes pulse-red-intense {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 25px rgba(220, 38, 38, 0.4);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 20px 50px rgba(220, 38, 38, 0.6);
          }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg) scale(1); }
          50% { transform: rotate(2deg) scale(1.05); }
        }
        
        .animate-shake-intense {
          animation: shake-intense 0.5s ease-in-out infinite;
        }
        
        .animate-pulse-red-intense {
          animation: pulse-red-intense 1.5s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 0.6s ease-in-out infinite;
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

          {/* CTA button after flyer 2 */}
          {index === 1 && (
            <div className="py-5">
              <button
                onClick={onOrderClick}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xl rounded-3xl shadow-2xl transform transition-all duration-300 flex items-center justify-center gap-3 animate-shake-intense cursor-pointer active:scale-95"
              >
                <span className="text-3xl animate-wiggle">🔥</span>
                COMPRAR AHORA
                <span
                  className="text-3xl animate-wiggle"
                  style={{ animationDelay: "0.15s" }}
                >
                  🔥
                </span>
              </button>
            </div>
          )}

          {/* CTA button after flyer 4 */}
          {index === 3 && (
            <div className="py-5">
              <button
                onClick={onOrderClick}
                className="w-full py-5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xl rounded-3xl shadow-2xl transform transition-all duration-300 flex items-center justify-center gap-3 animate-shake-intense cursor-pointer active:scale-95"
              >
                <span className="text-3xl animate-wiggle">🔥</span>
                COMPRAR AHORA
                <span
                  className="text-3xl animate-wiggle"
                  style={{ animationDelay: "0.15s" }}
                >
                  🔥
                </span>
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Final CTA - Strongest animation */}
      <div className="py-8">
        <button
          onClick={onOrderClick}
          className="w-full py-6 bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:via-red-500 hover:to-red-600 text-white font-extrabold text-2xl rounded-3xl shadow-2xl transform transition-all duration-300 flex items-center justify-center gap-4 animate-pulse-red-intense cursor-pointer active:scale-95"
        >
          <span className="text-4xl animate-wiggle">🔥</span>
          ¡QUIERO EL MÍO AHORA!
          <span
            className="text-4xl animate-wiggle"
            style={{ animationDelay: "0.2s" }}
          >
            🔥
          </span>
        </button>
        <p className="text-center text-red-700 font-bold text-sm mt-4 animate-pulse">
          ⚠️ Stock limitado
        </p>
      </div>
    </div>
  );
}
