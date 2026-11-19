function renderProductDetailModal() {
if (!state.detailProductId) return '';
const product = getProductById(state.detailProductId);
if (!product) return '';
const cat = getCategoryById(product.category_id);
const recommendations = state.db.products
.filter((p) => p.id !== product.id)
.slice(0, 3);
return `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"><div class="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-2 border-[#633D25]/15 my-8"><!-- Top Bar --><div class="flex items-center justify-between px-6 py-4 bg-[#FFF5DF] border-b border-[#633D25]/10"><div class="flex items-center gap-2 text-xs font-extrabold text-[#557447]"><i data-lucide="tag" class="w-4 h-4"></i><span>${escapeHtml(cat.name)}</span><span>â€¢</span><span>SKU: ${escapeHtml(product.sku)}</span></div><button
type="button"
onclick="window.SaleeApp.closeProductDetail()"
class="p-2 rounded-xl bg-white hover:bg-red-50 text-[#633D25] hover:text-red-600 transition cursor-pointer"
><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[82vh] overflow-y-auto"><!-- Product Photo --><div class="md:col-span-5"><div class="rounded-2xl overflow-hidden bg-[#FFF5DF] aspect-square border border-[#633D25]/10"><img
src="${escapeHtml(product.image_url)}"
alt="${escapeHtml(product.name)}"
class="w-full h-full object-cover"
/></div></div><!-- Product Info --><div class="md:col-span-7 flex flex-col justify-between space-y-5"><div class="space-y-3"><div class="flex flex-wrap items-center gap-2">
${
product.is_popular
? `<span class="px-3 py-1 rounded-full bg-[#F5C84C] text-[#633D25] text-xs font-extrabold">ðŸ”¥ Produk Populer</span>`
: ''
}
<span class="px-3 py-1 rounded-full bg-[#557447]/15 text-[#557447] text-xs font-bold">
Berat Bersih: ${product.weight_grams} gram
</span><span class="px-3 py-1 rounded-full bg-[#FFF5DF] text-[#633D25] text-xs font-bold">
Terjual ${product.sold_count}+ pouch
</span></div><h2 class="font-display text-2xl sm:text-3xl font-extrabold text-[#633D25]">${escapeHtml(product.name)}</h2><div class="text-3xl font-extrabold text-[#557447]">${formatRp(product.price)}</div><p class="text-sm text-[#633D25]/80 leading-relaxed">${escapeHtml(product.description)}</p><div class="p-3.5 rounded-2xl bg-[#FFF5DF] border border-[#633D25]/10 flex items-center justify-between"><span class="text-xs font-bold text-[#633D25]">Ketersediaan Stok Gudang:</span><span class="text-xs font-extrabold ${product.stock > 0 ? 'text-[#557447]' : 'text-red-600'}">
${product.stock > 0 ? `${product.stock} Pouch Tersedia` : 'Stok Habis'}
</span></div></div><!-- Quantity Selector & Add to Cart --><div class="space-y-4 pt-3 border-t border-[#633D25]/10"><div class="flex items-center justify-between"><span class="text-xs font-extrabold text-[#633D25]">Jumlah Pembelian:</span><div class="flex items-center gap-3 bg-[#FFF5DF] px-3 py-1.5 rounded-xl border border-[#633D25]/15"><button
type="button"
onclick="window.SaleeApp.changeDetailQty(-1)"
class="w-7 h-7 rounded-lg bg-white text-[#633D25] font-extrabold flex items-center justify-center shadow-sm cursor-pointer"
>-</button><span class="font-extrabold text-sm w-8 text-center text-[#633D25]">${state.detailQty}</span><button
type="button"
onclick="window.SaleeApp.changeDetailQty(1)"
class="w-7 h-7 rounded-lg bg-white text-[#633D25] font-extrabold flex items-center justify-center shadow-sm cursor-pointer"
>+</button></div></div><div class="flex flex-wrap gap-3"><button
type="button"
${product.stock <= 0 ? 'disabled' : `onclick="window.SaleeApp.addDetailToCart(false)"`}
class="flex-1 py-3.5 px-5 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
><i data-lucide="shopping-cart" class="w-4 h-4 text-[#F5C84C]"></i><span>Tambah ke Keranjang (${formatRp(product.price * state.detailQty)})</span></button><button
type="button"
${product.stock <= 0 ? 'disabled' : `onclick="window.SaleeApp.addDetailToCart(true)"`}
class="py-3.5 px-5 rounded-2xl bg-[#F5C84C] hover:bg-amber-300 text-[#633D25] font-extrabold text-sm transition cursor-pointer"
>
Beli Sekarang
</button></div></div><!-- Rekomendasi Produk Lainnya --><div class="pt-4 border-t border-[#633D25]/10"><h4 class="text-xs font-extrabold uppercase tracking-wider text-[#633D25]/70 mb-3">Rekomendasi Produk Lainnya</h4><div class="grid grid-cols-3 gap-3">
${recommendations
.map(
(rec) => `
<div
onclick="window.SaleeApp.openProductDetail('${rec.id}')"
class="p-2.5 rounded-2xl bg-[#FFF5DF]/60 hover:bg-[#FFF5DF] border border-[#633D25]/10 cursor-pointer transition flex items-center gap-2.5"
><img src="${escapeHtml(rec.image_url)}" class="w-11 h-11 rounded-xl object-cover shrink-0" /><div class="min-w-0"><div class="text-xs font-extrabold text-[#633D25] truncate">${escapeHtml(rec.name)}</div><div class="text-[11px] font-bold text-[#557447]">${formatRp(rec.price)}</div></div></div>
`
)
.join('')}
</div></div></div></div></div></div>
`;
}
function renderCartDrawer() {
if (!state.cartDrawerOpen) return '';
const summary = getCartSummary();
return `
<div class="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs"><div class="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl"><!-- Drawer Header --><div class="p-5 bg-[#633D25] text-white flex items-center justify-between"><div class="flex items-center gap-2.5"><i data-lucide="shopping-bag" class="w-5 h-5 text-[#F5C84C]"></i><div><h3 class="font-display font-extrabold text-lg">Keranjang Belanja</h3><p class="text-xs text-[#FFF5DF]/75">${summary.totalQty} produk dipilih</p></div></div><button
type="button"
onclick="window.SaleeApp.toggleCart(false)"
class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
><i data-lucide="x" class="w-5 h-5"></i></button></div><!-- Free Shipping Progress --><div class="px-5 py-3 bg-[#FFF5DF] border-b border-[#633D25]/10 text-xs font-bold text-[#633D25]">
${
summary.amountToFreeShipping === 0 && summary.items.length > 0
? `<span class="text-[#557447] flex items-center gap-1.5"><i data-lucide="party-popper" class="w-4 h-4"></i> Selamat! Pesanan Anda mendapat Gratis Ongkos Kirim!</span>`
: `Tambah belanja <strong>${formatRp(summary.amountToFreeShipping)}</strong> lagi untuk mendapatkan <strong>Gratis Ongkir!</strong>`
}
</div><!-- Cart Items List --><div class="flex-1 overflow-y-auto p-5 space-y-4">
${
summary.items.length === 0
? `
<div class="text-center py-16 space-y-3"><div class="w-16 h-16 rounded-3xl bg-[#FFF5DF] text-[#633D25] flex items-center justify-center mx-auto"><i data-lucide="shopping-cart" class="w-8 h-8"></i></div><h4 class="font-display font-extrabold text-base text-[#633D25]">Keranjang Masih Kosong</h4><p class="text-xs text-[#633D25]/70 max-w-xs mx-auto">Yuk pilih varian Keripik Pisang Salee favoritmu di katalog produk!</p></div>
`
: summary.items
.map(
(item) => `
<div class="p-3.5 rounded-2xl bg-[#FFF5DF]/50 border border-[#633D25]/10 flex gap-3.5 items-center"><img
src="${escapeHtml(item.product.image_url)}"
alt="${escapeHtml(item.product.name)}"
class="w-16 h-16 rounded-xl object-cover shrink-0 border border-white"
/><div class="flex-1 min-w-0"><h4 class="font-extrabold text-sm text-[#633D25] truncate">${escapeHtml(item.product.name)}</h4><div class="text-xs text-[#633D25]/70">${formatRp(item.product.price)} / pouch</div><div class="text-xs font-extrabold text-[#557447] mt-0.5">Subtotal: ${formatRp(item.subtotal)}</div></div><div class="flex flex-col items-end gap-2"><button
type="button"
onclick="window.SaleeApp.removeFromCart('${item.product_id}')"
class="text-red-500 hover:text-red-700 p-1 cursor-pointer"
title="Hapus produk"
><i data-lucide="trash-2" class="w-4 h-4"></i></button><div class="flex items-center gap-1.5 bg-white px-2 py-1 rounded-xl border border-[#633D25]/15"><button
type="button"
onclick="window.SaleeApp.updateCartQty('${item.product_id}', -1)"
class="w-6 h-6 rounded-lg bg-[#FFF5DF] text-[#633D25] font-extrabold text-xs flex items-center justify-center cursor-pointer"
>-</button><span class="text-xs font-extrabold w-6 text-center text-[#633D25]">${item.quantity}</span><button
type="button"
onclick="window.SaleeApp.updateCartQty('${item.product_id}', 1)"
class="w-6 h-6 rounded-lg bg-[#FFF5DF] text-[#633D25] font-extrabold text-xs flex items-center justify-center cursor-pointer"
>+</button></div></div></div>
`
)
.join('')
}
</div><!-- Cart Footer Totals & Checkout CTA --><div class="p-5 bg-[#FFF5DF] border-t border-[#633D25]/15 space-y-3"><div class="space-y-1.5 text-xs sm:text-sm"><div class="flex justify-between text-[#633D25]/80"><span>Subtotal Produk (${summary.totalQty} pouch)</span><span class="font-bold">${formatRp(summary.subtotal)}</span></div><div class="flex justify-between text-[#633D25]/80"><span>Estimasi Ongkos Kirim</span><span class="font-bold">${summary.shipping === 0 && summary.items.length > 0 ? 'GRATIS' : formatRp(summary.shipping)}</span></div><div class="flex justify-between text-base font-extrabold text-[#633D25] pt-2 border-t border-[#633D25]/10"><span>Total Belanja</span><span class="text-[#557447]">${formatRp(summary.total)}</span></div></div><button
type="button"
${summary.items.length === 0 ? 'disabled' : 'onclick="window.SaleeApp.openCheckout()"'}
class="w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
summary.items.length === 0
? 'bg-gray-300 text-gray-500 cursor-not-allowed'
: 'bg-[#633D25] hover:bg-[#4e2f1c] text-white shadow-lg'
}"
><i data-lucide="credit-card" class="w-4 h-4 text-[#F5C84C]"></i><span>Lanjut ke Checkout</span></button></div></div></div>
`;
}
function renderCheckoutModal() {
if (!state.checkoutOpen) return '';
const summary = getCartSummary();
const s = state.db.settings;
return `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"><div class="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-2 border-[#633D25]/15 my-8"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><div class="flex items-center gap-2.5"><i data-lucide="shield-check" class="w-5 h-5 text-[#F5C84C]"></i><h3 class="font-display font-extrabold text-lg">Formulir Checkout & Pengiriman</h3></div><button
type="button"
onclick="window.SaleeApp.closeCheckout()"
class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
><i data-lucide="x" class="w-5 h-5"></i></button></div><form onsubmit="window.SaleeApp.submitCheckout(event)" class="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[84vh] overflow-y-auto"><!-- Left: Customer Form --><div class="lg:col-span-7 space-y-4"><h4 class="font-display font-extrabold text-base text-[#633D25] border-b border-[#633D25]/10 pb-2">1. Informasi Pengiriman Pelanggan</h4><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Pelanggan *</label><input
type="text"
name="customerName"
required
value="${state.currentUser ? escapeHtml(state.currentUser.full_name) : ''}"
placeholder="Masukkan nama lengkap penerima"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nomor WhatsApp Aktif *</label><input
type="tel"
name="customerWhatsapp"
required
value="${state.currentUser ? escapeHtml(state.currentUser.phone) : ''}"
placeholder="Contoh: 081234567890"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Alamat Lengkap Pengiriman *</label><textarea
name="shippingAddress"
rows="3"
required
placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, kota, dan kode pos"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
></textarea></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Catatan Pesanan (Opsional)</label><input
type="text"
name="notes"
placeholder="Contoh: Tolong bungkus bubble wrap tebal untuk oleh-oleh"
class="w-full px-4 py-3 rounded-xl bg-[#FFF5DF]/60 border border-[#633D25]/20 text-sm text-[#633D25] focus:outline-none focus:ring-2 focus:ring-[#F5C84C]"
/></div><h4 class="font-display font-extrabold text-base text-[#633D25] border-b border-[#633D25]/10 pb-2 pt-2">2. Pilih Metode Pembayaran</h4><div class="space-y-2.5"><label class="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF5DF]/70 border-2 border-[#633D25]/20 cursor-pointer hover:border-[#633D25]"><input type="radio" name="paymentMethod" value="Transfer Bank" checked class="mt-1 accent-[#633D25]" /><div class="text-xs"><div class="font-extrabold text-sm text-[#633D25]">Transfer Bank (${escapeHtml(s.bank_name)})</div><div class="text-[#633D25]/75 mt-0.5">No. Rek: <strong>${escapeHtml(s.bank_account)}</strong> a.n ${escapeHtml(s.bank_holder)}</div></div></label>
${
s.cod_enabled
? `
<label class="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF5DF]/70 border-2 border-[#633D25]/20 cursor-pointer hover:border-[#633D25]"><input type="radio" name="paymentMethod" value="COD" class="mt-1 accent-[#633D25]" /><div class="text-xs"><div class="font-extrabold text-sm text-[#633D25]">COD (Bayar di Tempat)</div><div class="text-[#633D25]/75 mt-0.5">Bayar tunai langsung ke kurir saat paket Keripik Pisang Salee tiba di rumah Anda.</div></div></label>
`
: ''
}
<label class="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FFF5DF]/70 border-2 border-[#633D25]/20 cursor-pointer hover:border-[#633D25]"><input type="radio" name="paymentMethod" value="WhatsApp" class="mt-1 accent-[#633D25]" /><div class="text-xs"><div class="font-extrabold text-sm text-[#633D25]">Konfirmasi Pesanan melalui WhatsApp</div><div class="text-[#633D25]/75 mt-0.5">Pesanan tercatat otomatis di sistem & diteruskan ke WhatsApp Admin resmi kami.</div></div></label></div></div><!-- Right: Order Summary --><div class="lg:col-span-5 flex flex-col justify-between bg-[#FFF5DF] rounded-3xl p-6 border border-[#633D25]/15 space-y-6"><div class="space-y-4"><h4 class="font-display font-extrabold text-base text-[#633D25]">Ringkasan Pesanan (${summary.totalQty} Pouch)</h4><div class="space-y-3 max-h-60 overflow-y-auto pr-1">
${summary.items
.map(
(i) => `
<div class="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#633D25]/10"><div class="flex items-center gap-2.5 min-w-0"><img src="${escapeHtml(i.product.image_url)}" class="w-11 h-11 rounded-xl object-cover shrink-0" /><div class="min-w-0"><div class="text-xs font-extrabold text-[#633D25] truncate">${escapeHtml(i.product.name)}</div><div class="text-[11px] text-[#633D25]/70">${i.quantity} x ${formatRp(i.product.price)}</div></div></div><div class="text-xs font-extrabold text-[#633D25] shrink-0">${formatRp(i.subtotal)}</div></div>
`
)
.join('')}
</div><div class="space-y-2 pt-3 border-t border-[#633D25]/15 text-xs sm:text-sm"><div class="flex justify-between text-[#633D25]/80"><span>Subtotal Produk</span><span class="font-bold">${formatRp(summary.subtotal)}</span></div><div class="flex justify-between text-[#633D25]/80"><span>Biaya Pengiriman</span><span class="font-bold">${summary.shipping === 0 ? 'GRATIS' : formatRp(summary.shipping)}</span></div><div class="flex justify-between text-lg font-extrabold text-[#633D25] pt-2 border-t border-[#633D25]/15"><span>Total Pembayaran</span><span class="text-[#557447]">${formatRp(summary.total)}</span></div></div></div><button
type="submit"
class="w-full py-4 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition cursor-pointer"
><i data-lucide="check-circle-2" class="w-5 h-5 text-[#F5C84C]"></i><span>Buat Pesanan Sekarang</span></button></div></form></div></div>
`;
}
function renderOrderSuccessModal() {
if (!state.orderSuccessData) return '';
const d = state.orderSuccessData;
const s = state.db.settings;
const waText = encodeURIComponent(
`Halo Admin *${s.store_name}*! Saya ingin mengonfirmasi pesanan saya:\n\n` +
`â€¢ No. Pesanan: *${d.orderNumber}*\n` +
`â€¢ Nama: ${d.customerName}\n` +
`â€¢ Metode Bayar: ${d.paymentMethod}\n` +
`â€¢ Total: *${formatRp(d.totalAmount)}*\n` +
`â€¢ Alamat: ${d.shippingAddress}\n\nMohon segera diproses ya kak, terima kasih!`
);
const waUrl = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${waText}`;
return `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto"><div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center shadow-2xl border-4 border-[#F5C84C] space-y-5"><div class="w-20 h-20 rounded-full bg-[#557447]/15 text-[#557447] flex items-center justify-center mx-auto"><i data-lucide="check-circle-2" class="w-12 h-12"></i></div><div class="space-y-1"><span class="px-3 py-1 rounded-full bg-[#F5C84C] text-[#633D25] text-xs font-extrabold uppercase">Checkout Berhasil</span><h3 class="font-display text-2xl font-extrabold text-[#633D25] pt-1">Terima Kasih, ${escapeHtml(d.customerName)}!</h3><p class="text-xs sm:text-sm text-[#633D25]/75">Pesanan Anda telah tercatat di database kami dan siap diproses.</p></div><div class="p-4 rounded-2xl bg-[#FFF5DF] border border-[#633D25]/15 text-left space-y-2 text-xs sm:text-sm"><div class="flex justify-between"><span class="text-[#633D25]/70">Nomor Pesanan:</span><span class="font-extrabold text-[#633D25] font-mono">${escapeHtml(d.orderNumber)}</span></div><div class="flex justify-between"><span class="text-[#633D25]/70">Metode Pembayaran:</span><span class="font-bold text-[#633D25]">${escapeHtml(d.paymentMethod)}</span></div><div class="flex justify-between"><span class="text-[#633D25]/70">Total Pembayaran:</span><span class="font-extrabold text-[#557447] text-base">${formatRp(d.totalAmount)}</span></div>
${
d.paymentMethod === 'Transfer Bank'
? `
<div class="pt-2 mt-2 border-t border-[#633D25]/10 text-xs text-[#633D25]">
Silakan transfer ke <strong>${escapeHtml(s.bank_name)} ${escapeHtml(s.bank_account)}</strong> a.n ${escapeHtml(s.bank_holder)}.
</div>
`
: ''
}
</div><div class="flex flex-col sm:flex-row gap-3 pt-2"><a
href="${waUrl}"
target="_blank"
rel="noopener noreferrer"
class="flex-1 py-3.5 px-4 rounded-2xl bg-[#557447] hover:bg-[#445e38] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md"
><i data-lucide="message-circle" class="w-4 h-4"></i><span>Konfirmasi via WhatsApp</span></a><button
type="button"
onclick="window.SaleeApp.closeOrderSuccess()"
class="py-3.5 px-5 rounded-2xl bg-[#633D25] hover:bg-[#4e2f1c] text-white font-extrabold text-xs sm:text-sm cursor-pointer"
>
Selesai & Lanjut Belanja
</button></div></div></div>
`;
}
function renderAuthModal() {
if (!state.authModalOpen) return '';
return `
<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-[#633D25]/15"><div class="px-6 py-4 bg-[#633D25] text-white flex items-center justify-between"><div class="flex items-center gap-2"><i data-lucide="lock" class="w-5 h-5 text-[#F5C84C]"></i><h3 class="font-display font-extrabold text-lg">Akses Akun & Demo RBAC</h3></div><button
type="button"
onclick="window.SaleeApp.closeAuthModal()"
class="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
><i data-lucide="x" class="w-5 h-5"></i></button></div><div class="p-6 space-y-5"><!-- Instant 1-Click Demo Buttons --><div class="p-4 rounded-2xl bg-[#FFF5DF] border border-[#F5C84C] space-y-2.5"><div class="text-xs font-extrabold text-[#633D25] uppercase tracking-wider">Login Cepat Mode Demo:</div><div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5"><button
type="button"
onclick="window.SaleeApp.loginDemoAdmin()"
class="py-2.5 px-3 rounded-xl bg-[#633D25] hover:bg-[#4e2f1c] text-[#F5C84C] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
><i data-lucide="shield" class="w-4 h-4"></i><span>Masuk Admin UMKM</span></button><button
type="button"
onclick="window.SaleeApp.loginDemoCustomer()"
class="py-2.5 px-3 rounded-xl bg-[#557447] hover:bg-[#445e38] text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer"
><i data-lucide="user" class="w-4 h-4"></i><span>Masuk Pelanggan</span></button></div></div><!-- Form Manual --><form onsubmit="window.SaleeApp.submitAuth(event)" class="space-y-3.5"><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Nama Lengkap</label><input
type="text"
name="fullName"
placeholder="Contoh: Budi Santoso"
class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/50 border border-[#633D25]/20 text-sm"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Email *</label><input
type="email"
name="email"
required
value="admin@pisangsalee.id"
class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/50 border border-[#633D25]/20 text-sm"
/></div><div><label class="block text-xs font-extrabold text-[#633D25] mb-1">Role Akses</label><select
name="role"
class="w-full px-4 py-2.5 rounded-xl bg-[#FFF5DF]/50 border border-[#633D25]/20 text-sm font-bold text-[#633D25]"
><option value="admin">Admin / Pemilik Usaha (Full Dashboard Access)</option><option value="customer">Pelanggan (Customer Storefront)</option></select></div><button
type="submit"
class="w-full py-3 rounded-2xl bg-[#633D25] text-white font-extrabold text-sm cursor-pointer"
>
Masuk Sekarang
</button></form></div></div></div>
`;
}
function getAdminStats() {
const validOrders = state.db.orders.filter((o) => o.status !== 'Dibatalkan');
const completedOrders = state.db.orders.filter((o) => o.status === 'Selesai');
const pendingOrders = state.db.orders.filter((o) => o.status === 'Menunggu Pembayaran');
const totalSales = validOrders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
const completedRevenue = completedOrders.reduce((acc, o) => acc + (Number(o.total_amount) || 0), 0);
const lowStockProducts = state.db.products.filter((p) => p.stock <= p.min_stock);
const outOfStockProducts = state.db.products.filter((p) => p.stock <= 0);
let totalUnitsSold = 0;
validOrders.forEach((o) => {
const items = state.db.order_items.filter((oi) => oi.order_id === o.id);
items.forEach((i) => {
totalUnitsSold += Number(i.quantity) || 0;
});
});
return {
totalSales,
completedRevenue,
totalOrders: state.db.orders.length,
validOrdersCount: validOrders.length,
pendingOrdersCount: pendingOrders.length,
totalProducts: state.db.products.length,
totalCustomers: state.db.customers.length,
lowStockProducts,
outOfStockProducts,
totalUnitsSold,
avgOrderValue: validOrders.length > 0 ? Math.round(totalSales / validOrders.length) : 0,
};
}
function renderInteractiveSalesChart() {
const isDaily = state.chartPeriod === 'daily';
const dataPoints = isDaily
? [
{ label: '12 Nov', value: 132000, orders: 1 },
{ label: '13 Nov', value: 95000, orders: 1 },
{ label: '14 Nov', value: 152000, orders: 1 },
{ label: '15 Nov', value: 194000, orders: 1 },
{ label: '16 Nov', value: 198000, orders: 1 },
{ label: '17 Nov', value: 154000, orders: 1 },
{
label: '18 Nov',
value: state.db.orders
.filter((o) => o.created_at.startsWith('2026-11-18') && o.status !== 'Dibatalkan')
.reduce((a, b) => a + b.total_amount, 0),
orders: state.db.orders.filter((o) => o.created_at.startsWith('2026-11-18')).length,
},
]
: [
{ label: 'Jun', value: 2450000, orders: 18 },
{ label: 'Jul', value: 3120000, orders: 24 },
{ label: 'Agu', value: 3890000, orders: 29 },
{ label: 'Sep', value: 4250000, orders: 33 },
{ label: 'Okt', value: 5180000, orders: 41 },
{
label: 'Nov',
value:
4850000 +
state.db.orders
.filter((o) => o.status !== 'Dibatalkan')
.reduce((a, b) => a + b.total_amount, 0),
orders: 35 + state.db.orders.length,
},
];
const maxVal = Math.max(...dataPoints.map((d) => d.value), 100000);
const chartWidth = 640;
const chartHeight = 210;
const padX = 42;
const padY = 24;
const usableW = chartWidth - padX * 2;
const usableH = chartHeight - padY * 2;
const coords = dataPoints.map((d, idx) => {
const x = padX + (idx / Math.max(1, dataPoints.length - 1)) * usableW;
const y = padY + usableH - (d.value / maxVal) * usableH;
return { x, y, ...d };
});
const polylinePoints = coords.map((c) => `${c.x},${c.y}`).join(' ');
const areaPoints = `${coords[0].x},${padY + usableH} ${polylinePoints} ${coords[coords.length - 1].x},${padY + usableH}`;
return `
<div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3 mb-5"><div><h3 class="font-display font-extrabold text-base sm:text-lg text-[#633D25]">Grafik Penjualan ${isDaily ? 'Harian (7 Hari Terakhir)' : 'Bulanan (6 Bulan Terakhir)'}</h3><p class="text-xs text-[#633D25]/65">Tren omzet pendapatan Keripik Pisang Salee secara real-time</p></div><div class="inline-flex rounded-xl bg-[#FFF5DF] p-1 border border-[#633D25]/10"><button
type="button"
onclick="window.SaleeApp.setChartPeriod('daily')"
class="px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
isDaily ? 'bg-[#633D25] text-[#F5C84C]' : 'text-[#633D25]'
}"
>Harian</button><button
type="button"
onclick="window.SaleeApp.setChartPeriod('monthly')"
class="px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
!isDaily ? 'bg-[#633D25] text-[#F5C84C]' : 'text-[#633D25]'
}"
>Bulanan</button></div></div><div class="w-full overflow-x-auto"><svg viewBox="0 0 ${chartWidth} ${chartHeight + 25}" class="w-full h-60 overflow-visible"><defs><linearGradient id="saleeAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F5C84C" stop-opacity="0.65" /><stop offset="100%" stop-color="#F5C84C" stop-opacity="0.02" /></linearGradient></defs><!-- Grid lines -->
${[0, 0.25, 0.5, 0.75, 1]
.map((ratio) => {
const y = padY + ratio * usableH;
return `<line x1="${padX}" y1="${y}" x2="${chartWidth - padX}" y2="${y}" stroke="#633D25" stroke-opacity="0.08" stroke-dasharray="4 4" />`;
})
.join('')}
<!-- Polygon Area --><polygon points="${areaPoints}" fill="url(#saleeAreaGrad)" /><!-- Line --><polyline fill="none" stroke="#633D25" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" points="${polylinePoints}" /><!-- Data Nodes & Labels -->
${coords
.map(
(c) => `
<g class="group"><circle cx="${c.x}" cy="${c.y}" r="6" fill="#F5C84C" stroke="#633D25" stroke-width="2.5" /><text x="${c.x}" y="${c.y - 12}" text-anchor="middle" font-size="10" font-weight="700" fill="#633D25">
${formatRp(c.value).replace('Rp', '').trim()}
</text><text x="${c.x}" y="${padY + usableH + 20}" text-anchor="middle" font-size="11" font-weight="700" fill="#633D25">
${c.label}
</text></g>
`
)
.join('')}
</svg></div></div>
`;
}
function renderBestSellerChart() {
const sorted = [...state.db.products].sort((a, b) => (b.sold_count || 0) - (a.sold_count || 0)).slice(0, 5);
const maxSold = Math.max(...sorted.map((p) => p.sold_count || 1), 10);
return `
<div class="bg-white rounded-3xl p-6 border border-[#633D25]/10 shadow-sm flex flex-col justify-between"><div><div class="flex items-center justify-between mb-4"><div><h3 class="font-display font-extrabold text-base sm:text-lg text-[#633D25]">Grafik Produk Terlaris</h3><p class="text-xs text-[#633D25]/65">Top 5 varian berdasarkan jumlah pouch terjual</p></div><span class="p-2 rounded-xl bg-[#F5C84C]/30 text-[#633D25]"><i data-lucide="bar-chart-3" class="w-5 h-5"></i></span></div><div class="space-y-3.5 mt-2">
${sorted
.map((p, idx) => {
const pct = Math.min(100, Math.round(((p.sold_count || 0) / maxSold) * 100));
const barColors = ['bg-[#633D25]', 'bg-[#557447]', 'bg-[#d97706]', 'bg-[#8f4526]', 'bg-[#633D25]/80'];
return `
<div class="space-y-1"><div class="flex items-center justify-between text-xs"><span class="font-extrabold text-[#633D25] truncate pr-2">${idx + 1}. ${escapeHtml(p.name)}</span><span class="font-extrabold text-[#557447] shrink-0">${p.sold_count} pouch</span></div><div class="w-full h-3 rounded-full bg-[#FFF5DF] overflow-hidden"><div class="h-full rounded-full ${barColors[idx % barColors.length]}" style="width: ${pct}%"></div></div></div>
`;
})
.join('')}
</div></div><div class="mt-5 pt-4 border-t border-[#633D25]/10 flex items-center justify-between text-xs text-[#633D25]/75"><span>Varian Unggulan Utama:</span><span class="font-extrabold text-[#633D25]">${sorted[0] ? escapeHtml(sorted[0].name) : '-'}</span></div></div>
`;
}
