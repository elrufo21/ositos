import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { products } from "../data/products";

const quickBenefits = [
  "Algodón premium",
  "Nombre personalizado",
  "Tallas para toda la familia",
  "Envíos a todo el Perú",
];

const orderSteps = [
  ["1", "Elige tu pack", "Selecciona 1, 2 o 3 poleras según tu familia."],
  [
    "2",
    "Envía el nombre",
    "Coordinamos por WhatsApp el nombre, talla y color.",
  ],
  [
    "3",
    "Recibe tu pedido",
    "Lo preparamos personalizado y te ayudamos con el envío.",
  ],
];

const sizes = [
  ["Baby", "0-24M", "Desde recién nacido"],
  ["Kids", "T4-T16", "Niños y niñas"],
  ["Mujer", "S-XL", "Corte cómodo"],
  ["Hombre", "S-XL", "Fit regular"],
];

const reviews = [
  {
    name: "Valentina R.",
    text: "Lo pedí para mi esposo y mi hijo. La tela se siente gruesita y el nombre quedó precioso.",
  },
  {
    name: "Camila T.",
    text: "Llegó listo para regalo. Los colores son iguales a las fotos y la atención fue súper rápida.",
  },
  {
    name: "Luciana M.",
    text: "Compré el pack familiar y fue un éxito para nuestras fotos. Muy cómodo para usar también.",
  },
];

export default function OsitosLandingPage() {
  const product = products[0];
  const [activeImage, setActiveImage] = useState(0);
  const [selectedPack, setSelectedPack] = useState(1);

  const packs = useMemo(
    () => [
      { count: 1, label: "1 polera", price: product.price, note: "Para papá" },
      { count: 2, label: "2 poleras", price: 165, note: "Papá + hijo" },
      { count: 3, label: "3 poleras", price: 239, note: "Pack familiar" },
    ],
    [product.price],
  );

  const selectedDeal =
    packs.find((pack) => pack.count === selectedPack) ?? packs[0];
  const whatsappText = encodeURIComponent(
    `Hola, quiero pedir ${selectedDeal.label} WAWAS R US personalizado. Precio S/ ${selectedDeal.price}.`,
  );
  const whatsappUrl = `https://wa.me/${product.whatsapp}?text=${whatsappText}`;

  return (
    <>
      <Helmet>
        <title>WAWAS R US Landing </title>
        <meta
          name="description"
          content="Vista responsive de prueba para poleras WAWAS R US personalizadas."
        />
      </Helmet>

      <main className="ositos-v2" id="top">
        <div className="ositos-v2__ticker">
          <div>
            {Array.from({ length: 6 }).map((_, index) => (
              <span key={index}>
                Stock limitado / Personalizado con nombre / Envíos a todo el
                Perú
              </span>
            ))}
          </div>
        </div>

        <header className="ositos-v2__nav">
          <a href="#top" className="ositos-v2__brand" aria-label="Ir al inicio">
            WAWAS R US
          </a>
          <nav aria-label="Secciones">
            <a href="#tallas">Tallas</a>
            <a href="#resenas">Reseñas</a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              Comprar
            </a>
          </nav>
        </header>

        <section className="ositos-v2__hero">
          <div className="ositos-v2__gallery" aria-label="Galería del producto">
            <div className="ositos-v2__stage">
              <img
                src={product.flyers[activeImage]}
                alt={`${product.name} vista ${activeImage + 1}`}
                decoding="async"
                fetchPriority="high"
              />
              <span className="ositos-v2__badge">Oferta hoy</span>
            </div>
            <div className="ositos-v2__thumbs">
              {product.flyers.slice(0, 3).map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={activeImage === index ? "is-active" : ""}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="ositos-v2__panel">
            <p className="ositos-v2__eyebrow">Poleras personalizadas</p>
            <h1>
              <span className="ositos-v2__title-line">El regalo</span>
              <span className="ositos-v2__title-line">que papá</span>
              <span>amará</span>
            </h1>
            <p className="ositos-v2__lead">
              Poleras OSITOS para papá, mamá e hijos. Suaves, abrigadoras y
              personalizadas con el nombre que elijas.
            </p>

            <div className="ositos-v2__price">
              <strong>S/ {selectedDeal.price}</strong>
              <span>S/ {product.oldPrice}</span>
            </div>

            <div className="ositos-v2__packs" aria-label="Elegir pack">
              {packs.map((pack) => (
                <button
                  type="button"
                  key={pack.count}
                  className={selectedPack === pack.count ? "is-selected" : ""}
                  onClick={() => setSelectedPack(pack.count)}
                >
                  <b>{pack.label}</b>
                  <span>S/ {pack.price}</span>
                  <small>{pack.note}</small>
                </button>
              ))}
            </div>

            <div className="ositos-v2__benefits">
              {quickBenefits.map((benefit) => (
                <span key={benefit}>{benefit}</span>
              ))}
            </div>

            <a
              className="ositos-v2__cta"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Pedir por WhatsApp
            </a>
          </div>
        </section>

        <section className="ositos-v2__steps">
          <div className="ositos-v2__section-heading">
            <p className="ositos-v2__eyebrow">Pedido fácil</p>
            <h2>Así personalizamos tu polera</h2>
          </div>
          <div className="ositos-v2__step-grid">
            {orderSteps.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ositos-v2__sizes" id="tallas">
          <div className="ositos-v2__section-heading">
            <p className="ositos-v2__eyebrow">Guía rápida</p>
            <h2>Tallas desde bebé hasta adulto XL</h2>
          </div>
          <div className="ositos-v2__size-grid">
            {sizes.map(([line, range, detail]) => (
              <article key={line}>
                <span>{line}</span>
                <strong>{range}</strong>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ositos-v2__proof" id="resenas">
          <div className="ositos-v2__section-heading">
            <p className="ositos-v2__eyebrow">Clientes felices</p>
            <h2>Regalos personalizados que sí se usan.</h2>
          </div>
          <div className="ositos-v2__review-grid">
            {reviews.map((review) => (
              <article key={review.name}>
                <span>★★★★★</span>
                <h3>{review.name}</h3>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ositos-v2__final">
          <div>
            <p className="ositos-v2__eyebrow">Listo para regalar</p>
            <h2>Personalízalo hoy y coordina tu pedido por WhatsApp.</h2>
            <p>
              Te ayudamos a elegir talla, color y cantidad antes de confirmar tu
              compra.
            </p>
            <a
              className="ositos-v2__cta"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              Quiero el mío
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
