// ============================================================================
// DEFINISI TIPE DATABASE (8 TABEL UTAMA)
// Keripik Pisang Salee — Fullstack E-Commerce & ERP UMKM
// ============================================================================

export type UserRole = 'admin' | 'staff' | 'customer';

export type OrderStatus =
  | 'Menunggu Pembayaran'
  | 'Diproses'
  | 'Dikemas'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan';

export type PaymentMethod = 'Transfer Bank' | 'COD' | 'WhatsApp';

export type PaymentStatus = 'Pending' | 'Verified' | 'Failed' | 'Refunded';

export type StockMovementType = 'in' | 'out' | 'adjustment';

// 1. Tabel: users
export interface UserRecord {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

// 2. Tabel: categories
export interface CategoryRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  badge_color: string;
  created_at: string;
}

// 3. Tabel: products
export interface ProductRecord {
  id: string;
  category_id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  cost_price: number;
  stock: number;
  min_stock: number;
  weight_grams: number;
  image_url: string;
  is_popular: boolean;
  is_active: boolean;
  rating: number;
  sold_count: number;
  created_at: string;
}

// 4. Tabel: customers
export interface CustomerRecord {
  id: string;
  user_id?: string | null;
  name: string;
  whatsapp: string;
  email?: string;
  address: string;
  city?: string;
  total_orders: number;
  total_spent: number;
  last_order_at: string;
  created_at: string;
}

// 5. Tabel: orders
export interface OrderRecord {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_whatsapp: string;
  shipping_address: string;
  notes?: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  payment_method: PaymentMethod;
  status: OrderStatus;
  stock_deducted: boolean;
  created_at: string;
  updated_at: string;
}

// 6. Tabel: order_items
export interface OrderItemRecord {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

// 7. Tabel: payments
export interface PaymentRecord {
  id: string;
  order_id: string;
  payment_method: PaymentMethod;
  bank_name?: string;
  account_sender?: string;
  amount: number;
  status: PaymentStatus;
  proof_url?: string;
  paid_at?: string | null;
  verified_by?: string | null;
  created_at: string;
}

// 8. Tabel: stock_movements
export interface StockMovementRecord {
  id: string;
  product_id: string;
  order_id?: string | null;
  type: StockMovementType;
  quantity: number;
  previous_stock: number;
  current_stock: number;
  reference: string;
  notes: string;
  created_by: string;
  created_at: string;
}

export interface CartItem {
  product_id: string;
  quantity: number;
}

export interface StoreSettings {
  store_name: string;
  tagline: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  bank_name: string;
  bank_account: string;
  bank_holder: string;
  default_shipping: number;
  free_shipping_threshold: number;
  default_min_stock: number;
  cod_enabled: boolean;
}

export interface DatabaseState {
  users: UserRecord[];
  categories: CategoryRecord[];
  products: ProductRecord[];
  customers: CustomerRecord[];
  orders: OrderRecord[];
  order_items: OrderItemRecord[];
  payments: PaymentRecord[];
  stock_movements: StockMovementRecord[];
  settings: StoreSettings;
}
