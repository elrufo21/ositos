import { products } from '../data/products';
import ProductCard from './ProductCard';

export default function ProductCatalog() {
  return (
    <section className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            🧸 <span className="bg-gradient-to-r from-rose-800 to-rose-600 bg-clip-text text-transparent">OSITOS</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Poleras personalizadas para toda la familia. Hechas con amor, diseñadas para durar.
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-rose-800 to-rose-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
