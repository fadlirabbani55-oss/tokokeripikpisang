function renderAdminCustomersTab() {
return `
<div class="space-y-6"><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10"><h3 class="font-display font-extrabold text-lg text-[#633D25]">Database Pelanggan UMKM (CRM)</h3><p class="text-xs text-[#633D25]/65">Daftar pelanggan yang pernah berbelanja beserta total transaksi dan riwayat pembeliannya</p></div><div class="bg-white rounded-3xl border border-[#633D25]/10 shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-[#FFF5DF] border-b border-[#633D25]/10 text-[11px] font-extrabold uppercase text-[#633D25]"><th class="py-3.5 px-4">Nama Pelanggan</th><th class="py-3.5 px-4">Nomor WhatsApp</th><th class="py-3.5 px-4">Alamat Pengiriman</th><th class="py-3.5 px-4">Total Transaksi</th><th class="py-3.5 px-4">Total Belanja</th><th class="py-3.5 px-4 text-right">Riwayat Pembelian</th></tr></thead><tbody class="divide-y divide-[#633D25]/10 text-xs sm:text-sm">
${state.db.customers
.map(
(c) => `
<tr class="hover:bg-[#FFF5DF]/40"><td class="py-3.5 px-4 font-extrabold text-[#633D25]">${escapeHtml(c.name)}</td><td class="py-3.5 px-4 font-mono text-xs text-[#557447] font-bold">${escapeHtml(c.whatsapp)}</td><td class="py-3.5 px-4 text-xs text-[#633D25]/75 max-w-xs truncate">${escapeHtml(c.address)}</td><td class="py-3.5 px-4 font-extrabold text-[#633D25]">${c.total_orders} Pesanan</td><td class="py-3.5 px-4 font-extrabold text-[#557447]">${formatRp(c.total_spent)}</td><td class="py-3.5 px-4 text-right"><button
type="button"
onclick="window.SaleeApp.openCustomerHistory('${c.id}')"
class="px-3.5 py-1.5 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] font-extrabold text-xs cursor-pointer"
>
Lihat Riwayat
</button></td></tr>
`
)
.join('')}
</tbody></table></div></div></div>
`;
}
function renderAdminReportsTab() {
const start = state.reportStartDate ? new Date(state.reportStartDate + 'T00:00:00Z') : new Date('2020-01-01');
const end = state.reportEndDate ? new Date(state.reportEndDate + 'T23:59:59Z') : new Date('2030-12-31');
const ordersInRange = state.db.orders.filter((o) => {
const d = new Date(o.created_at);
return d >= start && d <= end && o.status !== 'Dibatalkan';
});
const totalRevenue = ordersInRange.reduce((acc, o) => acc + o.total_amount, 0);
const orderIds = new Set(ordersInRange.map((o) => o.id));
let totalProductsSold = 0;
const productSalesMap = {};
state.db.order_items.forEach((oi) => {
if (orderIds.has(oi.order_id)) {
totalProductsSold += oi.quantity;
if (!productSalesMap[oi.product_id]) {
productSalesMap[oi.product_id] = {
name: oi.product_name,
qty: 0,
revenue: 0,
};
}
productSalesMap[oi.product_id].qty += oi.quantity;
productSalesMap[oi.product_id].revenue += oi.subtotal;
}
});
const productPerformance = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty);
const topProduct = productPerformance[0] || { name: 'Salee Madu Karamel Panggang', qty: 0 };
return `
<div class="space-y-6"><!-- Filter Tanggal & Tombol Export CSV --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 flex flex-col lg:flex-row lg:items-end justify-between gap-4"><div class="space-y-3"><div><h3 class="font-display font-extrabold text-lg text-[#633D25]">Laporan Penjualan & Rekap Keuangan</h3><p class="text-xs text-[#633D25]/65">Filter laporan berdasarkan tanggal dan unduh laporan ke format CSV (Excel)</p></div><div class="flex flex-wrap items-center gap-3"><div><label class="block text-[11px] font-bold text-[#633D25]/70 mb-1">Dari Tanggal</label><input
type="date"
value="${state.reportStartDate}"
onchange="window.SaleeApp.setReportDates(this.value, null)"
class="px-3.5 py-2 rounded-xl bg-[#FFF5DF] border border-[#633D25]/15 text-xs font-bold text-[#633D25]"
/></div><div><label class="block text-[11px] font-bold text-[#633D25]/70 mb-1">Sampai Tanggal</label><input
type="date"
value="${state.reportEndDate}"
onchange="window.SaleeApp.setReportDates(null, this.value)"
class="px-3.5 py-2 rounded-xl bg-[#FFF5DF] border border-[#633D25]/15 text-xs font-bold text-[#633D25]"
/></div></div></div><button
type="button"
onclick="window.SaleeApp.exportCSV()"
class="px-6 py-3.5 rounded-2xl bg-[#557447] hover:bg-[#445e38] text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
><i data-lucide="download" class="w-4 h-4 text-[#F5C84C]"></i><span>Export Laporan ke CSV</span></button></div><!-- 4 Kartu Metrik Laporan --><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#633D25]/60">Total Pendapatan</span><div class="text-2xl font-extrabold text-[#557447] mt-1">${formatRp(totalRevenue)}</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#633D25]/60">Jumlah Produk Terjual</span><div class="text-2xl font-extrabold text-[#633D25] mt-1">${totalProductsSold} Pouch</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#633D25]/60">Jumlah Transaksi</span><div class="text-2xl font-extrabold text-[#633D25] mt-1">${ordersInRange.length} Pesanan</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#633D25]/60">Produk Paling Laris</span><div class="text-sm font-extrabold text-[#633D25] mt-1 truncate">${escapeHtml(topProduct.name)}</div><span class="text-xs font-bold text-[#557447]">${topProduct.qty} pouch terjual</span></div></div><!-- Grafik Penjualan & Tabel Performa Produk --><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-7">
${renderInteractiveSalesChart()}
</div><div class="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#633D25]/10"><h4 class="font-display font-extrabold text-base text-[#633D25] mb-4">Rincian Penjualan per Varian</h4><div class="space-y-3">
${productPerformance
.map(
(item, i) => `
<div class="p-3 rounded-2xl bg-[#FFF5DF]/60 flex items-center justify-between"><div><div class="text-xs font-extrabold text-[#633D25]">${i + 1}. ${escapeHtml(item.name)}</div><div class="text-[11px] text-[#633D25]/70">${item.qty} pouch terjual</div></div><div class="text-xs font-extrabold text-[#557447]">${formatRp(item.revenue)}</div></div>
`
)
.join('')}
</div></div></div></div>
`;
}
function renderAdminSettingsTab() {
const s = state.db.settings;
const savedSbUrl = localStorage.getItem('SALEE_SUPABASE_URL') || window.SaleeDB.DEFAULT_SUPABASE_URL || '';
const savedSbKey = localStorage.getItem('SALEE_SUPABASE_ANON_KEY') || window.SaleeDB.DEFAULT_SUPABASE_KEY || '';
return `
<div class="space-y-6"><form onsubmit="window.SaleeApp.saveSettings(event)" class="bg-white rounded-3xl p-6 sm:p-8 border border-[#633D25]/10 space-y-6"><div class="flex flex-wrap items-center justify-between gap-4 border-b border-[#633D25]/10 pb-4"><div><h3 class="font-display font-extrabold text-lg text-[#633D25]">Pengaturan Operasional & Database Supabase</h3><p class="text-xs text-[#633D25]/65">Kelola identitas toko, rekening pembayaran, ongkos kirim, dan kredensial Supabase</p></div><button
type="button"
onclick="window.SaleeApp.openSqlModal(true)"
class="px-4 py-2.5 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer"
><i data-lucide="database" class="w-4 h-4"></i><span>Lihat Skema SQL PostgreSQL (8 Tabel)</span></button></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Brand UMKM</label><input type="text" name="store_name" value="${escapeHtml(s.store_name)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Tagline</label><input type="text" name="tagline" value="${escapeHtml(s.tagline)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nomor WhatsApp Admin (Format 628...)</label><input type="text" name="whatsapp" value="${escapeHtml(s.whatsapp)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Email Resmi</label><input type="email" name="email" value="${escapeHtml(s.email)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div class="sm:col-span-2"><label class="block text-xs font-extrabold text-[#633D25] mb-1">Alamat Rumah Produksi</label><input type="text" name="address" value="${escapeHtml(s.address)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Bank</label><input type="text" name="bank_name" value="${escapeHtml(s.bank_name)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nomor Rekening</label><input type="text" name="bank_account" value="${escapeHtml(s.bank_account)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Atas Nama Rekening</label><input type="text" name="bank_holder" value="${escapeHtml(s.bank_holder)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Ongkos Kirim Standar (Rp)</label><input type="number" name="default_shipping" value="${s.default_shipping}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Batas Gratis Ongkir (Rp)</label><input type="number" name="free_shipping_threshold" value="${s.free_shipping_threshold}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Batas Minimum Stok Default</label><input type="number" name="default_min_stock" value="${s.default_min_stock}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Instagram</label><input type="text" name="instagram" value="${escapeHtml(s.instagram)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">TikTok</label><input type="text" name="tiktok" value="${escapeHtml(s.tiktok)}" class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div></div><label class="flex items-center gap-2.5 text-sm font-bold text-[#633D25]"><input type="checkbox" name="cod_enabled" ${s.cod_enabled ? 'checked' : ''} class="w-4 h-4 accent-[#633D25]" /><span>Aktifkan Opsi Pembayaran COD (Bayar di Tempat)</span></label><!-- Koneksi Supabase --><div class="p-5 rounded-2xl bg-[#FFF5DF] border border-[#633D25]/15 space-y-3"><div class="flex flex-wrap items-center justify-between gap-2"><div class="text-xs font-extrabold uppercase text-[#633D25]">Integrasi Supabase PostgreSQL & Auth (NEXT_PUBLIC_SUPABASE_URL)</div><div class="flex items-center gap-2"><span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#557447] text-white">
${savedSbUrl ? 'Terhubung: vltzvbcwhbdamixrlfwe.supabase.co' : 'Mode Demo Interaktif (LocalStorage Aktif)'}
</span><button
type="button"
onclick="window.SaleeApp.testSupabaseConnection()"
class="px-3 py-1 rounded-xl bg-[#633D25] hover:bg-[#4e2f1c] text-[#F5C84C] text-[11px] font-extrabold cursor-pointer"
>
Tes Koneksi Cloud
</button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label class="block text-[11px] font-bold text-[#633D25] mb-1">SUPABASE_URL</label><input type="text" name="supabase_url" value="${escapeHtml(savedSbUrl)}" placeholder="https://xxxx.supabase.co" class="w-full px-3.5 py-2 rounded-xl bg-white border border-[#633D25]/15 text-xs font-mono" /></div><div><label class="block text-[11px] font-bold text-[#633D25] mb-1">SUPABASE_PUBLISHABLE_KEY</label><input type="text" name="supabase_anon_key" value="${escapeHtml(savedSbKey)}" placeholder="sb_publishable_..." class="w-full px-3.5 py-2 rounded-xl bg-white border border-[#633D25]/15 text-xs font-mono" /></div><div class="sm:col-span-2"><label class="block text-[11px] font-bold text-[#633D25] mb-1">SUPABASE_JWKS_URL (@supabase/server Verification)</label><input type="text" readonly value="${escapeHtml(window.SaleeDB.DEFAULT_SUPABASE_JWKS_URL || 'https://vltzvbcwhbdamixrlfwe.supabase.co/auth/v1/.well-known/jwks.json')}" class="w-full px-3.5 py-2 rounded-xl bg-white/70 border border-[#633D25]/15 text-xs font-mono text-[#633D25]/80" /></div></div></div><div class="flex flex-wrap items-center justify-between gap-4 pt-2"><button
type="button"
onclick="window.SaleeApp.resetDemoData()"
class="px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs sm:text-sm cursor-pointer"
>
Reset Data Demo ke Awal
</button><button
type="submit"
class="px-8 py-3.5 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-xs sm:text-sm shadow-lg cursor-pointer"
>
Simpan Perubahan Pengaturan
</button></div></form></div>
`;
}
function renderAdminModals() {
let html = '';
if (state.productModalOpen) {
const p = state.editingProduct || {
name: '',
sku: `SALEE-${Date.now().toString().slice(-4)}`,
category_id: state.db.categories[0]?.id || 'cat-original',
price: 22000,
cost_price: 13000,
stock: 30,
min_stock: 12,
weight_grams: 200,
image_url: PRESET_PRODUCT_PHOTOS[0].url,
description: '',
is_popular: false,
};
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"><div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#633D25]/15 my-8"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><h3 class="font-display font-extrabold text-lg">${state.editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}</h3><button type="button" onclick="window.SaleeApp.closeProductModal()" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><form onsubmit="window.SaleeApp.saveProduct(event)" class="p-6 space-y-4 max-h-[82vh] overflow-y-auto"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Produk *</label><input type="text" name="name" required value="${escapeHtml(p.name)}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Kode SKU</label><input type="text" name="sku" value="${escapeHtml(p.sku)}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-mono" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Kategori Produk *</label><select name="category_id" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-bold">
${state.db.categories
.map(
(c) =>
`<option value="${c.id}" ${p.category_id === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
)
.join('')}
</select></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Berat Kemasan (gram)</label><input type="number" name="weight_grams" value="${p.weight_grams}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Harga Jual (Rp) *</label><input type="number" name="price" required value="${p.price}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-extrabold" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Harga Modal / HPP (Rp)</label><input type="number" name="cost_price" value="${p.cost_price}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Jumlah Stok (Pouch) *</label><input type="number" name="stock" required value="${p.stock}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-extrabold" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Batas Stok Minimum</label><input type="number" name="min_stock" value="${p.min_stock}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div></div><!-- Unggah Foto Produk --><div class="space-y-2"><label class="block text-xs font-extrabold text-[#633D25]">Foto Produk (Unggah File atau URL)</label><div class="flex items-center gap-3"><img id="productImagePreview" src="${escapeHtml(p.image_url)}" class="w-16 h-16 rounded-2xl object-cover border border-[#633D25]/20 shrink-0" /><div class="flex-1 space-y-2"><input
id="productImageUrlInput"
type="text"
name="image_url"
value="${escapeHtml(p.image_url)}"
placeholder="https://..."
class="w-full px-3.5 py-2 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-xs"
/><input
type="file"
accept="image/*"
onchange="window.SaleeApp.handleImageUpload(this)"
class="text-xs text-[#633D25]"
/></div></div></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Deskripsi Produk *</label><textarea name="description" rows="3" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm">${escapeHtml(p.description)}</textarea></div><label class="flex items-center gap-2 text-xs font-extrabold text-[#633D25]"><input type="checkbox" name="is_popular" ${p.is_popular ? 'checked' : ''} class="w-4 h-4 accent-[#633D25]" /><span>Tandai sebagai Produk Populer (Best Seller Badge)</span></label><div class="flex justify-end gap-3 pt-3 border-t border-[#633D25]/10"><button type="button" onclick="window.SaleeApp.closeProductModal()" class="px-5 py-2.5 rounded-xl bg-gray-100 text-[#633D25] font-bold text-xs cursor-pointer">Batal</button><button type="submit" class="px-6 py-2.5 rounded-xl bg-[#633D25] text-white font-extrabold text-xs cursor-pointer">Simpan Produk</button></div></form></div></div>
`;
}
if (state.categoryModalOpen) {
const c = state.editingCategory || {
name: '',
description: '',
badge_color: '#F5C84C',
};
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><h3 class="font-display font-extrabold text-lg">${state.editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3><button type="button" onclick="window.SaleeApp.closeCategoryModal()" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><form onsubmit="window.SaleeApp.saveCategory(event)" class="p-6 space-y-4"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Kategori *</label><input type="text" name="name" required value="${escapeHtml(c.name)}" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Warna Identitas Badge</label><input type="color" name="badge_color" value="${escapeHtml(c.badge_color)}" class="w-full h-10 rounded-xl cursor-pointer" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Deskripsi Kategori</label><textarea name="description" rows="3" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm">${escapeHtml(c.description)}</textarea></div><div class="flex justify-end gap-3 pt-2"><button type="button" onclick="window.SaleeApp.closeCategoryModal()" class="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold">Batal</button><button type="submit" class="px-6 py-2 rounded-xl bg-[#633D25] text-white text-xs font-extrabold">Simpan Kategori</button></div></form></div></div>
`;
}
if (state.stockModalOpen) {
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><h3 class="font-display font-extrabold text-lg">Catat Mutasi Persediaan Stok</h3><button type="button" onclick="window.SaleeApp.closeStockModal()" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><form onsubmit="window.SaleeApp.saveStockMovement(event)" class="p-6 space-y-4"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Pilih Produk *</label><select name="product_id" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-bold">
${state.db.products
.map(
(p) =>
`<option value="${p.id}" ${state.stockFormPresetProductId === p.id ? 'selected' : ''}>${escapeHtml(p.name)} (Stok: ${p.stock})</option>`
)
.join('')}
</select></div><div class="grid grid-cols-2 gap-3"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Jenis Mutasi *</label><select name="type" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-bold"><option value="in">Stok Masuk (+ Restock)</option><option value="out">Stok Keluar (- Kurangi)</option></select></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Jumlah (Pouch) *</label><input type="number" name="quantity" min="1" value="20" required class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm font-extrabold" /></div></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nomor Referensi Batch</label><input type="text" name="reference" placeholder="Contoh: BATCH-PROD-261118" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Catatan Gudang</label><input type="text" name="notes" placeholder="Contoh: Produksi sore dapur utama" class="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm" /></div><div class="flex justify-end gap-3 pt-2"><button type="button" onclick="window.SaleeApp.closeStockModal()" class="px-4 py-2 rounded-xl bg-gray-100 text-xs font-bold">Batal</button><button type="submit" class="px-6 py-2.5 rounded-xl bg-[#633D25] text-white text-xs font-extrabold cursor-pointer">Simpan Mutasi Stok</button></div></form></div></div>
`;
}
if (state.selectedOrderDetailId) {
const order = state.db.orders.find((o) => o.id === state.selectedOrderDetailId);
if (order) {
const items = state.db.order_items.filter((oi) => oi.order_id === order.id);
const payment = state.db.payments.find((p) => p.order_id === order.id);
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"><div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><div><span class="text-[11px] text-[#F5C84C] font-mono font-bold">${escapeHtml(order.order_number)}</span><h3 class="font-display font-extrabold text-lg">Detail Pesanan Pelanggan</h3></div><button type="button" onclick="window.SaleeApp.closeOrderDetail()" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs sm:text-sm"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FFF5DF]"><div><div class="text-[#633D25]/60 font-bold text-xs">Penerima:</div><div class="font-extrabold text-[#633D25] text-base">${escapeHtml(order.customer_name)}</div><div class="font-semibold text-[#557447]">WA: ${escapeHtml(order.customer_whatsapp)}</div><div class="text-xs text-[#633D25]/80 mt-1">${escapeHtml(order.shipping_address)}</div></div><div class="space-y-1.5"><div class="flex justify-between"><span class="text-[#633D25]/60">Status Pesanan:</span>
${renderOrderStatusBadge(order.status)}
</div><div class="flex justify-between"><span class="text-[#633D25]/60">Metode Bayar:</span><span class="font-extrabold">${escapeHtml(order.payment_method)} (${payment ? payment.status : 'Pending'})</span></div><div class="flex justify-between"><span class="text-[#633D25]/60">Stok Terpotong:</span><span class="font-bold">${order.stock_deducted ? 'Sudah Dipotong Otomatis' : 'Menunggu Konfirmasi'}</span></div><div class="text-xs text-[#633D25]/70 pt-1">Catatan: "${escapeHtml(order.notes || '-')}"</div></div></div><div><h4 class="font-extrabold text-xs uppercase text-[#633D25]/60 mb-2">Daftar Item Dibeli</h4><div class="divide-y divide-[#633D25]/10 border border-[#633D25]/10 rounded-2xl overflow-hidden">
${items
.map(
(oi) => `
<div class="p-3 flex items-center justify-between bg-white"><div class="flex items-center gap-3"><img src="${escapeHtml(oi.product_image)}" class="w-11 h-11 rounded-xl object-cover" /><div><div class="font-extrabold text-[#633D25]">${escapeHtml(oi.product_name)}</div><div class="text-xs text-[#633D25]/65">${oi.quantity} pouch x ${formatRp(oi.unit_price)}</div></div></div><div class="font-extrabold text-[#557447]">${formatRp(oi.subtotal)}</div></div>
`
)
.join('')}
</div></div><div class="p-4 rounded-2xl bg-[#FFF5DF]/60 space-y-1.5"><div class="flex justify-between"><span>Subtotal Produk</span><span class="font-bold">${formatRp(order.subtotal)}</span></div><div class="flex justify-between"><span>Ongkos Kirim</span><span class="font-bold">${formatRp(order.shipping_cost)}</span></div><div class="flex justify-between text-base font-extrabold text-[#633D25] pt-2 border-t border-[#633D25]/10"><span>Total Pembayaran</span><span class="text-[#557447]">${formatRp(order.total_amount)}</span></div></div><div class="flex flex-wrap items-center justify-between gap-2 pt-2"><div class="flex flex-wrap gap-2"><button type="button" onclick="window.SaleeApp.updateOrderStatus('${order.id}', 'Diproses')" class="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer">Proses Pesanan</button><button type="button" onclick="window.SaleeApp.updateOrderStatus('${order.id}', 'Dikemas')" class="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs cursor-pointer">Kemas</button><button type="button" onclick="window.SaleeApp.updateOrderStatus('${order.id}', 'Dikirim')" class="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer">Kirim</button><button type="button" onclick="window.SaleeApp.updateOrderStatus('${order.id}', 'Selesai')" class="px-3.5 py-2 rounded-xl bg-[#557447] text-white font-bold text-xs cursor-pointer">Tandai Selesai</button><button type="button" onclick="window.SaleeApp.updateOrderStatus('${order.id}', 'Dibatalkan')" class="px-3.5 py-2 rounded-xl bg-red-600 text-white font-bold text-xs cursor-pointer">Batalkan</button></div><button type="button" onclick="window.SaleeApp.closeOrderDetail()" class="px-4 py-2 rounded-xl bg-gray-200 text-[#633D25] font-bold text-xs cursor-pointer">Tutup</button></div></div></div></div>
`;
}
}
if (state.selectedCustomerHistoryId) {
const cust = state.db.customers.find((c) => c.id === state.selectedCustomerHistoryId);
if (cust) {
const custOrders = state.db.orders.filter(
(o) =>
o.customer_id === cust.id ||
o.customer_whatsapp.replace(/\D/g, '') === cust.whatsapp.replace(/\D/g, '')
);
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><div><h3 class="font-display font-extrabold text-lg">Riwayat Pembelian: ${escapeHtml(cust.name)}</h3><p class="text-xs text-[#F5C84C]">WhatsApp: ${escapeHtml(cust.whatsapp)}</p></div><button type="button" onclick="window.SaleeApp.closeCustomerHistory()" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-6 space-y-3 max-h-[75vh] overflow-y-auto">
${
custOrders.length === 0
? `<p class="text-sm text-[#633D25]/70">Belum ada riwayat pesanan.</p>`
: custOrders
.map(
(o) => `
<div class="p-4 rounded-2xl bg-[#FFF5DF]/70 border border-[#633D25]/15 flex items-center justify-between"><div><div class="font-mono font-extrabold text-xs text-[#633D25]">${escapeHtml(o.order_number)}</div><div class="text-xs text-[#633D25]/70">${formatDateID(o.created_at)} â€¢ ${escapeHtml(o.payment_method)}</div><div class="mt-1">${renderOrderStatusBadge(o.status)}</div></div><div class="text-right"><div class="font-extrabold text-base text-[#557447]">${formatRp(o.total_amount)}</div><button
type="button"
onclick="window.SaleeApp.closeCustomerHistory(); window.SaleeApp.openOrderDetail('${o.id}')"
class="text-xs font-bold text-[#633D25] underline mt-1 cursor-pointer"
>Lihat Invoice</button></div></div>
`
)
.join('')
}
</div></div></div>
`;
}
}
if (state.sqlModalOpen) {
html += `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm"><div class="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><h3 class="font-display font-extrabold text-base sm:text-lg">Arsitektur Database PostgreSQL / Supabase (8 Tabel + RLS)</h3><button type="button" onclick="window.SaleeApp.openSqlModal(false)" class="p-1.5 rounded-xl bg-white/10 text-white cursor-pointer"><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-6 space-y-3 max-h-[78vh] overflow-y-auto text-xs"><p class="text-[#633D25]/80 font-medium">File lengkap tersedia di <code>supabase/schema.sql</code>. Mencakup 8 tabel utama: <strong>users, categories, products, customers, orders, order_items, payments, stock_movements</strong> beserta kebijakan Row Level Security (RLS).</p><pre class="p-4 rounded-2xl bg-[#2d140c] text-[#FFF5DF] font-mono text-[11px] overflow-x-auto leading-relaxed">
-- 1. users (id, email, full_name, phone, role, created_at)
-- 2. categories (id, name, slug, description, icon, badge_color)
-- 3. products (id, category_id REFERENCES categories, sku, name, price, stock, min_stock, image_url, is_popular)
-- 4. customers (id, user_id REFERENCES users, name, whatsapp, address, total_orders, total_spent)
-- 5. orders (id, order_number, customer_id REFERENCES customers, subtotal, shipping_cost, total_amount, payment_method, status)
-- 6. order_items (id, order_id REFERENCES orders, product_id REFERENCES products, unit_price, quantity, subtotal)
-- 7. payments (id, order_id REFERENCES orders, payment_method, bank_name, amount, status, paid_at)
-- 8. stock_movements (id, product_id REFERENCES products, order_id REFERENCES orders, type, quantity, previous_stock, current_stock)
</pre></div></div></div>
`;
}
return html;
}
