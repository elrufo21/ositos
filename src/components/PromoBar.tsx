export default function PromoBar() {
  const items = [
    "PRECIOS ÚNICOS POR TEMPORADA",
    "REGALO IDEAL PARA EL DÍA DEL PADRE",
    "ENVÍOS A TODO EL PERÚ",
    "POLERAS PERSONALIZADAS",
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-rose-900 via-red-800 to-rose-900 text-white py-2.5 overflow-hidden shadow-lg">
      <div className="promo-bar__track whitespace-nowrap flex will-change-transform">
        {[...items, ...items].map((text, i) => (
          <span
            key={`${text}-${i}`}
            className="promo-bar__item text-sm font-bold tracking-wider flex-shrink-0 flex items-center gap-2 px-6"
          >
            <span>👨‍🦱</span>
            {text}
            <span>🎁</span>
          </span>
        ))}
      </div>
    </div>
  );
}
