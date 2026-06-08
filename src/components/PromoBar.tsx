export default function PromoBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-rose-900 via-red-800 to-rose-900 text-white py-2.5 overflow-hidden shadow-lg">
      <div className="animate-marquee whitespace-nowrap flex gap-16">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="text-sm font-bold tracking-wider flex-shrink-0">
            🔥 PRECIOS ÚNICOS POR TEMPORADA 🔥
          </span>
        ))}
      </div>
    </div>
  );
}
