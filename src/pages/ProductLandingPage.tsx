import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { products } from "../data/products";
import PromoBar from "../components/PromoBar";
import FlyerFeed from "../components/FlyerFeed";
import OrderModal from "../components/OrderModal";
import WhatsappButton from "../components/WhatsappButton";
import Footer from "../components/Footer";
import RecentPurchaseToast from "../components/RecentPurchaseToast";

export default function ProductLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <>
      <Helmet>
        <title>
          {product.name} | {product.brand} - Poleras Personalizadas
        </title>
        <meta
          name="description"
          content={
            product.description ||
            `${product.name} - Poleras personalizadas WAWAS R US. Desde S/.${product.price}. ¡Pide la tuya ahora!`
          }
        />
        <meta
          name="keywords"
          content={`${product.name}, poleras personalizadas, WAWAS R US, regalo, familia`}
        />
        <meta
          property="og:title"
          content={`${product.name} | ${product.brand}`}
        />
        <meta
          property="og:description"
          content={product.description || `Desde S/.${product.price}`}
        />
        <meta property="og:image" content={product.cover} />
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${product.name} | ${product.brand}`}
        />
        <meta
          name="twitter:description"
          content={product.description || `Desde S/.${product.price}`}
        />
        <meta name="twitter:image" content={product.cover} />
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
