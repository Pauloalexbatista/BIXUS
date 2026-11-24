export type Language = 'pt' | 'en' | 'es' | 'fr';
export type ThemeMode = 'light' | 'dark';

export type ProductCategory = 'comida' | 'roupa' | '3d';
export type AnimalTarget = 'cao' | 'gato' | 'ambos';

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  animal: AnimalTarget;
  price: number;
  promo_price?: number | null;
  unit_label: string;
  variants: string[];
  description: string;
  ingredients?: string;
  image: string;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
}

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
}

export type OrderStatus =
  | 'pendente'
  | 'confirmada'
  | 'em_preparacao'
  | 'enviada'
  | 'concluida'
  | 'cancelada';

export type DeliveryMethod = 'envio' | 'feira' | 'mao';

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  delivery_method: DeliveryMethod;
  notes: string;
  promo_code: string;
  discount_amount: number;
  total_amount: number;
  items: OrderItem[];
  status: OrderStatus;
  created_at: string;
}

export interface BixusEvent {
  id: number;
  title: string;
  location: string;
  event_date: string;
  end_date?: string | null;
  description: string;
  link?: string;
  active: boolean;
  created_at: string;
}

export interface Promotion {
  id: number;
  code: string;
  description: string;
  discount_percent: number;
  discount_fixed: number;
  active: boolean;
  expires_at?: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
}
