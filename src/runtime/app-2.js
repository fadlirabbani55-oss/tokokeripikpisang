function renderNavbar() {
const cartSummary = getCartSummary();
const lowStockCount = state.db.products.filter((p) => p.stock <= p.min_stock).length;
return `
<!-- Top Tropical Bar --><div class="bg-[#633D25] text-[#FFF5DF] text-xs py-2 px-4 border-b border-[#F5C84C]/20"><div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2"><div class="flex items-center gap-2"><span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F5C84C] text-[#633D25]"><i data-lucide="sparkles" class="w-3 h-3"></i> TROPICAL CRAFT SNACK
</span><span class="font-medium">Gratis Ongkir Otomatis untuk belanja di atas <strong>${formatRp(state.db.settings.free_shipping_threshold)}</strong>!</span></div><div class="flex items-center gap-4"><span class="hidden sm:inline-flex items-center gap-1 text-[#FFF5DF]/85"><i data-lucide="shield-check" class="w-3.5 h-3.5 text-[#F5C84C]"></i> 100% Halal & Tanpa Pengawet
</span><button
type="button"
onclick="window.SaleeApp.openAdmin()"
class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C84C]/20 hover:bg-[#F5C84C] text-[#F5C84C] hover:text-[#633D25] font-bold transition-all text-xs cursor-pointer"
><i data-lucide="layout-dashboard" class="w-3.5 h-3.5"></i><span>Panel Dashboard Admin</span>
${lowStockCount > 0 ? `<span class="px-1.5 py-0.2 bg-red-500 text-white rounded-full text-[10px]">${lowStockCount}</span>` : ''}
</button></div></div></div><!-- Sticky Main Navbar --><header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#633D25]/10 shadow-sm"><nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4"><!-- Brand Logo --><a href="#beranda" class="flex items-center gap-3 group"><div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5C84C] to-[#eab308] border-2 border-[#633D25] flex items-center justify-center text-[#633D25] shadow-md group-hover:rotate-6 transition-transform"><svg class="w-7 h-7 text-[#633D25]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" /><path d="M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z" /></svg></div><div><span class="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#633D25] block leading-none">
Keripik Pisang <span class="text-[#557447]">Salee</span></span><span class="text-[11px] font-semibold text-[#633D25]/65 tracking-wide uppercase mt-1 block">
Modern Tropical Food UMKM
</span></div></a><!-- Navigation Links --><div class="hidden md:flex items-center gap-1 lg:gap-2"><a href="#beranda" class="px-4 py-2 rounded-xl text-sm font-bold text-[#633D25] hover:bg-[#FFF5DF] transition">Beranda</a><a href="#produk" class="px-4 py-2 rounded-xl text-sm font-bold text-[#633D25] hover:bg-[#FFF5DF] transition">Produk</a><a href="#tentang-kami" class="px-4 py-2 rounded-xl text-sm font-bold text-[#633D25] hover:bg-[#FFF5DF] transition">Tentang Kami</a><a href="#kontak" class="px-4 py-2 rounded-xl text-sm font-bold text-[#633D25] hover:bg-[#FFF5DF] transition">Kontak</a></div><!-- Right Actions: Cart + Login/Register --><div class="flex items-center gap-2.5"><!-- Cart Button --><button
type="button"
onclick="window.SaleeApp.toggleCart(true)"
class="relative inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#FFF5DF] hover:bg-[#F5C84C]/40 text-[#633D25] border border-[#633D25]/15 font-bold text-sm transition-all cursor-pointer active:scale-95"
aria-label="Keranjang Belanja"
><i data-lucide="shopping-bag" class="w-4 h-4 text-[#633D25]"></i><span class="hidden sm:inline">Keranjang</span><span class="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-extrabold bg-[#633D25] text-[#F5C84C]">
${cartSummary.totalQty}
</span></button><!-- Auth / Login Button -->
${
state.currentUser
? `
<div class="hidden sm:flex items-center gap-2"><button
type="button"
onclick="${state.currentUser.role === 'admin' ? 'window.SaleeApp.openAdmin()' : 'window.SaleeApp.openAuthModal()'}"
class="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#557447] hover:bg-[#466039] text-white text-xs font-bold transition cursor-pointer"
><i data-lucide="user-check" class="w-4 h-4 text-[#F5C84C]"></i><span>${escapeHtml(state.currentUser.full_name.split(' ')[0])}</span></button><button
type="button"
onclick="window.SaleeApp.logout()"
title="Logout"
class="p-2.5 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 transition cursor-pointer"
><i data-lucide="log-out" class="w-4 h-4"></i></button></div>
`
: `
<button
type="button"
onclick="window.SaleeApp.openAuthModal()"
class="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-bold text-sm shadow-sm transition cursor-pointer"
><i data-lucide="user" class="w-4 h-4 text-[#F5C84C]"></i><span>Login / Register</span></button>
`
}
<!-- Mobile Hamburger --><button
type="button"
onclick="window.SaleeApp.toggleMobileMenu()"
class="md:hidden p-2.5 rounded-2xl bg-[#FFF5DF] text-[#633D25] border border-[#633D25]/15"
aria-label="Menu Mobile"
><i data-lucide="${state.mobileMenuOpen ? 'x' : 'menu'}" class="w-5 h-5"></i></button></div></nav><!-- Mobile Menu Dropdown -->
${
state.mobileMenuOpen
? `
<div class="md:hidden bg-white border-t border-[#633D25]/10 px-4 pt-3 pb-5 space-y-2 shadow-xl"><a href="#beranda" onclick="window.SaleeApp.toggleMobileMenu(false)" class="block px-4 py-2.5 rounded-xl font-bold text-[#633D25] hover:bg-[#FFF5DF]">Beranda</a><a href="#produk" onclick="window.SaleeApp.toggleMobileMenu(false)" class="block px-4 py-2.5 rounded-xl font-bold text-[#633D25] hover:bg-[#FFF5DF]">Produk</a><a href="#tentang-kami" onclick="window.SaleeApp.toggleMobileMenu(false)" class="block px-4 py-2.5 rounded-xl font-bold text-[#633D25] hover:bg-[#FFF5DF]">Tentang Kami</a><a href="#kontak" onclick="window.SaleeApp.toggleMobileMenu(false)" class="block px-4 py-2.5 rounded-xl font-bold text-[#633D25] hover:bg-[#FFF5DF]">Kontak</a><div class="pt-2 border-t border-[#633D25]/10 flex flex-col gap-2"><button
type="button"
onclick="window.SaleeApp.openAuthModal()"
class="w-full py-2.5 rounded-xl bg-[#633D25] text-white font-bold text-sm flex items-center justify-center gap-2"
><i data-lucide="user" class="w-4 h-4 text-[#F5C84C]"></i><span>${state.currentUser ? escapeHtml(state.currentUser.full_name) : 'Login / Register'}</span></button><button
type="button"
onclick="window.SaleeApp.openAdmin()"
class="w-full py-2.5 rounded-xl bg-[#F5C84C] text-[#633D25] font-extrabold text-sm flex items-center justify-center gap-2"
><i data-lucide="layout-dashboard" class="w-4 h-4"></i><span>Buka Dashboard Admin</span></button></div></div>
`
: ''
}
</header>
`;
}
function renderHeroSection() {
return `
<section id="beranda" class="relative overflow-hidden bg-gradient-to-br from-[#FFF5DF] via-[#FFF5DF] to-[#F5C84C]/45 pt-10 pb-20 lg:py-24 border-b border-[#633D25]/10"><!-- Tropical Leaf & Sunburst Ornaments --><div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#F5C84C]/35 blur-3xl pointer-events-none"></div><div class="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#557447]/10 blur-3xl pointer-events-none"></div><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"><!-- Left Column: Copywriting & CTA --><div class="lg:col-span-7 space-y-6 text-center lg:text-left"><div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#557447]/15 border border-[#557447]/30 text-[#557447] text-xs sm:text-sm font-extrabold"><i data-lucide="leaf" class="w-4 h-4"></i><span>100% Pisang Kepok Kuning Pilihan â€¢ Tanpa Pemanis Buatan</span></div><h1 class="font-display text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#633D25] leading-[1.12] tracking-tight">
Nikmati Renyahnya <span class="underline decoration-[#F5C84C] decoration-8 underline-offset-4">Keripik Pisang Salee!</span></h1><p class="text-[#633D25]/80 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
Perpaduan sempurna irisan pisang kepok matang pohon yang disalai hingga berkaramel alami, digoreng renyah keemasan, dan dibalut varian rasa autentik tropis Nusantara. Camilan premium untuk keluarga dan oleh-oleh istimewa.
</p><!-- CTA Buttons --><div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"><a
href="#produk"
class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#633D25] hover:bg-[#4d2f1c] text-white font-extrabold text-sm sm:text-base shadow-xl shadow-[#633D25]/20 transition-all hover:-translate-y-0.5"
><i data-lucide="shopping-bag" class="w-5 h-5 text-[#F5C84C]"></i><span>Belanja Sekarang</span></a><a
href="#tentang-kami"
class="inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white hover:bg-[#F5C84C]/25 text-[#633D25] border-2 border-[#633D25]/20 font-extrabold text-sm sm:text-base transition-all hover:-translate-y-0.5"
><span>Kenali Produk Kami</span><i data-lucide="arrow-right" class="w-4 h-4 text-[#557447]"></i></a></div><!-- Trust Metrics --><div class="pt-6 grid grid-cols-3 gap-4 border-t border-[#633D25]/15 max-w-lg mx-auto lg:mx-0"><div class="bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-[#633D25]/10"><div class="text-xl sm:text-2xl font-extrabold text-[#633D25]">2.300+</div><div class="text-xs font-semibold text-[#557447]">Pouch Terjual</div></div><div class="bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-[#633D25]/10"><div class="text-xl sm:text-2xl font-extrabold text-[#633D25]">4.9 / 5.0</div><div class="text-xs font-semibold text-[#557447]">Rating Pelanggan</div></div><div class="bg-white/70 backdrop-blur-sm p-3.5 rounded-2xl border border-[#633D25]/10"><div class="text-xl sm:text-2xl font-extrabold text-[#633D25]">100%</div><div class="text-xs font-semibold text-[#557447]">Fresh Setiap Hari</div></div></div></div><!-- Right Column: Large Hero Product Visual --><div class="lg:col-span-5"><div class="relative mx-auto max-w-lg"><div class="absolute -inset-3 rounded-[36px] bg-gradient-to-tr from-[#F5C84C] via-[#557447]/40 to-[#633D25]/30 blur-xl opacity-70"></div><div class="relative bg-white rounded-[32px] p-4 shadow-2xl border-4 border-white"><div class="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#FFF5DF]"><img
src="https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=1000&q=85"
alt="Keripik Pisang Salee Kualitas Premium"
class="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
/><div class="absolute inset-0 bg-gradient-to-t from-[#633D25]/80 via-transparent to-transparent"></div><div class="absolute top-4 left-4"><span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5C84C] text-[#633D25] text-xs font-extrabold shadow-md"><i data-lucide="award" class="w-3.5 h-3.5"></i> Best Seller UMKM
</span></div><div class="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between"><div><p class="text-xs uppercase tracking-wider text-[#F5C84C] font-bold">Varian Terfavorit</p><h3 class="text-lg font-extrabold">Salee Madu Karamel & Choco Melt</h3></div><span class="px-3 py-1.5 rounded-xl bg-white text-[#633D25] font-extrabold text-sm shadow">
Mulai Rp 18.000
</span></div></div><!-- Bottom Floating Feature Strip inside Card --><div class="mt-4 grid grid-cols-2 gap-3"><div class="flex items-center gap-3 p-3 rounded-2xl bg-[#FFF5DF] border border-[#F5C84C]/50"><div class="w-10 h-10 rounded-xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center shrink-0"><i data-lucide="flame" class="w-5 h-5"></i></div><div><div class="text-xs font-extrabold text-[#633D25]">Karamel Alami</div><div class="text-[11px] text-[#633D25]/70">Disalai higienis</div></div></div><div class="flex items-center gap-3 p-3 rounded-2xl bg-[#557447]/10 border border-[#557447]/20"><div class="w-10 h-10 rounded-xl bg-[#557447] text-white flex items-center justify-center shrink-0"><i data-lucide="package-check" class="w-5 h-5"></i></div><div><div class="text-xs font-extrabold text-[#633D25]">Kemasan Ziplock</div><div class="text-[11px] text-[#633D25]/70">Awet renyah 3 bulan</div></div></div></div></div></div></div></div></div></section>
`;
}
function renderCategorySection() {
const categories = state.db.categories;
return `
<section class="py-14 bg-white border-b border-[#633D25]/10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"><div><span class="text-xs font-extrabold uppercase tracking-widest text-[#557447] block mb-1">Koleksi Rasa Pilihan</span><h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#633D25]">Kategori Produk Keripik Pisang Salee</h2></div><button
type="button"
onclick="window.SaleeApp.selectCategory('ALL')"
class="self-start md:self-auto text-sm font-bold text-[#557447] hover:text-[#633D25] inline-flex items-center gap-1.5 cursor-pointer"
><span>Tampilkan Semua Varian (${state.db.products.length})</span><i data-lucide="arrow-right" class="w-4 h-4"></i></button></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
${categories
.map((cat) => {
const count = state.db.products.filter((p) => p.category_id === cat.id).length;
const isSelected = state.selectedCategory === cat.id;
return `
<div
onclick="window.SaleeApp.selectCategory('${cat.id}')"
class="group cursor-pointer rounded-3xl p-6 transition-all duration-300 border-2 ${
isSelected
? 'bg-[#633D25] text-white border-[#633D25] shadow-xl -translate-y-1'
: 'bg-[#FFF5DF]/70 hover:bg-[#FFF5DF] text-[#633D25] border-[#633D25]/10 hover:border-[#F5C84C] hover:-translate-y-1'
}"
><div class="flex items-center justify-between mb-4"><div
class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold shadow-sm"
style="background-color: ${cat.badge_color}; color: ${cat.badge_color === '#633D25' || cat.badge_color === '#557447' ? '#FFFFFF' : '#633D25'}"
><i data-lucide="${cat.icon || 'tag'}" class="w-6 h-6"></i></div><span class="px-3 py-1 rounded-full text-xs font-extrabold ${
isSelected ? 'bg-[#F5C84C] text-[#633D25]' : 'bg-white text-[#633D25]'
}">
${count} Produk
</span></div><h3 class="font-display font-extrabold text-lg mb-1.5">${escapeHtml(cat.name)}</h3><p class="text-xs leading-relaxed ${isSelected ? 'text-[#FFF5DF]/85' : 'text-[#633D25]/75'} line-clamp-2">
${escapeHtml(cat.description)}
</p></div>
`;
})
.join('')}
</div></div></section>
`;
}
function renderCatalogSection() {
let filtered = state.db.products.filter((p) => {
const matchCat = state.selectedCategory === 'ALL' || p.category_id === state.selectedCategory;
const q = state.searchQuery.trim().toLowerCase();
const matchSearch =
!q ||
p.name.toLowerCase().includes(q) ||
p.description.toLowerCase().includes(q) ||
p.sku.toLowerCase().includes(q);
return matchCat && matchSearch;
});
if (state.sortBy === 'popular') {
filtered.sort((a, b) => Number(b.is_popular) - Number(a.is_popular) || b.sold_count - a.sold_count);
} else if (state.sortBy === 'price_asc') {
filtered.sort((a, b) => a.price - b.price);
} else if (state.sortBy === 'price_desc') {
filtered.sort((a, b) => b.price - a.price);
} else if (state.sortBy === 'stock_desc') {
filtered.sort((a, b) => b.stock - a.stock);
}
return `
<section id="produk" class="py-16 bg-[#FFF5DF]"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><!-- Section Title & Filter Bar --><div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8"><div><span class="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#557447] mb-1"><i data-lucide="flame" class="w-3.5 h-3.5"></i> Katalog Resmi UMKM
</span><h2 class="font-display text-3xl font-extrabold text-[#633D25]">Pilih Varian Favoritmu</h2></div><!-- Search & Sort Controls --><div class="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"><div class="relative flex-1 sm:w-72"><i data-lucide="search" class="w-4 h-4 text-[#633D25]/50 absolute left-4 top-1/2 -translate-y-1/2"></i><input
type="text"
value="${escapeHtml(state.searchQuery)}"
oninput="window.SaleeApp.setSearchQuery(this.value)"
placeholder="Cari rasa keripik pisang..."
class="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#633D25]/15 text-sm font-medium text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><select
onchange="window.SaleeApp.setSortBy(this.value)"
class="px-4 py-3 rounded-2xl bg-white border border-[#633D25]/15 text-sm font-bold text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
><option value="popular" ${state.sortBy === 'popular' ? 'selected' : ''}>Urutkan: Terpopuler</option><option value="price_asc" ${state.sortBy === 'price_asc' ? 'selected' : ''}>Harga: Terendah ke Tinggi</option><option value="price_desc" ${state.sortBy === 'price_desc' ? 'selected' : ''}>Harga: Tertinggi ke Rendah</option><option value="stock_desc" ${state.sortBy === 'stock_desc' ? 'selected' : ''}>Stok Terbanyak</option></select></div></div><!-- Category Filter Pills --><div class="flex items-center gap-2 overflow-x-auto pb-4 mb-6"><button
type="button"
onclick="window.SaleeApp.selectCategory('ALL')"
class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition cursor-pointer ${
state.selectedCategory === 'ALL'
? 'bg-[#633D25] text-[#F5C84C] shadow-md'
: 'bg-white text-[#633D25] hover:bg-[#F5C84C]/30 border border-[#633D25]/10'
}"
>
Semua Kategori (${state.db.products.length})
</button>
${state.db.categories
.map((cat) => {
const active = state.selectedCategory === cat.id;
return `
<button
type="button"
onclick="window.SaleeApp.selectCategory('${cat.id}')"
class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition cursor-pointer ${
active
? 'bg-[#633D25] text-[#F5C84C] shadow-md'
: 'bg-white text-[#633D25] hover:bg-[#F5C84C]/30 border border-[#633D25]/10'
}"
>
${escapeHtml(cat.name)}
</button>
`;
})
.join('')}
</div><!-- Product Grid -->
${
filtered.length === 0
? `
<div class="bg-white rounded-3xl p-12 text-center border border-[#633D25]/10"><div class="w-16 h-16 rounded-2xl bg-[#FFF5DF] text-[#633D25] flex items-center justify-center mx-auto mb-4"><i data-lucide="package-search" class="w-8 h-8"></i></div><h3 class="text-lg font-extrabold text-[#633D25]">Produk Tidak Ditemukan</h3><p class="text-sm text-[#633D25]/70 mt-1 mb-5">Coba kata kunci lain atau tampilkan semua kategori produk kami.</p><button
type="button"
onclick="window.SaleeApp.resetCatalogFilter()"
class="px-5 py-2.5 rounded-xl bg-[#633D25] text-white text-sm font-bold"
>
Reset Filter Pencarian
</button></div>
`
: `
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
${filtered
.map((product) => {
const cat = getCategoryById(product.category_id);
const isOut = product.stock <= 0;
const isLow = product.stock > 0 && product.stock <= product.min_stock;
return `
<div class="bg-white rounded-3xl overflow-hidden border border-[#633D25]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1.5"><!-- Image Wrapper --><div class="relative aspect-[4/3] bg-[#FFF5DF] overflow-hidden"><img
src="${escapeHtml(product.image_url)}"
alt="${escapeHtml(product.name)}"
class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
onerror="this.src='https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80'"
/><!-- Top Badges --><div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
${
product.is_popular
? `
<span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F5C84C] text-[#633D25] shadow"><i data-lucide="flame" class="w-3 h-3"></i> Populer
</span>
`
: ''
}
<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-[#633D25] backdrop-blur-sm">
${escapeHtml(cat.name.replace('Keripik Pisang ', ''))}
</span></div><!-- Weight & Rating Badge --><div class="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-[#633D25]/85 text-white text-[11px] font-bold backdrop-blur-sm flex items-center gap-1"><i data-lucide="star" class="w-3 h-3 text-[#F5C84C] fill-[#F5C84C]"></i><span>${product.rating || '4.9'}</span><span class="opacity-60">â€¢</span><span>${product.weight_grams}g</span></div></div><!-- Card Body --><div class="p-5 flex-1 flex flex-col justify-between space-y-4"><div><h3
onclick="window.SaleeApp.openProductDetail('${product.id}')"
class="font-display font-extrabold text-base sm:text-lg text-[#633D25] hover:text-[#557447] cursor-pointer leading-snug line-clamp-1"
>
${escapeHtml(product.name)}
</h3><p class="text-xs text-[#633D25]/70 mt-1.5 line-clamp-2 leading-relaxed">
${escapeHtml(product.description)}
</p></div><div class="space-y-3 pt-2 border-t border-[#633D25]/10"><div class="flex items-center justify-between"><div><span class="text-[11px] text-[#633D25]/60 font-semibold block">Harga Kemasan</span><span class="font-display font-extrabold text-xl text-[#633D25]">${formatRp(product.price)}</span></div><div class="text-right"><span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
isOut
? 'bg-red-100 text-red-700'
: isLow
? 'bg-amber-100 text-amber-800'
: 'bg-[#557447]/15 text-[#557447]'
}"><span class="w-1.5 h-1.5 rounded-full ${
isOut ? 'bg-red-600' : isLow ? 'bg-amber-600' : 'bg-[#557447]'
}"></span>
${isOut ? 'Stok Habis' : `Stok: ${product.stock}`}
</span></div></div><!-- Action Buttons: Detail Produk & Tambah ke Keranjang --><div class="grid grid-cols-5 gap-2"><button
type="button"
onclick="window.SaleeApp.openProductDetail('${product.id}')"
class="col-span-2 py-2.5 px-3 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C]/40 text-[#633D25] font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
><i data-lucide="eye" class="w-3.5 h-3.5"></i><span>Detail</span></button><button
type="button"
${isOut ? 'disabled' : `onclick="window.SaleeApp.addToCart('${product.id}', 1)"`}
class="col-span-3 py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
isOut
? 'bg-gray-200 text-gray-400 cursor-not-allowed'
: 'bg-[#633D25] hover:bg-[#4e2f1c] text-white shadow-sm active:scale-95'
}"
><i data-lucide="shopping-cart" class="w-3.5 h-3.5 text-[#F5C84C]"></i><span>+ Keranjang</span></button></div></div></div></div>
`;
})
.join('')}
</div>
`
}
</div></section>
`;
}
function renderAboutSection() {
return `
<section id="tentang-kami" class="py-20 bg-white border-t border-[#633D25]/10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"><!-- Visual Collage --><div class="lg:col-span-5 space-y-4"><div class="relative rounded-3xl overflow-hidden shadow-xl border-4 border-[#FFF5DF]"><img
src="https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80"
alt="Proses Produksi Keripik Pisang Salee"
class="w-full h-72 object-cover"
/><div class="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#633D25]/90 backdrop-blur-md text-white"><div class="text-xs font-bold text-[#F5C84C] uppercase">Warisan Rasa Nusantara</div><div class="text-sm font-semibold mt-0.5">Kemitraan langsung bersama 45+ petani pisang kepok lokal Lampung & Jawa Barat.</div></div></div><div class="grid grid-cols-2 gap-4"><div class="p-5 rounded-3xl bg-[#FFF5DF] border border-[#F5C84C]/50"><div class="text-2xl font-extrabold text-[#633D25]">100% Alami</div><p class="text-xs text-[#633D25]/75 mt-1">Tanpa pemanis buatan, tanpa pengawet, dan bebas MSG berlebih.</p></div><div class="p-5 rounded-3xl bg-[#557447] text-white"><div class="text-2xl font-extrabold text-[#F5C84C]">Higienis</div><p class="text-xs text-white/85 mt-1">Menggunakan mesin spinner peniris minyak modern sehingga keripik kering & renyah.</p></div></div></div><!-- Story & Production Process --><div class="lg:col-span-7 space-y-6"><span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F5C84C]/30 text-[#633D25] text-xs font-extrabold"><i data-lucide="sprout" class="w-4 h-4 text-[#557447]"></i> TENTANG KERIPIK PISANG SALEE
</span><h2 class="font-display text-3xl sm:text-4xl font-extrabold text-[#633D25] leading-tight">
Dari Kebun Tropis Pilihan Menuju Camilan Kelas Premium
</h2><p class="text-sm sm:text-base text-[#633D25]/80 leading-relaxed"><strong>Keripik Pisang Salee</strong> berawal dari dapur UMKM keluarga yang ingin mengangkat cita rasa pisang sale tradisional menjadi camilan modern berkualitas ekspor. Kami memadukan teknik penyalaian (karamelisasi alami) dengan penggorengan vakum bersuhu terkontrol agar menghasilkan tekstur super renyah tanpa menghilangkan nutrisi alami buah pisang.
</p><!-- 4 Pillars --><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"><div class="p-4 rounded-2xl bg-[#FFF5DF]/60 border border-[#633D25]/10 flex items-start gap-3.5"><div class="w-10 h-10 rounded-xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center shrink-0 font-bold"><i data-lucide="check-circle-2" class="w-5 h-5"></i></div><div><h4 class="font-extrabold text-sm text-[#633D25]">Sortir Bahan Baku Ketat</h4><p class="text-xs text-[#633D25]/75 mt-1">Hanya menggunakan pisang kepok kuning dengan tingkat kematangan 85% agar manis legit alami.</p></div></div><div class="p-4 rounded-2xl bg-[#FFF5DF]/60 border border-[#633D25]/10 flex items-start gap-3.5"><div class="w-10 h-10 rounded-xl bg-[#557447] text-white flex items-center justify-center shrink-0 font-bold"><i data-lucide="sparkles" class="w-5 h-5"></i></div><div><h4 class="font-extrabold text-sm text-[#633D25]">Bumbu & Cokelat Asli</h4><p class="text-xs text-[#633D25]/75 mt-1">Menggunakan cokelat couverture, madu hutan murni, dan bubuk matcha Uji Jepang pilihan.</p></div></div><div class="p-4 rounded-2xl bg-[#FFF5DF]/60 border border-[#633D25]/10 flex items-start gap-3.5"><div class="w-10 h-10 rounded-xl bg-[#633D25] text-[#F5C84C] flex items-center justify-center shrink-0 font-bold"><i data-lucide="shield-check" class="w-5 h-5"></i></div><div><h4 class="font-extrabold text-sm text-[#633D25]">Kemasan Aluminium Foil</h4><p class="text-xs text-[#633D25]/75 mt-1">Dilengkapi ziplock kedap udara yang menjaga kerenyahan hingga 90 hari di suhu ruang.</p></div></div><div class="p-4 rounded-2xl bg-[#FFF5DF]/60 border border-[#633D25]/10 flex items-start gap-3.5"><div class="w-10 h-10 rounded-xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center shrink-0 font-bold"><i data-lucide="heart-handshake" class="w-5 h-5"></i></div><div><h4 class="font-extrabold text-sm text-[#633D25]">Garansi Kepuasan Pelanggan</h4><p class="text-xs text-[#633D25]/75 mt-1">Garansi ganti baru 100% apabila kemasan diterima dalam keadaan rusak atau melempem.</p></div></div></div></div></div></div></section>
`;
}
function renderContactSection() {
const s = state.db.settings;
return `
<section id="kontak" class="py-20 bg-[#FFF5DF] border-t border-[#633D25]/10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 lg:grid-cols-12 gap-10"><!-- Contact Info --><div class="lg:col-span-5 space-y-6"><div><span class="text-xs font-extrabold uppercase tracking-widest text-[#557447] block mb-1">Hubungi Kami</span><h2 class="font-display text-3xl font-extrabold text-[#633D25]">Siap Melayani Pesanan Eceran, Hampers & Reseller</h2><p class="text-sm text-[#633D25]/75 mt-2 leading-relaxed">
Punya pertanyaan seputar stok grosir, paket hampers hari raya, atau pengiriman luar pulau? Tim layanan pelanggan kami siap membantu Anda.
</p></div><div class="space-y-4"><div class="p-4 rounded-2xl bg-white border border-[#633D25]/10 flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-[#557447] text-white flex items-center justify-center shrink-0"><i data-lucide="phone-call" class="w-5 h-5"></i></div><div><div class="text-xs font-bold text-[#633D25]/60">WhatsApp Layanan Pelanggan</div><div class="font-extrabold text-base text-[#633D25]">+${escapeHtml(s.whatsapp)}</div></div></div><div class="p-4 rounded-2xl bg-white border border-[#633D25]/10 flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center shrink-0"><i data-lucide="map-pin" class="w-5 h-5"></i></div><div><div class="text-xs font-bold text-[#633D25]/60">Alamat Rumah Produksi & Galeri UMKM</div><div class="font-bold text-sm text-[#633D25]">${escapeHtml(s.address)}</div></div></div><div class="p-4 rounded-2xl bg-white border border-[#633D25]/10 flex items-center gap-4"><div class="w-12 h-12 rounded-2xl bg-[#633D25] text-[#F5C84C] flex items-center justify-center shrink-0"><i data-lucide="share-2" class="w-5 h-5"></i></div><div><div class="text-xs font-bold text-[#633D25]/60">Media Sosial Resmi</div><div class="font-bold text-sm text-[#633D25]">Instagram: ${escapeHtml(s.instagram)} â€¢ TikTok: ${escapeHtml(s.tiktok)}</div></div></div></div></div><!-- Customer Message Form --><div class="lg:col-span-7"><div class="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-[#633D25]/10"><h3 class="font-display text-xl font-extrabold text-[#633D25] mb-1">Formulir Pesan Pelanggan</h3><p class="text-xs text-[#633D25]/70 mb-6">Kirimkan pertanyaan, saran, atau pengajuan kemitraan reseller melalui formulir di bawah ini.</p><form onsubmit="window.SaleeApp.submitContact(event)" class="space-y-4"><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1.5">Nama Lengkap *</label><input
type="text"
name="name"
required
placeholder="Contoh: Rina Kartika"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1.5">Nomor WhatsApp *</label><input
type="tel"
name="whatsapp"
required
placeholder="Contoh: 081234567890"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1.5">Topik Pesan</label><input
type="text"
name="subject"
placeholder="Contoh: Pemesanan Hampers / Info Reseller"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1.5">Isi Pesan *</label><textarea
name="message"
rows="4"
required
placeholder="Tuliskan pesan atau pertanyaan Anda..."
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/15 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
></textarea></div><button
type="submit"
class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-sm inline-flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
><i data-lucide="send" class="w-4 h-4 text-[#F5C84C]"></i><span>Kirim Pesan Sekarang</span></button></form></div></div></div></div></section>
`;
}
function renderFooter() {
const s = state.db.settings;
return `
<footer class="bg-[#633D25] text-[#FFF5DF] pt-14 pb-10 border-t-4 border-[#F5C84C]"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/15"><div class="md:col-span-2 space-y-3"><div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center font-extrabold"><i data-lucide="sparkles" class="w-5 h-5"></i></div><span class="font-display font-extrabold text-xl text-white">Keripik Pisang <span class="text-[#F5C84C]">Salee</span></span></div><p class="text-xs sm:text-sm text-[#FFF5DF]/80 max-w-md leading-relaxed">
${escapeHtml(s.tagline)}. Diproduksi setiap hari dengan bahan baku lokal berkualitas tinggi dari petani Nusantara.
</p><div class="text-xs text-[#F5C84C] font-semibold">
Rekening Resmi: ${escapeHtml(s.bank_name)} ${escapeHtml(s.bank_account)} a.n ${escapeHtml(s.bank_holder)}
</div></div><div><h4 class="font-extrabold text-sm text-[#F5C84C] uppercase tracking-wider mb-3">Navigasi Cepat</h4><ul class="space-y-2 text-xs sm:text-sm text-[#FFF5DF]/80"><li><a href="#beranda" class="hover:text-[#F5C84C]">Beranda</a></li><li><a href="#produk" class="hover:text-[#F5C84C]">Katalog Produk</a></li><li><a href="#tentang-kami" class="hover:text-[#F5C84C]">Tentang Kami</a></li><li><a href="#kontak" class="hover:text-[#F5C84C]">Hubungi Kami</a></li></ul></div><div><h4 class="font-extrabold text-sm text-[#F5C84C] uppercase tracking-wider mb-3">Akses Pengelola</h4><p class="text-xs text-[#FFF5DF]/75 mb-3">Kelola produk, stok persediaan, pesanan pelanggan, dan laporan penjualan UMKM.</p><button
type="button"
onclick="window.SaleeApp.openAdmin()"
class="px-4 py-2.5 rounded-xl bg-[#F5C84C] text-[#633D25] font-extrabold text-xs inline-flex items-center gap-2 hover:bg-amber-300 transition cursor-pointer"
><i data-lucide="layout-dashboard" class="w-4 h-4"></i><span>Buka Dashboard Admin</span></button></div></div><div class="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFF5DF]/65 gap-2"><div>&copy; ${new Date().getFullYear()} ${escapeHtml(s.store_name)}. Seluruh hak cipta dilindungi.</div><div>Modern Tropical Food Branding â€¢ Fullstack E-Commerce & ERP UMKM</div></div></div></footer>
`;
}
