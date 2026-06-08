import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product, OrderFormData } from "../types/product";
import { buildWhatsAppUrl } from "../lib/whatsapp";

const ENVIO_PERU = 10;
const UNIT_PRICE = 89;

const offers = [
  {
    id: 1,
    title: "1 POLERÓN",
    quantity: 1,
    unitPrice: UNIT_PRICE,
    finalPrice: 89,
    badge: "",
    subtitle: "Ideal para ti",
  },
  {
    id: 2,
    title: "2 POLERONES",
    quantity: 2,
    unitPrice: UNIT_PRICE,
    finalPrice: 165,
    badge: "MÁS PEDIDO",
    subtitle: "Mejor para compartir",
  },
  {
    id: 3,
    title: "3 POLERONES",
    quantity: 3,
    unitPrice: UNIT_PRICE,
    finalPrice: 239,
    badge: "PARA MAMÁ TAMBIÉN",
    subtitle: "La mejor opción",
  },
];

const colors = ["Verde", "Gris", "Pastel"];

const sizeTables = {
  Baby: [
    { talla: "0-3M", a: 30, b: 31 },
    { talla: "3-6M", a: 32, b: 33 },
    { talla: "6-12M", a: 35, b: 37 },
    { talla: "12-18M", a: 37, b: 39 },
    { talla: "18-24M", a: 39, b: 43 },
  ],
  Kids: [
    { talla: "T4", a: 39, b: 48 },
    { talla: "T6", a: 40, b: 50 },
    { talla: "T8", a: 41, b: 51 },
    { talla: "T10", a: 43, b: 52 },
    { talla: "T12", a: 46, b: 54 },
    { talla: "T14", a: 49, b: 58 },
    { talla: "T16", a: 53, b: 60 },
  ],
  Mujer: [
    { talla: "S", a: 52, b: 64 },
    { talla: "M", a: 55, b: 68 },
    { talla: "L", a: 59, b: 72 },
    { talla: "XL", a: 62, b: 74 },
  ],
  Hombre: [
    { talla: "S", a: 59, b: 71 },
    { talla: "M", a: 61, b: 73 },
    { talla: "L", a: 63, b: 76 },
    { talla: "XL", a: 66, b: 79 },
  ],
};

const peruLocations = [
  {
    departamento: "Lima",
    provincias: ["Lima", "Cañete", "Huaral", "Huaura", "Barranca"],
  },
  {
    departamento: "Junín",
    provincias: ["Huancayo", "Chupaca", "Concepción", "Jauja", "Tarma"],
  },
  {
    departamento: "Arequipa",
    provincias: ["Arequipa", "Camaná", "Islay", "Caylloma"],
  },
  {
    departamento: "Cusco",
    provincias: ["Cusco", "Urubamba", "Calca", "La Convención"],
  },
  {
    departamento: "La Libertad",
    provincias: ["Trujillo", "Ascope", "Chepén", "Pacasmayo"],
  },
  {
    departamento: "Piura",
    provincias: ["Piura", "Sullana", "Talara", "Paita"],
  },
];

type SizeType = keyof typeof sizeTables;

interface OrderItem {
  tipo: SizeType;
  color: string;
  talla: string;
}

const orderSchema = z.object({
  nombre: z.string().min(3, "Ingresa tu nombre completo"),
  celular: z.string().min(9, "Ingresa un celular válido").max(15),
  departamento: z.string().min(2, "Selecciona tu departamento"),
  provincia: z.string().min(2, "Selecciona tu provincia"),
  distrito: z.string().min(2, "Ingresa tu distrito"),
  direccion: z.string().min(5, "Ingresa tu dirección completa"),
  referencia: z.string().min(3, "Ingresa una referencia"),
});

type OrderFormInput = z.input<typeof orderSchema>;

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({
  product,
  isOpen,
  onClose,
}: OrderModalProps) {
  const [selectedOffer, setSelectedOffer] = useState(offers[1]);

  const [items, setItems] = useState<OrderItem[]>(
    Array.from({ length: offers[1].quantity }, () => ({
      tipo: "Mujer",
      color: colors[0],
      talla: sizeTables.Mujer[0].talla,
    })),
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<OrderFormInput>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      nombre: "",
      celular: "",
      departamento: "",
      provincia: "",
      distrito: "",
      direccion: "",
      referencia: "",
    },
  });

  const selectedDepartamento = useWatch({
    control,
    name: "departamento",
  });

  const provincias =
    peruLocations.find((item) => item.departamento === selectedDepartamento)
      ?.provincias || [];

  const subtotal = selectedOffer.unitPrice * selectedOffer.quantity;
  const descuento = subtotal - selectedOffer.finalPrice;
  const total = selectedOffer.finalPrice + ENVIO_PERU;

  const inputClass = (hasError?: boolean) =>
    `w-full h-11 rounded-md border px-3 text-sm outline-none bg-white ${
      hasError
        ? "border-red-400 focus:ring-2 focus:ring-red-200"
        : "border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
    }`;

  const selectOffer = (offer: (typeof offers)[number]) => {
    setSelectedOffer(offer);

    setItems(
      Array.from({ length: offer.quantity }, (_, index) => ({
        tipo: items[index]?.tipo || "Mujer",
        color: items[index]?.color || colors[0],
        talla: items[index]?.talla || sizeTables.Mujer[0].talla,
      })),
    );
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        if (field === "tipo") {
          const newTipo = value as SizeType;

          return {
            ...item,
            tipo: newTipo,
            talla: sizeTables[newTipo][0].talla,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const getSizeInfo = (tipo: SizeType, talla: string) => {
    return sizeTables[tipo].find((item) => item.talla === talla);
  };

  const onSubmit = (data: OrderFormInput) => {
    const detalleProductos = items
      .map((item, index) => {
        const sizeInfo = getSizeInfo(item.tipo, item.talla);

        return `#${index + 1}: ${item.tipo} / Color: ${item.color} / Talla: ${
          item.talla
        } / A:${sizeInfo?.a ?? "-"} B:${sizeInfo?.b ?? "-"}`;
      })
      .join(" | ");

    const messageData = {
      ...data,
      cantidad: selectedOffer.quantity,
      color: items.map((item, i) => `#${i + 1}: ${item.color}`).join(", "),
      talla: detalleProductos,
    } as OrderFormData;

    const url = buildWhatsAppUrl(product.whatsapp, product.name, messageData);
    window.open(url, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3">
      <div className="relative max-h-[95vh] w-full max-w-[560px] overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl font-light"
        >
          ×
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-6">
          <div className="space-y-3">
            {offers.map((offer) => {
              const active = selectedOffer.id === offer.id;
              const offerSubtotal = offer.unitPrice * offer.quantity;

              return (
                <div
                  key={offer.id}
                  onClick={() => selectOffer(offer)}
                  className={`relative cursor-pointer rounded-3xl border p-4 transition-all ${
                    active
                      ? "border-fuchsia-500 bg-fuchsia-50 ring-1 ring-fuchsia-500"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {offer.badge && (
                    <div className="absolute -top-3 right-6 rounded-sm bg-pink-600 px-4 py-1 text-xs font-black text-white">
                      {offer.badge}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          active ? "border-fuchsia-600" : "border-gray-300"
                        }`}
                      >
                        {active && (
                          <span className="h-3 w-3 rounded-full bg-fuchsia-600" />
                        )}
                      </span>

                      <div>
                        <p className="text-sm font-black sm:text-base">
                          {offer.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {offer.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-black">
                        S/. {offer.finalPrice.toFixed(2)}
                      </p>

                      {offerSubtotal !== offer.finalPrice && (
                        <p className="text-sm line-through">
                          S/. {offerSubtotal.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {active && (
                    <div className="mt-4 space-y-2">
                      <div className="grid grid-cols-[35px_1fr_1fr_1fr] gap-2 text-xs font-bold sm:text-sm">
                        <span></span>
                        <span>Tipo</span>
                        <span>Color</span>
                        <span>Talla</span>
                      </div>

                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[35px_1fr_1fr_1fr] items-center gap-2"
                        >
                          <span className="font-black">#{index + 1}</span>

                          <select
                            value={item.tipo}
                            onChange={(e) =>
                              updateItem(index, "tipo", e.target.value)
                            }
                            className={inputClass()}
                          >
                            {Object.keys(sizeTables).map((tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.color}
                            onChange={(e) =>
                              updateItem(index, "color", e.target.value)
                            }
                            className={inputClass()}
                          >
                            {colors.map((color) => (
                              <option key={color} value={color}>
                                {color}
                              </option>
                            ))}
                          </select>

                          <select
                            value={item.talla}
                            onChange={(e) =>
                              updateItem(index, "talla", e.target.value)
                            }
                            className={inputClass()}
                          >
                            {sizeTables[item.tipo].map((size) => (
                              <option key={size.talla} value={size.talla}>
                                {size.talla} - A:{size.a} B:{size.b}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="rounded-md border border-gray-300 p-3 text-sm sm:text-base">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <strong>S/. {subtotal.toFixed(2)}</strong>
            </div>

            <div className="mt-2 flex justify-between">
              <span>🏷 Descuento</span>
              <strong className="text-red-500">
                -S/. {descuento.toFixed(2)}
              </strong>
            </div>

            <div className="mt-2 flex justify-between">
              <span>🎁 Empaque de regalo</span>
              <strong>GRATIS</strong>
            </div>

            <div className="mt-2 flex justify-between">
              <span>🚚 Envío a todo el Perú</span>
              <strong>S/. {ENVIO_PERU.toFixed(2)}</strong>
            </div>

            <div className="my-3 border-t" />

            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span>S/. {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Nombre y Apellidos *</label>
            <input
              {...register("nombre")}
              placeholder="Nombre Completo"
              className={inputClass(!!errors.nombre)}
            />
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Celular o Teléfono *</label>
            <input
              {...register("celular")}
              placeholder="Ej: 933832272"
              className={inputClass(!!errors.celular)}
            />
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Departamento *</label>
            <select
              {...register("departamento")}
              onChange={(e) => {
                setValue("departamento", e.target.value, {
                  shouldValidate: true,
                });
                setValue("provincia", "", {
                  shouldValidate: true,
                });
              }}
              className={inputClass(!!errors.departamento)}
            >
              <option value="">Selecciona aquí 🔽</option>
              {peruLocations.map((item) => (
                <option key={item.departamento} value={item.departamento}>
                  {item.departamento}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Provincia *</label>
            <select
              {...register("provincia")}
              disabled={!selectedDepartamento}
              className={inputClass(!!errors.provincia)}
            >
              <option value="">Selecciona aquí 🔽</option>
              {provincias.map((provincia) => (
                <option key={provincia} value={provincia}>
                  {provincia}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Distrito *</label>
            <input
              {...register("distrito")}
              placeholder="Ej: El Tambo"
              className={inputClass(!!errors.distrito)}
            />
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Dirección exacta *</label>
            <input
              {...register("direccion")}
              placeholder="Ej: Av Luis Montero 211 Castilla"
              className={inputClass(!!errors.direccion)}
            />
          </div>

          <div className="grid grid-cols-[125px_1fr] items-center gap-3">
            <label className="text-sm font-black">Referencia *</label>
            <input
              {...register("referencia")}
              placeholder="Ej: Al frente del hospital"
              className={inputClass(!!errors.referencia)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-600 py-4 text-base font-black text-white hover:bg-pink-700"
          >
            🛒 ¡Clic aquí para pedir! - S/. {total.toFixed(2)}
          </button>
        </form>
      </div>
    </div>
  );
}
