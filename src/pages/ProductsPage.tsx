import { Helmet } from 'react-helmet-async';
import ProductCatalog from '../components/ProductCatalog';
import Footer from '../components/Footer';

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>OSITOS | Poleras Personalizadas para Toda la Familia</title>
        <meta name="description" content="Poleras personalizadas OSITOS con el nombre de tus hijos. Hechas con algodón premium, perfectas para compartir en familia. ¡Precios únicos por temporada!" />
        <meta name="keywords" content="poleras personalizadas, ropa familiar, OSITOS, regalo papá, día del padre, poleras con nombre" />
        <meta property="og:title" content="OSITOS | Poleras Personalizadas" />
        <meta property="og:description" content="Poleras personalizadas con el nombre de tus hijos. Perfectas para compartir en familia." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="OSITOS | Poleras Personalizadas" />
        <meta name="twitter:description" content="Poleras personalizadas con el nombre de tus hijos." />
      </Helmet>
      <ProductCatalog />
      <Footer />
    </>
  );
}
