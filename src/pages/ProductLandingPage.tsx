import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { products } from "../data/products";
import PromoBar from "../components/PromoBar";
import FlyerFeed from "../components/FlyerFeed";
import OrderModal from "../components/OrderModal";
//import WhatsappButton from "../components/WhatsappButton";
import Footer from "../components/Footer";
import RecentPurchaseToast from "../components/RecentPurchaseToast";

const siteUrl = "https://www.wawasrus.com";

export default function ProductLandingPage() {
  const product = products[0];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canonicalUrl = `${siteUrl}/`;
  const productImageUrl = new URL(product.cover, siteUrl).toString();
  const seoTitle =
    "WAWAS R US | Regalo para Dia del Padre y ropa para bebe personalizada";
  const seoDescription =
    "WAWAS R US, WAWAS, WAWARUS y WAWASRUS: polera personalizada OSITOS para papa, bebe y familia. Regalo para Dia del Padre y ropa para bebes.";
  const seoKeywords =
    "wawas, wawas r us, wawarus, wawasrus, wawas ropa para bebes, ropa para bebes, ropa de bebe, ropa para bebe personalizada, regalo para dia del padre, regalos para el dia del padre, polera personalizada, polera papa e hijo";
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      brand: {
        "@type": "Brand",
        name: product.brand,
        alternateName: ["WAWAS", "WAWARUS", "WAWASRUS"],
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
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: product.brand,
      alternateName: ["WAWAS", "WAWARUS", "WAWASRUS"],
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: product.brand,
      alternateName: ["WAWAS", "WAWARUS", "WAWASRUS"],
      url: canonicalUrl,
    },
  ];

  return (
    <>
      <Helmet>
        <html lang="es-PE" />
        <title>{seoTitle}</title>
        <link rel="canonical" href={canonicalUrl} />
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={seoKeywords} />
        <meta name="author" content={product.brand} />
        <meta name="application-name" content={product.brand} />
        <meta property="og:locale" content="es_PE" />
        <meta property="og:title" content={seoTitle} />
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
