import { Helmet } from "react-helmet-async";
import ProductCatalog from "../components/ProductCatalog";
import Footer from "../components/Footer";
import RecentPurchaseToast from "../components/RecentPurchaseToast";

export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>WAWAS R US | Ropa para bebes</title>
        <meta
          name="description"
          content="Poleras personalizadas WAWAS R US con el nombre de tus hijos. Hechas con algodón premium, perfectas para compartir en familia. ¡Precios únicos por temporada!"
        />
        <meta
          name="keywords"
          content="poleras personalizadas, ropa familiar, WAWAS R US, regalo papá, día del padre, poleras con nombre"
        />
        <meta
          property="og:title"
          content="WAWAS R US | Poleras Personalizadas"
        />
        <meta
          property="og:description"
          content="Poleras personalizadas con el nombre de tus hijos. Perfectas para compartir en familia."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="WAWAS R US | Poleras Personalizadas"
        />
        <meta
          name="twitter:description"
          content="Poleras personalizadas con el nombre de tus hijos."
        />
      </Helmet>
      <ProductCatalog />
      <Footer />
      <RecentPurchaseToast />
    </>
  );
}
