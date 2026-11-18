# 🍌 Keripik Pisang Salee — Website E-Commerce & Dashboard Manajemen UMKM
Aplikasi web fullstack modern berkonsep **Modern Tropical Food Branding** untuk pengelolaan bisnis UMKM **Keripik Pisang Salee**. Memiliki dua antarmuka utama yang saling terintegrasi secara *real-time*:
1. **Website E-Commerce Pelanggan** (Storefront interaktif, katalog, filter, detail produk, keranjang belanja, checkout, dan konfirmasi WhatsApp).
2. **Dashboard Manajemen Admin (ERP UMKM)** (Overview statistik, grafik penjualan harian/bulanan, produk terlaris, CRUD produk, CRUD kategori, manajemen persediaan stok otomatis, manajemen pesanan 6 status, CRM pelanggan, dan laporan penjualan dengan export CSV).
---
## 🎨 1. Identitas Visual (Modern Tropical Food Branding)
| Elemen Warna | Kode Hex | Peran Visual |
| :--- | :--- | :--- |
| **Kuning Pisang** | `#F5C84C` | Aksen utama, badge populer, highlight interaktif |
| **Cokelat** | `#633D25` | Warna teks utama, tombol primer, sidebar admin |
| **Cream** | `#FFF5DF` | Background hangat dan kartu sekunder |
| **Hijau Daun** | `#557447` | Indikator harga, stok aman, pertumbuhan bisnis |
| **Putih** | `#FFFFFF` | Permukaan kartu produk, tabel, dan modal bersih |
- **Tipografi**: `Poppins` (Display/Heading) & `Plus Jakarta Sans` (Body/UI)
- **Ikon**: `Lucide Icons`
---
## 🗄️ 2. Arsitektur Database (8 Tabel Relasional & Supabase RLS)
Skema lengkap PostgreSQL dan kebijakan *Row Level Security (RLS)* tersedia pada file [`supabase/schema.sql`](./supabase/schema.sql):
1. **`users`**: Menyimpan data pengguna dan role akses (`admin`, `staff`, `customer`).
2. **`categories`**: Menyimpan 4 kategori utama (`Keripik Pisang Original`, `Keripik Pisang Manis`, `Keripik Pisang Cokelat`, `Keripik Pisang Aneka Rasa`).
3. **`products`**: Menyimpan katalog produk, SKU, harga jual, HPP, stok tersedia, batas stok minimum, berat kemasan, foto, dan status populer.
4. **`customers`**: Menyimpan profil pelanggan, nomor WhatsApp, alamat pengiriman, total pesanan, dan total nilai transaksi.
5. **`orders`**: Menyimpan transaksi pesanan dengan 6 status (`Menunggu Pembayaran`, `Diproses`, `Dikemas`, `Dikirim`, `Selesai`, `Dibatalkan`).
6. **`order_items`**: Menyimpan rincian item produk yang dibeli pada setiap nomor pesanan.
7. **`payments`**: Menyimpan informasi metode pembayaran (`Transfer Bank`, `COD`, `WhatsApp`) dan status verifikasi.
8. **`stock_movements`**: Mencatat seluruh riwayat keluar-masuk persediaan (`in`, `out`, `adjustment`) secara otomatis maupun manual.
---
## 📂 3. Struktur Folder Proyek
```text
├── index.html                      # Entry point aplikasi web (siap dijalankan langsung)
├── .env.example                    # Contoh konfigurasi environment Supabase
├── package.json                    # Konfigurasi dependensi React, TypeScript, Tailwind, Supabase, Recharts
├── tsconfig.json                   # Konfigurasi TypeScript
├── vite.config.ts                  # Konfigurasi bundler Vite
├── supabase/
│   └── schema.sql                  # DDL PostgreSQL 8 tabel + Index + Row Level Security (RLS)
└── src/
    ├── types/
    │   └── database.ts             # Definisi tipe TypeScript untuk 8 tabel database
    ├── lib/
    │   └── supabase.ts             # Inisialisasi klien Supabase & deteksi mode demo
    ├── data/
    │   └── seedData.ts             # Data awal realistis UMKM Keripik Pisang Salee
    ├── context/
    │   └── StoreContext.tsx        # State management & logika bisnis (Cart, Checkout, Stok, RBAC)
    ├── components/
    │   ├── StorefrontView.tsx      # Komponen halaman E-Commerce Pelanggan
    │   └── AdminDashboardView.tsx  # Komponen halaman Dashboard Admin
    ├── runtime/
    │   ├── database.js             # Engine penyimpanan relasional (LocalStorage + Supabase)
    │   └── app.js                  # Controller interaktif Storefront, Grafik, & Admin ERP
    ├── App.tsx                     # Root komponen React
    └── main.tsx                    # Bootstrap React DOM
```
---
## 🚀 4. Cara Menjalankan Aplikasi
### Opsi A: Mode Instan Tanpa Build (Langsung di Browser)
Aplikasi telah dilengkapi *Zero-Build Interactive Runtime* di dalam `index.html` + `src/runtime/` sehingga dapat dijalankan langsung tanpa instalasi tambahan:
1. Buka file `index.html` langsung di browser modern (Chrome, Edge, Firefox), **atau**
2. Jalankan local web server di direktori proyek.
### Opsi B: Menggunakan Node.js + Vite + Supabase
1. Salin file `.env.example` menjadi `.env` lalu isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` (opsional, jika dikosongkan otomatis berjalan dalam **Mode Demo LocalStorage**).
2. Jalankan perintah berikut di terminal:
   ```bash
   npm install
   npm run dev
   ```
3. Buka `http://localhost:5173` di browser.
---
## 🧪 5. Panduan Pengujian Fitur Utama
1. **Belanja & Checkout Pelanggan**:
   - Filter produk berdasarkan kategori atau ketik kata kunci di kolom pencarian.
   - Klik **Detail** untuk melihat informasi produk dan rekomendasi produk lainnya.
   - Klik **+ Keranjang**, buka drawer **Keranjang**, atur kuantitas, lalu klik **Lanjut ke Checkout**.
   - Isi formulir pengiriman, pilih metode pembayaran (**Transfer Bank**, **COD**, atau **WhatsApp**), lalu klik **Buat Pesanan Sekarang** untuk mendapatkan **Nomor Pesanan (`INV-SALEE-...`)**.
2. **Dashboard Admin & Otomatisasi Stok**:
   - Klik tombol **Panel Dashboard Admin** di bagian atas halaman.
   - Jelajahi 9 menu sidebar: **Dashboard**, **Manajemen Produk**, **Kategori Produk**, **Manajemen Stok**, **Pesanan**, **Pelanggan**, **Laporan Penjualan**, **Pengaturan**, dan **Logout**.
   - Pada menu **Pesanan**, ubah status pesanan dari `Menunggu Pembayaran` menjadi `Diproses` — stok produk akan **otomatis berkurang** dan tercatat di menu **Manajemen Stok** (`stock_movements`).
   - Pada menu **Laporan Penjualan**, pilih rentang tanggal dan klik **Export Laporan ke CSV** untuk mengunduh laporan transaksi.
