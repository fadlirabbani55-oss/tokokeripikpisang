function renderAdminDashboardOverview() {
const stats = getAdminStats();
const recentOrders = state.db.orders.slice(0, 5);
return `
<div class="space-y-6"><!-- 4 Kartu Statistik Utama --><div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"><div class="bg-white rounded-3xl p-5 border border-[#633D25]/10 shadow-sm flex items-center justify-between"><div><span class="text-xs font-bold text-[#633D25]/60 uppercase">Total Penjualan</span><div class="font-display text-2xl font-extrabold text-[#633D25] mt-1">${formatRp(stats.totalSales)}</div><span class="inline-flex items-center gap-1 text-[11px] font-bold text-[#557447] mt-1"><i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +18.4% bulan ini
</span></div><div class="w-12 h-12 rounded-2xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center"><i data-lucide="wallet" class="w-6 h-6"></i></div></div><div class="bg-white rounded-3xl p-5 border border-[#633D25]/10 shadow-sm flex items-center justify-between"><div><span class="text-xs font-bold text-[#633D25]/60 uppercase">Total Pesanan</span><div class="font-display text-2xl font-extrabold text-[#633D25] mt-1">${stats.totalOrders} Transaksi</div><span class="text-[11px] font-bold text-amber-700 mt-1 block">
${stats.pendingOrdersCount} menunggu konfirmasi
</span></div><div class="w-12 h-12 rounded-2xl bg-[#633D25] text-[#F5C84C] flex items-center justify-center"><i data-lucide="shopping-cart" class="w-6 h-6"></i></div></div><div class="bg-white rounded-3xl p-5 border border-[#633D25]/10 shadow-sm flex items-center justify-between"><div><span class="text-xs font-bold text-[#633D25]/60 uppercase">Total Produk</span><div class="font-display text-2xl font-extrabold text-[#633D25] mt-1">${stats.totalProducts} Varian</div><span class="text-[11px] font-bold text-[#557447] mt-1 block">
${state.db.categories.length} kategori aktif
</span></div><div class="w-12 h-12 rounded-2xl bg-[#557447] text-white flex items-center justify-center"><i data-lucide="package" class="w-6 h-6"></i></div></div><div class="bg-white rounded-3xl p-5 border border-[#633D25]/10 shadow-sm flex items-center justify-between"><div><span class="text-xs font-bold text-[#633D25]/60 uppercase">Total Pelanggan</span><div class="font-display text-2xl font-extrabold text-[#633D25] mt-1">${stats.totalCustomers} Pelanggan</div><span class="text-[11px] font-bold text-[#557447] mt-1 block">
AOV: ${formatRp(stats.avgOrderValue)}
</span></div><div class="w-12 h-12 rounded-2xl bg-[#FFF5DF] text-[#633D25] border border-[#633D25]/15 flex items-center justify-center"><i data-lucide="users" class="w-6 h-6"></i></div></div></div><!-- Grafik Penjualan & Grafik Produk Terlaris --><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><div class="lg:col-span-7">
${renderInteractiveSalesChart()}
</div><div class="lg:col-span-5">
${renderBestSellerChart()}
</div></div><!-- Ringkasan Pendapatan, Daftar Stok Hampir Habis, dan Aktivitas Pesanan Terbaru --><div class="grid grid-cols-1 lg:grid-cols-12 gap-6"><!-- Aktivitas Pesanan Terbaru --><div class="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm"><div class="flex items-center justify-between mb-4"><div><h3 class="font-display font-extrabold text-base sm:text-lg text-[#633D25]">Aktivitas Pesanan Terbaru</h3><p class="text-xs text-[#633D25]/65">Pantau transaksi masuk dan ubah status secara cepat</p></div><button
type="button"
onclick="window.SaleeApp.setAdminTab('orders')"
class="text-xs font-extrabold text-[#557447] hover:underline cursor-pointer"
>Lihat Semua</button></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-[#633D25]/10 text-[11px] uppercase text-[#633D25]/60"><th class="py-2.5 pr-3">No. Invoice</th><th class="py-2.5 px-3">Pelanggan</th><th class="py-2.5 px-3">Total</th><th class="py-2.5 px-3">Status</th><th class="py-2.5 pl-3 text-right">Aksi</th></tr></thead><tbody class="divide-y divide-[#633D25]/10 text-xs">
${recentOrders
.map(
(o) => `
<tr class="hover:bg-[#FFF5DF]/40"><td class="py-3 pr-3 font-mono font-bold text-[#633D25]">${escapeHtml(o.order_number)}</td><td class="py-3 px-3"><div class="font-bold text-[#633D25]">${escapeHtml(o.customer_name)}</div><div class="text-[11px] text-[#633D25]/60">${escapeHtml(o.payment_method)}</div></td><td class="py-3 px-3 font-extrabold text-[#557447]">${formatRp(o.total_amount)}</td><td class="py-3 px-3">${renderOrderStatusBadge(o.status)}</td><td class="py-3 pl-3 text-right"><button
type="button"
onclick="window.SaleeApp.openOrderDetail('${o.id}')"
class="px-2.5 py-1 rounded-lg bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] font-bold text-[11px] cursor-pointer"
>Detail</button></td></tr>
`
)
.join('')}
</tbody></table></div></div><!-- Daftar Stok Hampir Habis & Ringkasan Pendapatan --><div class="lg:col-span-5 space-y-6"><!-- Daftar Stok Hampir Habis --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm"><div class="flex items-center justify-between mb-4"><div class="flex items-center gap-2"><i data-lucide="alert-triangle" class="w-5 h-5 text-amber-600"></i><h3 class="font-display font-extrabold text-base text-[#633D25]">Daftar Stok Hampir Habis</h3></div><span class="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
${stats.lowStockProducts.length} Produk
</span></div>
${
stats.lowStockProducts.length === 0
? `<p class="text-xs text-[#557447] font-bold py-4">Semua stok produk berada di atas batas minimum aman.</p>`
: `
<div class="space-y-3">
${stats.lowStockProducts
.map(
(p) => `
<div class="p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3"><div class="flex items-center gap-3 min-w-0"><img src="${escapeHtml(p.image_url)}" class="w-10 h-10 rounded-xl object-cover shrink-0" /><div class="min-w-0"><div class="text-xs font-extrabold text-[#633D25] truncate">${escapeHtml(p.name)}</div><div class="text-[11px] text-amber-800 font-semibold">Sisa: <strong>${p.stock} pouch</strong> (Min: ${p.min_stock})</div></div></div><button
type="button"
onclick="window.SaleeApp.openQuickRestock('${p.id}')"
class="px-3 py-1.5 rounded-xl bg-[#633D25] hover:bg-[#4e2f1c] text-[#F5C84C] font-extrabold text-xs shrink-0 cursor-pointer"
>+ Restock</button></div>
`
)
.join('')}
</div>
`
}
</div><!-- Ringkasan Pendapatan --><div class="bg-[#633D25] text-white rounded-3xl p-6 shadow-md space-y-4"><div class="flex items-center justify-between"><div><span class="text-[11px] uppercase tracking-wider text-[#F5C84C] font-extrabold">Ringkasan Pendapatan</span><h4 class="font-display text-xl font-extrabold mt-0.5">${formatRp(stats.totalSales)}</h4></div><span class="p-2.5 rounded-2xl bg-white/10 text-[#F5C84C]"><i data-lucide="coins" class="w-6 h-6"></i></span></div><div class="grid grid-cols-2 gap-3 pt-2 border-t border-white/15 text-xs"><div><div class="text-white/70">Pesanan Selesai</div><div class="font-extrabold text-sm text-[#F5C84C] mt-0.5">${formatRp(stats.completedRevenue)}</div></div><div><div class="text-white/70">Total Pouch Terjual</div><div class="font-extrabold text-sm text-white mt-0.5">${stats.totalUnitsSold} Pouch</div></div></div></div></div></div></div>
`;
}
function renderOrderStatusBadge(status) {
const map = {
'Menunggu Pembayaran': 'bg-amber-100 text-amber-800 border-amber-300',
Diproses: 'bg-blue-100 text-blue-800 border-blue-300',
Dikemas: 'bg-purple-100 text-purple-800 border-purple-300',
Dikirim: 'bg-indigo-100 text-indigo-800 border-indigo-300',
Selesai: 'bg-emerald-100 text-emerald-800 border-emerald-300',
Dibatalkan: 'bg-red-100 text-red-800 border-red-300',
};
const cls = map[status] || 'bg-gray-100 text-gray-800';
return `<span class="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${cls}">${escapeHtml(status)}</span>`;
}
function renderAdminProductsTab() {
const filtered = state.db.products.filter((p) => {
const matchCat = state.adminProductCatFilter === 'ALL' || p.category_id === state.adminProductCatFilter;
const q = state.adminProductSearch.trim().toLowerCase();
const matchQ = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
return matchCat && matchQ;
});
return `
<div class="space-y-6"><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div class="flex flex-col sm:flex-row gap-3 flex-1"><div class="relative flex-1 max-w-md"><i data-lucide="search" class="w-4 h-4 text-[#633D25]/50 absolute left-3.5 top-1/2 -translate-y-1/2"></i><input
type="text"
value="${escapeHtml(state.adminProductSearch)}"
oninput="window.SaleeApp.setAdminProductSearch(this.value)"
placeholder="Cari nama produk atau SKU..."
class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm"
/></div><select
onchange="window.SaleeApp.setAdminProductCatFilter(this.value)"
class="px-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm font-bold text-[#633D25]"
><option value="ALL" ${state.adminProductCatFilter === 'ALL' ? 'selected' : ''}>Semua Kategori</option>
${state.db.categories
.map(
(c) =>
`<option value="${c.id}" ${state.adminProductCatFilter === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`
)
.join('')}
</select></div><button
type="button"
onclick="window.SaleeApp.openProductModal()"
class="px-5 py-3 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow cursor-pointer"
><i data-lucide="plus-circle" class="w-4 h-4 text-[#F5C84C]"></i><span>Tambah Produk Baru</span></button></div><div class="bg-white rounded-3xl border border-[#633D25]/10 shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-[#FFF5DF] border-b border-[#633D25]/10 text-[11px] font-extrabold uppercase text-[#633D25]"><th class="py-3.5 px-4">Produk</th><th class="py-3.5 px-4">Kategori</th><th class="py-3.5 px-4">Harga Jual</th><th class="py-3.5 px-4">Stok Tersedia</th><th class="py-3.5 px-4">Label</th><th class="py-3.5 px-4 text-right">Aksi CRUD</th></tr></thead><tbody class="divide-y divide-[#633D25]/10 text-xs sm:text-sm">
${filtered
.map((p) => {
const cat = getCategoryById(p.category_id);
const isLow = p.stock <= p.min_stock;
return `
<tr class="hover:bg-[#FFF5DF]/40"><td class="py-3.5 px-4"><div class="flex items-center gap-3"><img src="${escapeHtml(p.image_url)}" class="w-12 h-12 rounded-xl object-cover border border-[#633D25]/10 shrink-0" /><div><div class="font-extrabold text-[#633D25]">${escapeHtml(p.name)}</div><div class="text-xs text-[#633D25]/60 font-mono">${escapeHtml(p.sku)} â€¢ ${p.weight_grams}g</div></div></div></td><td class="py-3.5 px-4 font-bold text-xs text-[#633D25]">${escapeHtml(cat.name)}</td><td class="py-3.5 px-4"><div class="font-extrabold text-[#557447]">${formatRp(p.price)}</div><div class="text-[11px] text-[#633D25]/55">HPP: ${formatRp(p.cost_price)}</div></td><td class="py-3.5 px-4"><span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
p.stock <= 0
? 'bg-red-100 text-red-700'
: isLow
? 'bg-amber-100 text-amber-800'
: 'bg-emerald-100 text-emerald-800'
}">
${p.stock} pouch ${isLow ? 'âš ï¸' : ''}
</span></td><td class="py-3.5 px-4">
${
p.is_popular
? `<span class="px-2.5 py-1 rounded-full bg-[#F5C84C] text-[#633D25] text-[11px] font-extrabold">Populer</span>`
: `<span class="text-xs text-[#633D25]/50">Standar</span>`
}
</td><td class="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap"><button
type="button"
onclick="window.SaleeApp.openProductModal('${p.id}')"
class="px-3 py-1.5 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
><i data-lucide="pencil" class="w-3.5 h-3.5"></i> Edit
</button><button
type="button"
onclick="window.SaleeApp.deleteProduct('${p.id}')"
class="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
><i data-lucide="trash-2" class="w-3.5 h-3.5"></i> Hapus
</button></td></tr>
`;
})
.join('')}
</tbody></table></div></div></div>
`;
}
function renderAdminCategoriesTab() {
return `
<div class="space-y-6"><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm flex items-center justify-between"><div><h3 class="font-display font-extrabold text-lg text-[#633D25]">Manajemen Kategori Produk</h3><p class="text-xs text-[#633D25]/65">Kelola pengelompokan varian rasa Keripik Pisang Salee</p></div><button
type="button"
onclick="window.SaleeApp.openCategoryModal()"
class="px-5 py-3 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer"
><i data-lucide="plus-circle" class="w-4 h-4 text-[#F5C84C]"></i><span>Tambah Kategori</span></button></div><div class="grid grid-cols-1 md:grid-cols-2 gap-5">
${state.db.categories
.map((cat) => {
const count = state.db.products.filter((p) => p.category_id === cat.id).length;
return `
<div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm flex flex-col justify-between space-y-4"><div class="flex items-start justify-between gap-3"><div class="flex items-center gap-3"><div
class="w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold shadow-sm"
style="background-color: ${cat.badge_color}; color: #fff"
><i data-lucide="tags" class="w-5 h-5"></i></div><div><h4 class="font-display font-extrabold text-base text-[#633D25]">${escapeHtml(cat.name)}</h4><span class="text-xs text-[#557447] font-bold">${count} Produk Terhubung</span></div></div><div class="flex items-center gap-1.5"><button
type="button"
onclick="window.SaleeApp.openCategoryModal('${cat.id}')"
class="p-2 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] cursor-pointer"
title="Edit Kategori"
><i data-lucide="pencil" class="w-4 h-4"></i></button><button
type="button"
onclick="window.SaleeApp.deleteCategory('${cat.id}')"
class="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer"
title="Hapus Kategori"
><i data-lucide="trash-2" class="w-4 h-4"></i></button></div></div><p class="text-xs text-[#633D25]/75 leading-relaxed">${escapeHtml(cat.description)}</p></div>
`;
})
.join('')}
</div></div>
`;
}
function renderAdminStockTab() {
const totalAvailable = state.db.products.reduce((acc, p) => acc + p.stock, 0);
const totalIn = state.db.stock_movements
.filter((m) => m.type === 'in')
.reduce((acc, m) => acc + m.quantity, 0);
const totalOut = state.db.stock_movements
.filter((m) => m.type === 'out')
.reduce((acc, m) => acc + m.quantity, 0);
const lowProducts = state.db.products.filter((p) => p.stock <= p.min_stock);
const movements = state.db.stock_movements.filter((m) => {
if (state.stockFilterType === 'ALL') return true;
return m.type === state.stockFilterType;
});
return `
<div class="space-y-6"><!-- Ringkasan Persediaan --><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#633D25]/60">Total Stok Tersedia</span><div class="text-2xl font-extrabold text-[#633D25] mt-1">${totalAvailable} Pouch</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-[#557447]">Total Stok Masuk (In)</span><div class="text-2xl font-extrabold text-[#557447] mt-1">+${totalIn} Pouch</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-amber-700">Total Stok Keluar (Out)</span><div class="text-2xl font-extrabold text-amber-700 mt-1">-${totalOut} Pouch</div></div><div class="bg-white p-5 rounded-3xl border border-[#633D25]/10"><span class="text-xs font-bold text-red-600">Peringatan Stok Minimum</span><div class="text-2xl font-extrabold text-red-600 mt-1">${lowProducts.length} Produk</div></div></div><!-- Baris Tombol Catat Stok Masuk / Keluar --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h3 class="font-display font-extrabold text-lg text-[#633D25]">Kontrol Persediaan & Mutasi Gudang</h3><p class="text-xs text-[#633D25]/70">Stok otomatis berkurang ketika pesanan dikonfirmasi/diproses, atau catat stok masuk/keluar manual di sini.</p></div><button
type="button"
onclick="window.SaleeApp.openStockModal()"
class="px-5 py-3 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shrink-0"
><i data-lucide="boxes" class="w-4 h-4 text-[#F5C84C]"></i><span>+ Catat Stok Masuk / Keluar</span></button></div><!-- Tabel Status Persediaan per Produk --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10"><h4 class="font-display font-extrabold text-base text-[#633D25] mb-4">Status Stok Produk Real-Time</h4><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
${state.db.products
.map((p) => {
const isOut = p.stock <= 0;
const isLow = p.stock > 0 && p.stock <= p.min_stock;
return `
<div class="p-4 rounded-2xl border ${
isOut ? 'bg-red-50 border-red-300' : isLow ? 'bg-amber-50 border-amber-300' : 'bg-[#FFF5DF]/50 border-[#633D25]/10'
} flex flex-col justify-between gap-3"><div><div class="flex items-center justify-between gap-2"><span class="text-[10px] font-mono font-bold text-[#633D25]/60">${escapeHtml(p.sku)}</span><span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
isOut ? 'bg-red-600 text-white' : isLow ? 'bg-amber-500 text-white' : 'bg-[#557447] text-white'
}">${isOut ? 'HABIS' : isLow ? 'HAMPIR HABIS' : 'AMAN'}</span></div><h5 class="font-extrabold text-sm text-[#633D25] mt-1">${escapeHtml(p.name)}</h5></div><div class="flex items-end justify-between pt-2 border-t border-[#633D25]/10"><div><span class="text-[11px] text-[#633D25]/60 block">Tersedia / Min</span><span class="text-lg font-extrabold text-[#633D25]">${p.stock} <span class="text-xs font-normal">/ ${p.min_stock}</span></span></div><button
type="button"
onclick="window.SaleeApp.openQuickRestock('${p.id}')"
class="px-3 py-1.5 rounded-xl bg-[#633D25] text-[#F5C84C] text-xs font-extrabold cursor-pointer"
>Update</button></div></div>
`;
})
.join('')}
</div></div><!-- Riwayat Perubahan Stok (stock_movements) --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10"><div class="flex flex-wrap items-center justify-between gap-4 mb-4"><h4 class="font-display font-extrabold text-base text-[#633D25]">Riwayat Perubahan Stok (Tabel stock_movements)</h4><select
onchange="window.SaleeApp.setStockFilterType(this.value)"
class="px-3.5 py-2 rounded-xl bg-[#FFF5DF] border border-[#633D25]/15 text-xs font-extrabold text-[#633D25]"
><option value="ALL" ${state.stockFilterType === 'ALL' ? 'selected' : ''}>Semua Mutasi</option><option value="in" ${state.stockFilterType === 'in' ? 'selected' : ''}>Stok Masuk (In)</option><option value="out" ${state.stockFilterType === 'out' ? 'selected' : ''}>Stok Keluar (Out)</option></select></div><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="border-b border-[#633D25]/10 text-[11px] uppercase text-[#633D25]/60"><th class="py-3 pr-3">Waktu</th><th class="py-3 px-3">Produk</th><th class="py-3 px-3">Tipe</th><th class="py-3 px-3">Jumlah</th><th class="py-3 px-3">Stok (Sebelum â†’ Sesudah)</th><th class="py-3 px-3">Referensi & Catatan</th></tr></thead><tbody class="divide-y divide-[#633D25]/10 text-xs">
${movements
.map((m) => {
const prod = getProductById(m.product_id);
const isIn = m.type === 'in';
return `
<tr class="hover:bg-[#FFF5DF]/40"><td class="py-3 pr-3 text-[#633D25]/70 whitespace-nowrap">${formatDateID(m.created_at)}</td><td class="py-3 px-3 font-extrabold text-[#633D25]">${prod ? escapeHtml(prod.name) : m.product_id}</td><td class="py-3 px-3"><span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
isIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
}">
${isIn ? 'STOK MASUK' : 'STOK KELUAR'}
</span></td><td class="py-3 px-3 font-extrabold ${isIn ? 'text-emerald-700' : 'text-amber-700'}">
${isIn ? '+' : '-'}${m.quantity} pouch
</td><td class="py-3 px-3 font-mono font-bold text-[#633D25]">
${m.previous_stock} â†’ ${m.current_stock}
</td><td class="py-3 px-3"><div class="font-bold text-[#633D25]">${escapeHtml(m.reference)}</div><div class="text-[11px] text-[#633D25]/65">${escapeHtml(m.notes)} (${escapeHtml(m.created_by)})</div></td></tr>
`;
})
.join('')}
</tbody></table></div></div></div>
`;
}
function renderAdminOrdersTab() {
const statuses = [
'ALL',
'Menunggu Pembayaran',
'Diproses',
'Dikemas',
'Dikirim',
'Selesai',
'Dibatalkan',
];
const filtered = state.db.orders.filter((o) => {
const matchStatus = state.adminOrderStatusFilter === 'ALL' || o.status === state.adminOrderStatusFilter;
const q = state.adminOrderSearch.trim().toLowerCase();
const matchQ =
!q ||
o.order_number.toLowerCase().includes(q) ||
o.customer_name.toLowerCase().includes(q) ||
o.customer_whatsapp.toLowerCase().includes(q);
return matchStatus && matchQ;
});
return `
<div class="space-y-6"><!-- Filter Bar --><div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 space-y-4"><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h3 class="font-display font-extrabold text-lg text-[#633D25]">Manajemen Pesanan Pelanggan</h3><p class="text-xs text-[#633D25]/65">Konfirmasi pembayaran, proses pengemasan, pengiriman, hingga pesanan selesai</p></div><div class="relative sm:w-72"><i data-lucide="search" class="w-4 h-4 text-[#633D25]/50 absolute left-3.5 top-1/2 -translate-y-1/2"></i><input
type="text"
value="${escapeHtml(state.adminOrderSearch)}"
oninput="window.SaleeApp.setAdminOrderSearch(this.value)"
placeholder="Cari No. Invoice / Pelanggan..."
class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-xs sm:text-sm"
/></div></div><div class="flex items-center gap-2 overflow-x-auto pb-1">
${statuses
.map((st) => {
const active = state.adminOrderStatusFilter === st;
const count =
st === 'ALL'
? state.db.orders.length
: state.db.orders.filter((o) => o.status === st).length;
return `
<button
type="button"
onclick="window.SaleeApp.setAdminOrderStatusFilter('${st}')"
class="px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
active ? 'bg-[#633D25] text-[#F5C84C]' : 'bg-[#FFF5DF] text-[#633D25] hover:bg-[#F5C84C]/30'
}"
>
${st === 'ALL' ? 'Semua Pesanan' : st} (${count})
</button>
`;
})
.join('')}
</div></div><!-- Orders Table --><div class="bg-white rounded-3xl border border-[#633D25]/10 shadow-sm overflow-hidden"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-[#FFF5DF] border-b border-[#633D25]/10 text-[11px] font-extrabold uppercase text-[#633D25]"><th class="py-3.5 px-4">No. Pesanan & Waktu</th><th class="py-3.5 px-4">Pelanggan</th><th class="py-3.5 px-4">Metode & Total</th><th class="py-3.5 px-4">Status Saat Ini</th><th class="py-3.5 px-4">Ubah Status Pesanan</th><th class="py-3.5 px-4 text-right">Detail</th></tr></thead><tbody class="divide-y divide-[#633D25]/10 text-xs">
${filtered
.map(
(o) => `
<tr class="hover:bg-[#FFF5DF]/40"><td class="py-3.5 px-4"><div class="font-mono font-extrabold text-[#633D25]">${escapeHtml(o.order_number)}</div><div class="text-[11px] text-[#633D25]/60">${formatDateID(o.created_at)}</div></td><td class="py-3.5 px-4"><div class="font-extrabold text-[#633D25]">${escapeHtml(o.customer_name)}</div><div class="text-[11px] text-[#633D25]/70">${escapeHtml(o.customer_whatsapp)}</div></td><td class="py-3.5 px-4"><div class="font-extrabold text-sm text-[#557447]">${formatRp(o.total_amount)}</div><div class="text-[11px] text-[#633D25]/65">${escapeHtml(o.payment_method)}</div></td><td class="py-3.5 px-4">${renderOrderStatusBadge(o.status)}</td><td class="py-3.5 px-4"><select
onchange="window.SaleeApp.updateOrderStatus('${o.id}', this.value)"
class="px-3 py-1.5 rounded-xl bg-[#FFF5DF] border border-[#633D25]/20 text-xs font-extrabold text-[#633D25] cursor-pointer"
>
${[
'Menunggu Pembayaran',
'Diproses',
'Dikemas',
'Dikirim',
'Selesai',
'Dibatalkan',
]
.map(
(st) =>
`<option value="${st}" ${o.status === st ? 'selected' : ''}>${st}</option>`
)
.join('')}
</select></td><td class="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
${
o.status === 'Menunggu Pembayaran'
? `
<button
type="button"
onclick="window.SaleeApp.updateOrderStatus('${o.id}', 'Diproses')"
class="px-2.5 py-1.5 rounded-xl bg-[#557447] text-white font-extrabold text-[11px] cursor-pointer"
>Konfirmasi Bayar</button>
`
: ''
}
<button
type="button"
onclick="window.SaleeApp.openOrderDetail('${o.id}')"
class="px-3 py-1.5 rounded-xl bg-[#633D25] text-[#F5C84C] font-extrabold text-[11px] cursor-pointer"
>Rincian</button></td></tr>
`
)
.join('')}
</tbody></table></div></div></div>
`;
}
