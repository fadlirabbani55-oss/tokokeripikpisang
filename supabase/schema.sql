-- ============================================================================
-- DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- E-COMMERCE & ERP DASHBOARD UMKM: KERIPIK PISANG SALEE
-- PostgreSQL / Supabase
-- ============================================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- 1. TABEL USERS (Integrasi dengan Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 2. TABEL CATEGORIES (Kategori Produk)
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT 'Tag',
  badge_color TEXT DEFAULT '#F5C84C',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 3. TABEL PRODUCTS (Katalog Produk)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  cost_price NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock INTEGER NOT NULL DEFAULT 10 CHECK (min_stock >= 0),
  weight_grams INTEGER NOT NULL DEFAULT 200,
  image_url TEXT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.9,
  sold_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 4. TABEL CUSTOMERS (Data Pelanggan)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(14, 2) NOT NULL DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 5. TABEL ORDERS (Pesanan Pelanggan)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_whatsapp TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  notes TEXT,
  subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
  shipping_cost NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC(14, 2) NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('Transfer Bank', 'COD', 'WhatsApp')),
  status TEXT NOT NULL DEFAULT 'Menunggu Pembayaran' CHECK (
    status IN (
      'Menunggu Pembayaran',
      'Diproses',
      'Dikemas',
      'Dikirim',
      'Selesai',
      'Dibatalkan'
    )
  ),
  stock_deducted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 6. TABEL ORDER_ITEMS (Detail Item Pesanan)
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  product_image TEXT,
  unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(14, 2) NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 7. TABEL PAYMENTS (Konfirmasi & Riwayat Pembayaran)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL,
  bank_name TEXT,
  account_sender TEXT,
  amount NUMERIC(14, 2) NOT NULL CHECK (amount >= 0),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Failed', 'Refunded')),
  proof_url TEXT,
  paid_at TIMESTAMPTZ,
  verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- 8. TABEL STOCK_MOVEMENTS (Riwayat Keluar-Masuk Persediaan)
CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  previous_stock INTEGER NOT NULL,
  current_stock INTEGER NOT NULL,
  reference TEXT NOT NULL,
  notes TEXT,
  created_by TEXT DEFAULT 'Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- ============================================================================
-- INDEXES UNTUK PERFORMA QUERY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_popular ON public.products(is_popular);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON public.stock_movements(created_at DESC);
-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & ROLE-BASED ACCESS CONTROL (RBAC)
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
-- Helper function untuk mengecek apakah user saat ini adalah Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'staff')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Policies untuk categories & products (Publik bisa baca, hanya Admin yang bisa tulis)
CREATE POLICY "Categories dapat dilihat publik" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin kelola categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Produk aktif dapat dilihat publik" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin kelola products" ON public.products FOR ALL USING (public.is_admin());
-- Policies untuk customers, orders, order_items, payments (Publik bisa membuat saat checkout, Admin kelola penuh)
CREATE POLICY "Pelanggan dapat membuat profil saat checkout" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Pelanggan dan Admin lihat customer" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Admin update customer" ON public.customers FOR UPDATE USING (public.is_admin());
CREATE POLICY "Pelanggan dapat membuat pesanan" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Pelanggan dan Admin lihat pesanan" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin kelola pesanan" ON public.orders FOR UPDATE USING (public.is_admin());
CREATE POLICY "Pelanggan dapat membuat item pesanan" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Lihat item pesanan" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Pelanggan buat pembayaran" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Lihat pembayaran" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Admin verifikasi pembayaran" ON public.payments FOR UPDATE USING (public.is_admin());
-- Policies untuk stock_movements (Hanya Admin & sistem checkout)
CREATE POLICY "Lihat riwayat stok" ON public.stock_movements FOR SELECT USING (true);
CREATE POLICY "Catat perubahan stok" ON public.stock_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin kelola stok" ON public.stock_movements FOR ALL USING (public.is_admin());
