import type { Product } from "../types/product";

const ositosProductPath = "/products/polera-personalizada-ositos";

export const products: Product[] = [
  {
    slug: "polera-personalizada-ositos",
    brand: 'WAWAS R US',
    name: 'Polera Personalizada WAWAS R US',
    price: 89,
    oldPrice: 129,
    whatsapp: "51994991371",
    cover: `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0000_1.jpg`,
    description:
      "Poleras personalizadas WAWAS R US con el nombre de tus hijos. Perfectas para compartir en familia. Algodón premium, no destiñe, fácil de lavar.",
    flyers: [
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0000_1.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0001_2.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0002_3.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0003_4.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0004_5.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0005_6.jpg`,
      `${ositosProductPath}/POLERA%20OSITOS%20LANDING_0006_7.jpg`,
    ],
    colors: ["Verde/Azul/Guinda"],
    sizes: [
      "Baby 0-3M",
      "Baby 3-6M",
      "Baby 6-12M",
      "Baby 12-18M",
      "Baby 18-24M",
      "Kids T4",
      "Kids T6",
      "Kids T8",
      "Kids T10",
      "Kids T12",
      "Kids T14",
      "Kids T16",
      "Mujer S",
      "Mujer M",
      "Mujer L",
      "Mujer XL",
      "Hombre S",
      "Hombre M",
      "Hombre L",
      "Hombre XL",
    ],
  },
];
