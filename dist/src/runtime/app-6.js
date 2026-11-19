function renderAdminFullView() {
const menus = [
{ id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
{ id: 'products', label: 'Manajemen Produk', icon: 'package' },
{ id: 'categories', label: 'Kategori Produk', icon: 'tags' },
{ id: 'stock', label: 'Manajemen Stok', icon: 'boxes' },
{ id: 'orders', label: 'Pesanan', icon: 'shopping-cart', badge: state.db.orders.filter((o) => o.status === 'Menunggu Pembayaran').length },
{ id: 'customers', label: 'Pelanggan', icon: 'users' },
{ id: 'reports', label: 'Laporan Penjualan', icon: 'bar-chart-3' },
{ id: 'settings', label: 'Pengaturan', icon: 'settings' },
];
let activeContent = '';
if (state.adminTab === 'dashboard') activeContent = renderAdminDashboardOverview();
else if (state.adminTab === 'products') activeContent = renderAdminProductsTab();
else if (state.adminTab === 'categories') activeContent = renderAdminCategoriesTab();
else if (state.adminTab === 'stock') activeContent = renderAdminStockTab();
else if (state.adminTab === 'orders') activeContent = renderAdminOrdersTab();
else if (state.adminTab === 'customers') activeContent = renderAdminCustomersTab();
else if (state.adminTab === 'reports') activeContent = renderAdminReportsTab();
else if (state.adminTab === 'settings') activeContent = renderAdminSettingsTab();
const activeMenuTitle = (menus.find((m) => m.id === state.adminTab) || menus[0]).label;
return `
<div class="min-h-screen flex bg-[#FFF5DF]/60 text-[#633D25]"><!-- Sidebar Desktop & Mobile --><aside class="w-72 bg-[#633D25] text-white flex-col justify-between p-6 shrink-0 hidden lg:flex sticky top-0 h-screen"><div class="space-y-6"><!-- Brand Header --><div class="flex items-center gap-3 pb-5 border-b border-white/15"><div class="w-11 h-11 rounded-2xl bg-[#F5C84C] text-[#633D25] flex items-center justify-center font-extrabold shadow"><i data-lucide="shield-check" class="w-6 h-6"></i></div><div><div class="font-display font-extrabold text-base text-white leading-tight">Keripik Pisang <span class="text-[#F5C84C]">Salee</span></div><div class="text-[11px] text-[#FFF5DF]/70 font-semibold">Dashboard Manajemen UMKM</div></div></div><!-- 8 Menu Items --><nav class="space-y-1.5">
${menus
.map((m) => {
const isActive = state.adminTab === m.id;
return `
<button
type="button"
onclick="window.SaleeApp.setAdminTab('${m.id}')"
class="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
isActive
? 'bg-[#F5C84C] text-[#633D25] shadow-lg'
: 'text-[#FFF5DF]/80 hover:bg-white/10 hover:text-white'
}"
><span class="flex items-center gap-3"><i data-lucide="${m.icon}" class="w-4 h-4"></i><span>${m.label}</span></span>
${
m.badge
? `<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
isActive ? 'bg-[#633D25] text-[#F5C84C]' : 'bg-[#F5C84C] text-[#633D25]'
}">${m.badge}</span>`
: ''
}
</button>
`;
})
.join('')}
</nav></div><!-- Bottom Sidebar: Back to Store & 9. Logout --><div class="space-y-2 pt-4 border-t border-white/15"><button
type="button"
onclick="window.SaleeApp.switchToStore()"
class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#557447] hover:bg-[#466039] text-white text-xs font-extrabold transition cursor-pointer"
><i data-lucide="store" class="w-4 h-4 text-[#F5C84C]"></i><span>Lihat Website Pelanggan</span></button><button
type="button"
onclick="window.SaleeApp.logout()"
class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-extrabold transition cursor-pointer"
><i data-lucide="log-out" class="w-4 h-4"></i><span>9. Logout Sesi Admin</span></button></div></aside><!-- Main Content Area --><div class="flex-1 flex flex-col min-w-0"><!-- Admin Topbar --><header class="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#633D25]/10 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4"><div class="flex items-center gap-3"><div><span class="text-[11px] font-extrabold uppercase tracking-wider text-[#557447] block">Sistem ERP & E-Commerce Terpadu</span><h1 class="font-display text-xl sm:text-2xl font-extrabold text-[#633D25]">${activeMenuTitle}</h1></div></div><div class="flex items-center gap-3"><button
type="button"
onclick="window.SaleeApp.switchToStore()"
class="px-4 py-2.5 rounded-xl bg-[#FFF5DF] hover:bg-[#F5C84C] text-[#633D25] font-extrabold text-xs inline-flex items-center gap-2 border border-[#633D25]/15 cursor-pointer"
><i data-lucide="external-link" class="w-4 h-4"></i><span>Website Toko</span></button><div class="hidden sm:flex items-center gap-2.5 pl-3 border-l border-[#633D25]/15"><div class="w-9 h-9 rounded-xl bg-[#633D25] text-[#F5C84C] flex items-center justify-center font-extrabold text-xs">
AD
</div><div class="text-xs"><div class="font-extrabold text-[#633D25]">${state.currentUser ? escapeHtml(state.currentUser.full_name) : 'Owner Salee'}</div><div class="text-[10px] text-[#557447] font-bold">Role: Administrator</div></div></div></div><!-- Mobile Admin Navigation Pills --><div class="w-full flex lg:hidden items-center gap-1.5 overflow-x-auto pt-2 border-t border-[#633D25]/10">
${menus
.map(
(m) => `
<button
type="button"
onclick="window.SaleeApp.setAdminTab('${m.id}')"
class="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap ${
state.adminTab === m.id ? 'bg-[#633D25] text-[#F5C84C]' : 'bg-[#FFF5DF] text-[#633D25]'
}"
>${m.label}</button>
`
)
.join('')}
<button
type="button"
onclick="window.SaleeApp.logout()"
class="px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap bg-red-100 text-red-700"
>Logout</button></div></header><!-- Main Body --><main class="p-4 sm:p-8 flex-1">
${activeContent}
</main></div>
${renderAdminModals()}
</div>
`;
}
function renderApp() {
const root = document.getElementById('appRoot');
if (!root) return;
if (state.viewMode === 'admin') {
root.innerHTML = renderAdminFullView();
} else {
root.innerHTML = `
<div class="min-h-screen flex flex-col bg-[#FFF5DF] text-[#633D25]">
${renderNavbar()}
<main class="flex-1">
${renderHeroSection()}
${renderCategorySection()}
${renderCatalogSection()}
${renderAboutSection()}
${renderContactSection()}
</main>
${renderFooter()}
${renderProductDetailModal()}
${renderCartDrawer()}
${renderCheckoutModal()}
${renderOrderSuccessModal()}
${renderAuthModal()}
</div>
`;
}
refreshIcons();
}
window.SaleeApp = {
render: renderApp,
addToCart,
updateCartQty: function (productId, delta) {
updateCartQuantity(productId, delta, false);
},
removeFromCart,
toggleCart: function (open) {
state.cartDrawerOpen = Boolean(open);
renderApp();
},
toggleMobileMenu: function (force) {
state.mobileMenuOpen = typeof force === 'boolean' ? force : !state.mobileMenuOpen;
renderApp();
},
selectCategory: function (catId) {
state.selectedCategory = catId;
renderApp();
const el = document.getElementById('produk');
if (el) el.scrollIntoView({ behavior: 'smooth' });
},
setSearchQuery: function (q) {
state.searchQuery = q;
renderApp();
const inputs = document.querySelectorAll('input[placeholder="Cari rasa keripik pisang..."]');
if (inputs.length > 0) {
const input = inputs[0];
input.focus();
input.setSelectionRange(input.value.length, input.value.length);
}
},
setSortBy: function (val) {
state.sortBy = val;
renderApp();
},
resetCatalogFilter: function () {
state.selectedCategory = 'ALL';
state.searchQuery = '';
state.sortBy = 'popular';
renderApp();
},
openProductDetail,
closeProductDetail,
changeDetailQty: function (delta) {
const product = getProductById(state.detailProductId);
if (!product) return;
const next = state.detailQty + delta;
state.detailQty = Math.max(1, Math.min(product.stock || 1, next));
renderApp();
},
addDetailToCart: function (openCheckoutImmediately) {
if (!state.detailProductId) return;
const pid = state.detailProductId;
const qty = state.detailQty;
state.detailProductId = null;
addToCart(pid, qty);
if (openCheckoutImmediately) {
state.checkoutOpen = true;
renderApp();
}
},
openCheckout: openCheckoutModal,
closeCheckout: function () {
state.checkoutOpen = false;
renderApp();
},
submitCheckout: handleCheckoutSubmit,
closeOrderSuccess: function () {
state.orderSuccessData = null;
renderApp();
},
submitContact: handleContactSubmit,
openAuthModal: function () {
state.authModalOpen = true;
renderApp();
},
closeAuthModal: function () {
state.authModalOpen = false;
renderApp();
},
loginDemoAdmin: loginAsDemoAdmin,
loginDemoCustomer: loginAsDemoCustomer,
submitAuth: handleAuthSubmit,
logout: handleLogout,
openAdmin: function () {
if (!state.currentUser || state.currentUser.role !== 'admin') {
state.currentUser = state.db.users.find((u) => u.role === 'admin') || {
id: 'usr-admin-01',
email: 'admin@pisangsalee.id',
full_name: 'Budi Santoso (Owner Salee)',
phone: '081234567890',
role: 'admin',
};
persistAll();
showToast('Masuk otomatis ke Dashboard Admin (Mode Demo Owner).');
}
state.viewMode = 'admin';
window.scrollTo({ top: 0, behavior: 'smooth' });
renderApp();
},
switchToStore: function () {
state.viewMode = 'store';
window.scrollTo({ top: 0, behavior: 'smooth' });
renderApp();
},
setAdminTab: function (tabId) {
state.adminTab = tabId;
window.scrollTo({ top: 0, behavior: 'smooth' });
renderApp();
},
setChartPeriod: function (period) {
state.chartPeriod = period;
renderApp();
},
setAdminProductSearch: function (q) {
state.adminProductSearch = q;
renderApp();
const inputs = document.querySelectorAll('input[placeholder="Cari nama produk atau SKU..."]');
if (inputs.length > 0) {
const input = inputs[0];
input.focus();
input.setSelectionRange(input.value.length, input.value.length);
}
},
setAdminProductCatFilter: function (catId) {
state.adminProductCatFilter = catId;
renderApp();
},
openProductModal,
closeProductModal: function () {
state.productModalOpen = false;
state.editingProduct = null;
renderApp();
},
saveProduct: handleSaveProduct,
deleteProduct: handleDeleteProduct,
handleImageUpload: handleImageUploadChange,
openCategoryModal,
closeCategoryModal: function () {
state.categoryModalOpen = false;
state.editingCategory = null;
renderApp();
},
saveCategory: handleSaveCategory,
deleteCategory: handleDeleteCategory,
openStockModal,
openQuickRestock: function (productId) {
state.adminTab = 'stock';
openStockModal(productId);
},
closeStockModal: function () {
state.stockModalOpen = false;
renderApp();
},
saveStockMovement: handleSaveStockMovement,
setStockFilterType: function (t) {
state.stockFilterType = t;
renderApp();
},
setAdminOrderStatusFilter: function (st) {
state.adminOrderStatusFilter = st;
renderApp();
},
setAdminOrderSearch: function (q) {
state.adminOrderSearch = q;
renderApp();
const inputs = document.querySelectorAll('input[placeholder="Cari No. Invoice / Pelanggan..."]');
if (inputs.length > 0) {
const input = inputs[0];
input.focus();
input.setSelectionRange(input.value.length, input.value.length);
}
},
updateOrderStatus: handleUpdateOrderStatus,
openOrderDetail: function (orderId) {
state.selectedOrderDetailId = orderId;
renderApp();
},
closeOrderDetail: function () {
state.selectedOrderDetailId = null;
renderApp();
},
openCustomerHistory: function (custId) {
state.selectedCustomerHistoryId = custId;
renderApp();
},
closeCustomerHistory: function () {
state.selectedCustomerHistoryId = null;
renderApp();
},
setReportDates: function (start, end) {
if (start !== null) state.reportStartDate = start;
if (end !== null) state.reportEndDate = end;
renderApp();
},
exportCSV: handleExportCSV,
saveSettings: handleSaveSettings,
openSqlModal: function (open) {
state.sqlModalOpen = Boolean(open);
renderApp();
},
testSupabaseConnection: async function () {
const sb = window.SaleeDB.supabaseClient;
if (!sb) {
showToast('Klien Supabase belum terinisialisasi.', 'error');
return;
}
showToast('Menghubungi https://vltzvbcwhbdamixrlfwe.supabase.co ...');
try {
const { data, error } = await sb.from('products').select('id, name').limit(5);
if (error) {
showToast(
`Terhubung ke Supabase! Catatan: Jalankan supabase/schema.sql di SQL Editor Supabase (${error.message}).`,
'warning'
);
} else {
showToast(
`Koneksi Supabase Aktif! Berhasil membaca tabel products (${data ? data.length : 0} baris).`,
'success'
);
}
} catch (err) {
showToast('Gagal menghubungi endpoint Supabase: ' + err.message, 'error');
}
},
resetDemoData: function () {
state.db = window.SaleeDB.resetToSeed();
state.cart = [];
showToast('Data demo berhasil di-reset ke kondisi awal!');
renderApp();
},
};
document.addEventListener('DOMContentLoaded', function () {
renderApp();
});
