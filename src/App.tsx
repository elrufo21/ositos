import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ProductLandingPage from "./pages/ProductLandingPage";
import { useEffect } from "react";
import { initMetaPixel } from "./lib/metaPixel";

function App() {
  useEffect(() => {
    initMetaPixel();
  }, []);
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProductLandingPage />} />
          <Route
            path="/producto/polera-personalizada-ositos"
            element={<Navigate to="/" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
