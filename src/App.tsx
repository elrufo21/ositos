import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProductLandingPage from './pages/ProductLandingPage';
import ProductsPage from './pages/ProductsPage';
import OsitosLandingPage from './pages/OsitosLandingPage';
import { products } from './data/products';

function App() {
  const featuredProduct = products[0];

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={`/producto/${featuredProduct.slug}`} replace />}
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ositos-landing" element={<OsitosLandingPage />} />
          <Route path="/producto/:slug" element={<ProductLandingPage />} />
          <Route
            path="*"
            element={<Navigate to={`/producto/${featuredProduct.slug}`} replace />}
          />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
