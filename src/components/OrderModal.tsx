import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Product, OrderFormData } from '../types/product';
import { buildWhatsAppUrl } from '../lib/whatsapp';

const orderSchema = z.object({
  nombre: z.string().min(3, 'Ingresa tu nombre completo'),
  celular: z.string().min(9, 'Ingresa un celular válido').max(15),
  departamento: z.string().min(2, 'Selecciona tu departamento'),
  provincia: z.string().min(2, 'Ingresa tu provincia'),
  distrito: z.string().min(2, 'Ingresa tu distrito'),
  direccion: z.string().min(5, 'Ingresa tu dirección completa'),
  referencia: z.string().min(3, 'Ingresa una referencia'),
  color: z.string().min(1, 'Selecciona un color'),
  talla: z.string().min(1, 'Selecciona una talla'),
  cantidad: z.coerce.number().min(1, 'Mínimo 1 unidad').max(99),
});

type OrderFormInput = z.input<typeof orderSchema>;

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormInput, unknown, OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      cantidad: 1,
      color: product.colors[0] || '',
      talla: '',
    },
  });

  const onSubmit = (data: OrderFormData) => {
    const url = buildWhatsAppUrl(product.whatsapp, product.name, data);
    window.open(url, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm bg-white focus:outline-none ${
      hasError
        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
        : 'border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
    }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-800 to-rose-900 text-white p-6 rounded-t-3xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white text-lg cursor-pointer"
          >
            ✕
          </button>
          <h2 className="text-xl font-extrabold">📦 Realizar Pedido</h2>
          <p className="text-rose-200 text-sm mt-1">{product.name}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Nombre completo</label>
            <input {...register('nombre')} placeholder="Ej: María García" className={inputClass(!!errors.nombre)} />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Celular */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Celular</label>
            <input {...register('celular')} placeholder="Ej: 999999999" className={inputClass(!!errors.celular)} />
            {errors.celular && <p className="text-red-500 text-xs mt-1">{errors.celular.message}</p>}
          </div>

          {/* Departamento / Provincia / Distrito */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Departamento</label>
              <input {...register('departamento')} placeholder="Lima" className={inputClass(!!errors.departamento)} />
              {errors.departamento && <p className="text-red-500 text-xs mt-1">{errors.departamento.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Provincia</label>
              <input {...register('provincia')} placeholder="Lima" className={inputClass(!!errors.provincia)} />
              {errors.provincia && <p className="text-red-500 text-xs mt-1">{errors.provincia.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Distrito</label>
              <input {...register('distrito')} placeholder="Miraflores" className={inputClass(!!errors.distrito)} />
              {errors.distrito && <p className="text-red-500 text-xs mt-1">{errors.distrito.message}</p>}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Dirección exacta</label>
            <input {...register('direccion')} placeholder="Av. Example 123, Dpto 4B" className={inputClass(!!errors.direccion)} />
            {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Referencia</label>
            <input {...register('referencia')} placeholder="Frente al parque..." className={inputClass(!!errors.referencia)} />
            {errors.referencia && <p className="text-red-500 text-xs mt-1">{errors.referencia.message}</p>}
          </div>

          {/* Color / Talla / Cantidad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Color</label>
              <select {...register('color')} className={inputClass(!!errors.color)}>
                <option value="">Seleccionar</option>
                {product.colors.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.color && <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Talla</label>
              <select {...register('talla')} className={inputClass(!!errors.talla)}>
                <option value="">Seleccionar</option>
                {product.sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.talla && <p className="text-red-500 text-xs mt-1">{errors.talla.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Cantidad</label>
              <input type="number" min="1" max="99" {...register('cantidad')} className={inputClass(!!errors.cantidad)} />
              {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 mt-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            ENVIAR PEDIDO POR WHATSAPP
          </button>
        </form>
      </div>
    </div>
  );
}
