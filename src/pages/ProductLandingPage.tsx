import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { products } from "../data/products";
import PromoBar from "../components/PromoBar";
import FlyerFeed from "../components/FlyerFeed";
import OrderModal from "../components/OrderModal";
//import WhatsappButton from "../components/WhatsappButton";
import Footer from "../components/Footer";
import RecentPurchaseToast from "../components/RecentPurchaseToast";

const siteUrl = "https://www.wawasrus.com";
const defaultProductPath = "/producto/polera-personalizada-ositos";

export default function ProductLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) {
    return <Navigate to={defaultProductPath} replace />;
  }

  const canonicalUrl = `${siteUrl}/producto/${product.slug}`;
  const productImageUrl = new URL(product.cover, siteUrl).toString();
  const seoTitle =
    "Regalo para Dia del Padre: polera personalizada para papa e hijo | WAWAS R US";
  const seoDescription =
    "Polera personalizada OSITOS WAWAS R US para papa, bebe y familia. Regalo para Dia del Padre, ropa para bebe y tallas desde 0-3M hasta adulto XL.";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    description: seoDescription,
    image: product.flyers.map((image) => new URL(image, siteUrl).toString()),
    url: canonicalUrl,
    category: "Ropa personalizada para bebe y familia",
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: "unisex",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "PEN",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: canonicalUrl,
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Helmet>
        <html lang="es-PE" />
        <title>{seoTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="regalo para dia del padre, regalos para el dia del padre, ropa para bebe, polera personalizada, polera papa e hijo, WAWAS R US"
        />
        <meta property="og:locale" content="es_PE" />
        <meta
          property="og:title"
          content={seoTitle}
        />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={product.brand} />
        <meta property="og:image" content={productImageUrl} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={`${product.price}`} />
        <meta property="product:price:currency" content="PEN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={productImageUrl} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <PromoBar />

      <main className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pt-12 pb-8">
        <FlyerFeed
          product={product}
          onOrderClick={() => setIsModalOpen(true)}
        />
      </main>

      <OrderModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/** <WhatsappButton phone={product.whatsapp} /> */}

      <Footer />
      <RecentPurchaseToast />
    </>
  );
}
