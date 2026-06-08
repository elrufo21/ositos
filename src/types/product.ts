export interface Product {
  slug: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  whatsapp: string;
  cover: string;
  flyers: string[];
  colors: string[];
  sizes: string[];
  description?: string;
}

export interface OrderFormData {
  nombre: string;
  celular: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string;
  color: string;
  talla: string;
  cantidad: number;
}
