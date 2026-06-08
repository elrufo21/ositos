import type { OrderFormData } from '../types/product';

export function buildWhatsAppUrl(
  phone: string,
  productName: string,
  order: OrderFormData
): string {
  const message = `🧸 *NUEVO PEDIDO - WAWAS R US*\n\n` +
    `📦 *Producto:* ${productName}\n` +
    `🎨 *Color:* ${order.color}\n` +
    `📏 *Talla:* ${order.talla}\n` +
    `🔢 *Cantidad:* ${order.cantidad}\n\n` +
    `👤 *Datos del cliente:*\n` +
    `• Nombre: ${order.nombre}\n` +
    `• Celular: ${order.celular}\n` +
    `• Departamento: ${order.departamento}\n` +
    `• Provincia: ${order.provincia}\n` +
    `• Distrito: ${order.distrito}\n` +
    `• Dirección: ${order.direccion}\n` +
    `• Referencia: ${order.referencia}\n\n` +
    `¡Gracias por tu pedido! 🎉`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
