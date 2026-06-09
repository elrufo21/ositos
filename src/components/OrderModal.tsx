import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "../types/product";

const ENVIO_PERU = 10;
const UNIT_PRICE = 89;
const INITIAL_STOCK = 23;
const MIN_STOCK = 3;
const STOCK_DECREMENT_INTERVAL_MS = 45_000;
const STOCK_SESSION_KEY = "ositos-order-stock-session";

const offers = [
  {
    id: 1,
    title: "1 POLERÓN",
    quantity: 1,
    unitPrice: UNIT_PRICE,
    finalPrice: 89,
    badge: "🚨 ÚLTIMAS UNIDADES",
    badgeColor: "#ef4444",
    subtitle: "Ideal para ti",
    saving: null,
  },
  {
    id: 2,
    title: "2 POLERONES",
    quantity: 2,
    unitPrice: UNIT_PRICE,
    finalPrice: 165,
    badge: "⭐ MÁS VENDIDO",
    badgeColor: "#f59e0b",
    subtitle: "Pack Papá e hijo",
    saving: "Ahorras S/. 13",
  },
  {
    id: 3,
    title: "3 POLERONES",
    quantity: 3,
    unitPrice: UNIT_PRICE,
    finalPrice: 239,
    badge: "💰 PARA MAMÁ TAMBIÉN",
    badgeColor: "#10b981",
    subtitle: "Ahorra más",
    saving: "Ahorras S/. 28",
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

import { reniec as ubigeoData } from "ubigeo-peru";

type UbigeoEntry = {
  departamento: string;
  provincia: string;
  distrito: string;
  nombre: string;
};
const allUbigeo = Object.values(ubigeoData) as UbigeoEntry[];

const departamentos = allUbigeo.filter(
  (d) => d.provincia === "00" && d.distrito === "00",
);

const getProvincias = (depId: string) =>
  allUbigeo.filter(
    (d) =>
      d.departamento === depId && d.provincia !== "00" && d.distrito === "00",
  );

const getDistritos = (depId: string, provId: string) =>
  allUbigeo.filter(
    (d) =>
      d.departamento === depId && d.provincia === provId && d.distrito !== "00",
  );

type SizeType = keyof typeof sizeTables;

interface OrderItem {
  tipo: SizeType;
  color: string;
  talla: string;
}

const shippingMethods = [
  {
    id: "casa",
    icon: "📦",
    label: "PAGO EN LIMA CONTRAENTREGA",
    description: "(previo adelanto)",
    extra: null,
    price: "Gratis",
  },
  {
    id: "shalom",
    icon: "🚛",
    label: "ENVÍO POR SHALOM",
    description: "",
    extra: null,
    price: "Gratis",
  },
  {
    id: "agencias",
    icon: "🚚",
    label: "ENVÍO POR OLVA",
    description: "",
    extra: null,
    price: "Gratis",
  },
];

const orderSchema = z.object({
  nombre: z.string().min(3, "Ingresa tu nombre completo"),
  celular: z.string().min(9, "Ingresa un celular válido").max(15),
  departamentoId: z.string().min(1, "Selecciona tu departamento"),
  provinciaId: z.string().min(1, "Selecciona tu provincia"),
  distritoId: z.string().min(1, "Selecciona tu distrito"),
  direccion: z.string().optional(),
  referencia: z.string().optional(),
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
  const INITIAL_SECONDS = 15 * 60;
  const [selectedOffer, setSelectedOffer] = useState(offers[1]);
  const [selectedShipping, setSelectedShipping] = useState("casa");
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [viewers, setViewers] = useState(19);
  const [stock, setStock] = useState(INITIAL_STOCK);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const DISCOUNT_AMOUNT = 5;
  const popupDismissed = useRef(false);
  const stockLastUpdatedAtRef = useRef<number | null>(null);
  const stockRef = useRef(INITIAL_STOCK);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      popupDismissed.current = false;
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? INITIAL_SECONDS : prev - 1));
    }, 1000);
    const viewersInterval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 18) + 7);
    }, 5000);

    const restoreStock = () => {
      if (typeof window === "undefined") return;

      const saved = sessionStorage.getItem(STOCK_SESSION_KEY);
      const now = Date.now();

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as {
            stock: number;
            updatedAt: number;
          };
          stockRef.current = Math.max(MIN_STOCK, parsed.stock);
          stockLastUpdatedAtRef.current = parsed.updatedAt;
        } catch {
          stockRef.current = INITIAL_STOCK;
          stockLastUpdatedAtRef.current = now;
        }
      } else {
        stockRef.current = INITIAL_STOCK;
        stockLastUpdatedAtRef.current = now;
        sessionStorage.setItem(
          STOCK_SESSION_KEY,
          JSON.stringify({
            stock: INITIAL_STOCK,
            updatedAt: now,
          }),
        );
      }

      setStock(stockRef.current);
    };

    const stockInterval = setInterval(() => {
      if (typeof window === "undefined") return;

      const now = Date.now();
      const lastUpdatedAt = stockLastUpdatedAtRef.current ?? now;
      const elapsedMs = now - lastUpdatedAt;
      const decrements = Math.floor(elapsedMs / STOCK_DECREMENT_INTERVAL_MS);

      if (decrements > 0) {
        const nextStock = Math.max(MIN_STOCK, stockRef.current - decrements);
        stockRef.current = nextStock;
        stockLastUpdatedAtRef.current =
          lastUpdatedAt + decrements * STOCK_DECREMENT_INTERVAL_MS;
        setStock(nextStock);
        sessionStorage.setItem(
          STOCK_SESSION_KEY,
          JSON.stringify({
            stock: nextStock,
            updatedAt: stockLastUpdatedAtRef.current,
          }),
        );
      }
    }, 1000);

    restoreStock();

    return () => {
      clearInterval(countdown);
      clearInterval(viewersInterval);
      clearInterval(stockInterval);
    };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const stockPercent = Math.round((stock / INITIAL_STOCK) * 100);

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
      departamentoId: "",
      provinciaId: "",
      distritoId: "",
      direccion: "",
      referencia: "",
    },
  });

  const selectedDepId = useWatch({ control, name: "departamentoId" });
  const selectedProvId = useWatch({ control, name: "provinciaId" });

  const provincias = selectedDepId ? getProvincias(selectedDepId) : [];
  const distritos =
    selectedDepId && selectedProvId
      ? getDistritos(selectedDepId, selectedProvId)
      : [];

  const subtotal = selectedOffer.unitPrice * selectedOffer.quantity;
  const descuento = subtotal - selectedOffer.finalPrice;
  const discountExtra = discountApplied ? DISCOUNT_AMOUNT : 0;
  const total = selectedOffer.finalPrice + ENVIO_PERU - discountExtra;

  const handleCloseAttempt = () => {
    if (!popupDismissed.current && !discountApplied) {
      setShowExitPopup(true);
    } else {
      onClose();
    }
  };

  const handleApplyDiscount = () => {
    setDiscountApplied(true);
    setShowExitPopup(false);
    popupDismissed.current = true;
  };

  const handleDeclineDiscount = () => {
    popupDismissed.current = true;
    setShowExitPopup(false);
    onClose();
  };

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
        return { ...item, [field]: value };
      }),
    );
  };

  const onSubmit = async (data: OrderFormInput) => {
    const depNombre =
      departamentos.find((d) => d.departamento === data.departamentoId)
        ?.nombre ?? data.departamentoId;
    const provNombre =
      getProvincias(data.departamentoId).find(
        (p) => p.provincia === data.provinciaId,
      )?.nombre ?? data.provinciaId;
    const distNombre =
      getDistritos(data.departamentoId, data.provinciaId).find(
        (d) => d.distrito === data.distritoId,
      )?.nombre ?? data.distritoId;

    const payload = {
      nombre: data.nombre,
      celular: data.celular,
      departamento: depNombre,
      provincia: provNombre,
      distrito: distNombre,
      direccion: data.direccion,
      referencia: data.referencia,
      cantidad: selectedOffer.quantity,
      color: items.map((item) => item.color).join(", "),
      talla: items.map((item) => item.talla).join(", "),
      producto: product.name,
    };

    try {
      const response = await fetch(
        "https://wawasusr-production.up.railway.app/api/enviar-formulario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      onClose();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  if (!isOpen) return null;

  const inputBase =
    "w-full h-11 rounded-lg border px-3 text-sm outline-none transition-all bg-white";
  const inputNormal = `${inputBase} border-gray-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100`;
  const inputError = `${inputBase} border-red-400 focus:ring-2 focus:ring-red-100`;
  const inp = (hasError?: boolean) => (hasError ? inputError : inputNormal);

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div
        className="relative w-full max-w-[580px] max-h-[97vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl"
        style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
      >
        <style>{`
          @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.8)} }
          @keyframes shake {
            0%,100%{transform:translateX(0) rotate(0deg)}
            10%{transform:translateX(-6px) rotate(-1deg)}
            20%{transform:translateX(6px) rotate(1deg)}
            30%{transform:translateX(-5px) rotate(-0.5deg)}
            40%{transform:translateX(5px) rotate(0.5deg)}
            50%{transform:translateX(-4px)}
            60%{transform:translateX(4px)}
            70%{transform:translateX(-3px)}
            80%{transform:translateX(3px)}
            90%{transform:translateX(-1px)}
          }
          @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
          @keyframes popIn { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
          @keyframes sealSpin { from{transform:rotate(-5deg) scale(.9)} to{transform:rotate(5deg) scale(1.05)} }
          .shake-btn { animation: shake 1s ease-in-out infinite; }
          .fade-up { animation: fadeUp .4s ease-out; }
          .dot-pulse { animation: pulse-dot 1.2s ease-in-out infinite; }
          .pop-in { animation: popIn .3s cubic-bezier(.34,1.56,.64,1); }
          .seal { animation: sealSpin 1.2s ease-in-out infinite alternate; }
        `}</style>

        {/* ── Header strip ── */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 dot-pulse inline-block" />
            {viewers} personas viendo ahora
          </div>
          <button
            onClick={handleCloseAttempt}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 text-lg font-light transition-colors"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-5 pt-4 pb-6 space-y-5"
        >
          {/* ── Guarantee + Trust ── */}
          <div className="fade-up text-center space-y-2">
            <p className="text-lg font-black text-gray-800">
              Garantía de 90 días por tu pedido
            </p>
            <div className="flex items-center justify-center gap-1 text-amber-500 text-sm font-bold">
              {"⭐".repeat(5)}
              <span className="text-gray-600 font-normal ml-1">
                (4.8/5) en +1800 testimonios
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-bold px-4 py-2 rounded-full border border-blue-100">
              👥 Más de 758 familias ya compraron
            </div>
          </div>

          {/* ── Urgency bar ── */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-red-700">
                🔥 Solo quedan {stock} unidades
              </span>
              <span className="font-black text-red-600 bg-red-100 px-2 py-0.5 rounded-lg text-xs">
                ⏰ {timerText}
              </span>
            </div>
            <div className="h-2.5 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${stockPercent}%`,
                  background: "linear-gradient(90deg, #f87171, #ef4444)",
                }}
              />
            </div>
            <p className="text-xs text-red-500 font-medium">
              🚚 Envío a todo el Perú — ¡Pide ahora antes que se agote!
            </p>
          </div>

          {/* ── Offer cards ── */}
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-700 uppercase tracking-wide">
              Elige tu paquete
            </p>
            {offers.map((offer) => {
              const active = selectedOffer.id === offer.id;
              const offerSubtotal = offer.unitPrice * offer.quantity;
              return (
                <div
                  key={offer.id}
                  onClick={() => selectOffer(offer)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200 ${
                    active
                      ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-100"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {offer.badge && (
                    <span
                      className="absolute -top-3 right-3 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-sm"
                      style={{ background: offer.badgeColor }}
                    >
                      {offer.badge}
                    </span>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          active ? "border-violet-600" : "border-gray-300"
                        }`}
                      >
                        {active && (
                          <div className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-gray-800 text-sm sm:text-base">
                          {offer.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {offer.subtitle}
                        </p>
                        {offer.saving && (
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                            ✅ {offer.saving}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-black text-gray-900">
                        S/. {offer.finalPrice.toFixed(2)}
                      </p>
                      {offerSubtotal !== offer.finalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          S/. {offerSubtotal.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  {active && (
                    <div className="mt-4 space-y-2 fade-up">
                      <div
                        className="grid gap-2 text-xs font-bold text-gray-500 uppercase tracking-wide"
                        style={{ gridTemplateColumns: "30px 1fr 1fr 1fr" }}
                      >
                        <span />
                        <span>Tipo</span>
                        <span>Color</span>
                        <span>Talla</span>
                      </div>
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="grid gap-2 items-center"
                          style={{ gridTemplateColumns: "30px 1fr 1fr 1fr" }}
                        >
                          <span className="text-xs font-black text-violet-600">
                            #{index + 1}
                          </span>
                          <select
                            value={item.tipo}
                            onChange={(e) =>
                              updateItem(index, "tipo", e.target.value)
                            }
                            className={inp()}
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
                            className={inp()}
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
                            className={inp()}
                          >
                            {sizeTables[item.tipo].map((size) => (
                              <option key={size.talla} value={size.talla}>
                                {size.talla} · A:{size.a} B:{size.b}
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

          {/* ── Shipping methods ── */}
          <div className="space-y-2">
            <p className="text-sm font-black text-gray-700 uppercase tracking-wide">
              Método de Envío
            </p>
            {shippingMethods.map((method) => {
              const active = selectedShipping === method.id;
              return (
                <div
                  key={method.id}
                  onClick={() => setSelectedShipping(method.id)}
                  className={`cursor-pointer rounded-xl border p-3 flex items-start gap-3 transition-all ${
                    active
                      ? "border-violet-400 bg-violet-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      active ? "border-violet-600" : "border-gray-300"
                    }`}
                  >
                    {active && (
                      <div className="w-2 h-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">
                      {method.icon} {method.label}:
                    </p>
                    <p className="text-xs text-gray-500 leading-snug">
                      {method.description}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 flex-shrink-0">
                    {method.price}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Order summary ── */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">S/. {subtotal.toFixed(2)}</span>
            </div>
            {descuento > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>🏷 Descuento</span>
                <span className="font-bold">−S/. {descuento.toFixed(2)}</span>
              </div>
            )}
            {discountApplied && (
              <div className="flex justify-between text-orange-600">
                <span>🎟 Cupón especial</span>
                <span className="font-bold">
                  −S/. {DISCOUNT_AMOUNT.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>🎁 Empaque de regalo</span>
              <span className="font-bold text-emerald-600">GRATIS</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>🚚 Envío a todo el Perú</span>
              <span className="font-semibold">S/. {ENVIO_PERU.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-black text-gray-900">
              <span>Total a pagar</span>
              <span className="text-violet-700">S/. {total.toFixed(2)}</span>
            </div>
          </div>

          {/* ── Delivery note ── */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <p className="text-sm font-bold text-blue-700">
              📅 Recibe tu pedido entre el 18 y el 19 de Junio
            </p>
          </div>

          {/* ── Customer info section ── */}
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-700 uppercase tracking-wide text-center">
              Completa tu información
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Nombre y Apellidos *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                    👤
                  </span>
                  <input
                    {...register("nombre")}
                    placeholder="Nombres y Apellidos"
                    className={`${inp(!!errors.nombre)} pl-9`}
                  />
                </div>
                {errors.nombre && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Celular o WhatsApp *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
                    📱
                  </span>
                  <input
                    {...register("celular")}
                    placeholder="Celular o WhatsApp"
                    className={`${inp(!!errors.celular)} pl-9`}
                  />
                </div>
                {errors.celular && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.celular.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Departamento *
                  </label>
                  <select
                    {...register("departamentoId")}
                    onChange={(e) => {
                      setValue("departamentoId", e.target.value, {
                        shouldValidate: true,
                      });
                      setValue("provinciaId", "", { shouldValidate: false });
                      setValue("distritoId", "", { shouldValidate: false });
                    }}
                    className={inp(!!errors.departamentoId)}
                  >
                    <option value="">Selecciona 🔽</option>
                    {departamentos.map((dep) => (
                      <option key={dep.departamento} value={dep.departamento}>
                        {dep.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.departamentoId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.departamentoId.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">
                    Provincia *
                  </label>
                  <select
                    {...register("provinciaId")}
                    disabled={!selectedDepId}
                    onChange={(e) => {
                      setValue("provinciaId", e.target.value, {
                        shouldValidate: true,
                      });
                      setValue("distritoId", "", { shouldValidate: false });
                    }}
                    className={inp(!!errors.provinciaId)}
                  >
                    <option value="">Selecciona 🔽</option>
                    {provincias.map((prov) => (
                      <option key={prov.provincia} value={prov.provincia}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.provinciaId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.provinciaId.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Distrito *
                </label>
                <select
                  {...register("distritoId")}
                  disabled={!selectedProvId}
                  className={inp(!!errors.distritoId)}
                >
                  <option value="">Selecciona 🔽</option>
                  {distritos.map((dist) => (
                    <option key={dist.distrito} value={dist.distrito}>
                      {dist.nombre}
                    </option>
                  ))}
                </select>
                {errors.distritoId && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.distritoId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Dirección exacta *
                </label>
                <input
                  {...register("direccion")}
                  placeholder="Ej: Av Luis Montero 211 Castilla"
                  className={inp(!!errors.direccion)}
                />
                {errors.direccion && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">
                  Referencia *
                </label>
                <input
                  {...register("referencia")}
                  placeholder="Ej: Al frente del hospital"
                  className={inp(!!errors.referencia)}
                />
                {errors.referencia && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.referencia.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── CTA ── */}
          <div className="sticky bottom-0 -mx-5 px-5 pb-5 pt-2 bg-white/90 backdrop-blur-sm space-y-2">
            <button
              type="submit"
              className="shake-btn w-full rounded-2xl py-4 text-base font-black text-white transition-transform active:scale-95 flex flex-col items-center gap-0.5"
              style={{
                background:
                  "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
                boxShadow:
                  "0 6px 24px rgba(185,28,28,0.55), 0 2px 8px rgba(0,0,0,0.2)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <span className="text-lg">🛒 QUIERO REALIZAR MI PEDIDO</span>
              <span className="text-sm font-semibold opacity-90">
                🚚 Envío a todo el Perú — Total: S/. {total.toFixed(2)}
                {discountApplied && " ✅ Descuento aplicado"}
              </span>
            </button>
          </div>
        </form>

        {/* ── Exit intent popup ── */}
        {showExitPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="pop-in bg-white rounded-2xl mx-4 p-6 text-center shadow-2xl max-w-sm w-full">
              <p className="text-2xl font-black text-gray-900 mb-1">¡Espera!</p>
              <p className="text-sm text-gray-500 mb-3">
                ¡Felicidades! ¡Acabas de desbloquear un descuento especial!
              </p>
              <p className="text-base font-black text-orange-500 mb-3">
                🎁 ¡Obtén un descuento! 🎁
              </p>

              {/* Starburst seal */}
              <div className="flex justify-center mb-4">
                <div
                  className="seal w-28 h-28 flex items-center justify-center relative"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #ef4444)",
                    clipPath:
                      "polygon(50% 0%,61% 15%,79% 9%,80% 28%,97% 32%,88% 48%,97% 64%,80% 68%,79% 87%,61% 81%,50% 95%,39% 81%,21% 87%,20% 68%,3% 64%,12% 48%,3% 32%,20% 28%,21% 9%,39% 15%)",
                    boxShadow: "none",
                  }}
                >
                  <div className="text-center text-white">
                    <p className="text-xl font-black leading-tight">S/. 5.00</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 font-medium">
                Si cierras esta página te perderás la oferta
              </p>

              <button
                onClick={handleApplyDiscount}
                className="w-full rounded-xl py-3.5 text-sm font-black text-white mb-3 transition-transform active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #b91c1c 0%, #dc2626 50%, #ef4444 100%)",
                  boxShadow: "0 4px 16px rgba(185,28,28,0.5)",
                }}
              >
                Completar pedido con S/. 5.00 de DESCUENTO
              </button>

              <button
                onClick={handleDeclineDiscount}
                className="w-full rounded-xl py-3 text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                No, gracias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
