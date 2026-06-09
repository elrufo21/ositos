import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProductLandingPage from './pages/ProductLandingPage';
import { products } from './data/products';

function App() {
  const featuredProduct = products[0];
  const productPath = `/producto/${featuredProduct.slug}`;

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={productPath} replace />} />
          <Route path="/producto/:slug" element={<ProductLandingPage />} />
          <Route path="*" element={<Navigate to={productPath} replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
