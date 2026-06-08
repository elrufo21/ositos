import { useEffect, useState } from "react";

const purchases = [
  { nombre: "María López", ciudad: "Lima" },
  { nombre: "Juan Gomez", ciudad: "Trujillo" },
  { nombre: "Ana Torres", ciudad: "Arequipa" },
  { nombre: "Carlos Ruiz", ciudad: "Cusco" },
  { nombre: "Lucía Mendoza", ciudad: "Piura" },
  { nombre: "Pedro Castillo", ciudad: "Chiclayo" },
  { nombre: "Rosa Flores", ciudad: "Huancayo" },
  { nombre: "Diego Vargas", ciudad: "Iquitos" },
  { nombre: "Sofía Ríos", ciudad: "Tacna" },
  { nombre: "Miguel Paredes", ciudad: "Puno" },
  { nombre: "Valeria Huanca", ciudad: "Cajamarca" },
  { nombre: "Luis Mamani", ciudad: "Juliaca" },
  { nombre: "Carmen Salazar", ciudad: "Chimbote" },
  { nombre: "Andrés Vega", ciudad: "Ica" },
  { nombre: "Patricia Núñez", ciudad: "Sullana" },
  { nombre: "Roberto Quispe", ciudad: "Ayacucho" },
  { nombre: "Claudia Ramos", ciudad: "Huaraz" },
  { nombre: "Fernando Aguirre", ciudad: "Tumbes" },
  { nombre: "Elena Chávez", ciudad: "Pucallpa" },
  { nombre: "Oscar Morales", ciudad: "Moquegua" },
];

const productos = [
  "Polerón para Mujer",
  "Pack Familiar (3 polerones)",
  "Polerón para Bebé",
  "Pack Pareja (2 polerones)",
  "Polerón para Niños",
];

const tiempos = [
  "hace 1 minuto",
  "hace 2 minutos",
  "hace 3 minutos",
  "hace 5 minutos",
  "hace 7 minutos",
  "hace 10 minutos",
];

const avatarColors = [
  "bg-rose-100 text-rose-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-violet-100 text-violet-600",
  "bg-orange-100 text-orange-600",
];

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface ToastData {
  id: number;
  nombre: string;
  ciudad: string;
  producto: string;
  tiempo: string;
  colorClass: string;
  initials: string;
}

function buildToast(id: number): ToastData {
  const person = getRandom(purchases);
  const initials = person.nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return {
    id,
    nombre: person.nombre,
    ciudad: person.ciudad,
    producto: getRandom(productos),
    tiempo: getRandom(tiempos),
    colorClass: getRandom(avatarColors),
    initials,
  };
}

export default function RecentPurchaseToast() {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [visible, setVisible] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // First toast after 4s, then every 12-18s
    const showToast = () => {
      const newToast = buildToast(Date.now());
      setToast(newToast);
      setVisible(true);

      // Auto-hide after 6s to feel more realistic
      setTimeout(() => {
        setVisible(false);
      }, 6000);
    };

    const initialTimer = setTimeout(() => {
      showToast();
      setCounter((c) => c + 1);
    }, 4000);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    if (counter === 0) return;

    const delay = Math.floor(Math.random() * 6000) + 12000; // 12–18s
    const timer = setTimeout(() => {
      const newToast = buildToast(Date.now());
      setToast(newToast);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
      setCounter((c) => c + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [counter]);

  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-5 left-4 z-[999] max-w-[300px] transition-all duration-500 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${toast.colorClass}`}
        >
          {toast.initials}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-800 leading-snug">
            <span className="font-black">
              {toast.nombre} de {toast.ciudad}
            </span>{" "}
            acaba de comprar:
          </p>
          <p className="text-xs font-semibold text-rose-600 truncate">
            {toast.producto}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{toast.tiempo}</p>
        </div>

        {/* Close */}
        <button
          onClick={() => setVisible(false)}
          className="text-gray-300 hover:text-gray-500 text-base leading-none flex-shrink-0 self-start"
        >
          ×
        </button>
      </div>
    </div>
  );
}
