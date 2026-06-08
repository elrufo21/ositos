export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 py-10">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-4">
          <span className="text-2xl">🧸</span>
          <h2 className="text-xl font-bold text-white mt-1 tracking-wide">
            WAWAS R US
          </h2>
        </div>
        <p className="text-sm mb-2">
          Poleras personalizadas para toda la familia
        </p>
        <p className="text-sm text-gray-500">
          Hechas con amor ♡ Diseñadas para durar
        </p>
        <div className="mt-6 h-px w-32 bg-gray-700 mx-auto" />
        <p className="text-xs text-gray-600 mt-4">
          © {new Date().getFullYear()} WAWAS R US. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
