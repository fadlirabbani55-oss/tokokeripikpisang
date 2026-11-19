const state = {
db: window.SaleeDB.loadDB(),
cart: window.SaleeDB.loadCart(),
currentUser: window.SaleeDB.loadAuthUser(),
viewMode: 'store', // 'store' | 'admin'
adminTab: 'dashboard', // 'dashboard' | 'products' | 'categories' | 'stock' | 'orders' | 'customers' | 'reports' | 'settings'
mobileMenuOpen: false,
adminSidebarOpen: false,
selectedCategory: 'ALL',
searchQuery: '',
sortBy: 'popular', // 'popular' | 'price_asc' | 'price_desc' | 'stock_desc'
cartDrawerOpen: false,
detailProductId: null,
detailQty: 1,
checkoutOpen: false,
orderSuccessData: null, // { orderNumber, orderId, totalAmount, paymentMethod, customerName, customerWhatsapp }
authModalOpen: false,
authMode: 'login', // 'login' | 'register'
chartPeriod: 'daily', // 'daily' | 'monthly'
adminProductSearch: '',
adminProductCatFilter: 'ALL',
productModalOpen: false,
editingProduct: null,
categoryModalOpen: false,
editingCategory: null,
stockModalOpen: false,
stockFormPresetProductId: '',
stockFilterType: 'ALL',
adminOrderStatusFilter: 'ALL',
adminOrderSearch: '',
selectedOrderDetailId: null,
selectedCustomerHistoryId: null,
reportStartDate: '2026-11-01',
reportEndDate: '2026-11-30',
sqlModalOpen: false,
};
const PRESET_PRODUCT_PHOTOS = [
{ label: 'Pisang Salee Klasik', url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=80' },
{ label: 'Pisang Karamel Madu', url: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=900&q=80' },
{ label: 'Choco Melt Belgia', url: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=900&q=80' },
{ label: 'Matcha Uji Glaze', url: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80' },
{ label: 'Gula Aren Tradisional', url: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?auto=format&fit=crop&w=900&q=80' },
{ label: 'Tiramisu Crunch', url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&w=900&q=80' },
{ label: 'Keju Cheddar Susu', url: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=900&q=80' },
{ label: 'Daun Jeruk Gurih', url: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=900&q=80' },
];
function formatRp(num) {
const n = Number(num) || 0;
return new Intl.NumberFormat('id-ID', {
style: 'currency',
currency: 'IDR',
maximumFractionDigits: 0,
}).format(n);
}
function formatDateID(isoString, includeTime = true) {
if (!isoString) return '-';
try {
const d = new Date(isoString);
const opts = {
day: '2-digit',
month: 'short',
year: 'numeric',
};
if (includeTime) {
opts.hour = '2-digit';
opts.minute = '2-digit';
}
return d.toLocaleDateString('id-ID', opts);
} catch (e) {
return isoString;
}
}
function escapeHtml(str) {
if (str === null || str === undefined) return '';
return String(str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
function getCategoryById(catId) {
return (
state.db.categories.find((c) => c.id === catId) || {
id: 'unknown',
name: 'Umum',
badge_color: '#F5C84C',
}
);
}
function getProductById(prodId) {
return state.db.products.find((p) => p.id === prodId) || null;
}
function getCartSummary() {
const items = [];
let totalQty = 0;
let subtotal = 0;
state.cart.forEach((ci) => {
const product = getProductById(ci.product_id);
if (product) {
const validQty = Math.min(Math.max(1, ci.quantity), Math.max(1, product.stock));
const lineSubtotal = product.price * validQty;
totalQty += validQty;
subtotal += lineSubtotal;
items.push({
product_id: product.id,
quantity: validQty,
product,
subtotal: lineSubtotal,
});
}
});
const freeThreshold = Number(state.db.settings.free_shipping_threshold) || 150000;
const defaultShip = Number(state.db.settings.default_shipping) || 12000;
const shipping = items.length === 0 ? 0 : subtotal >= freeThreshold ? 0 : defaultShip;
const total = subtotal + shipping;
return {
items,
totalQty,
subtotal,
shipping,
freeThreshold,
amountToFreeShipping: Math.max(0, freeThreshold - subtotal),
total,
};
}
function persistAll() {
window.SaleeDB.saveDB(state.db);
window.SaleeDB.saveCart(state.cart);
window.SaleeDB.saveAuthUser(state.currentUser);
}
function showToast(message, type = 'success') {
const container = document.getElementById('toastContainer');
if (!container) return;
const bgClass =
type === 'error'
? 'bg-red-700 text-white border-red-500'
: type === 'warning'
? 'bg-amber-600 text-white border-amber-400'
: 'bg-[#633D25] text-white border-[#F5C84C]';
const iconName =
type === 'error' ? 'alert-circle' : type === 'warning' ? 'alert-triangle' : 'check-circle-2';
const toastEl = document.createElement('div');
toastEl.className = `flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border-l-4 ${bgClass} transform transition-all duration-300 translate-y-2 opacity-0 max-w-md`;
toastEl.innerHTML = `
<i data-lucide="${iconName}" class="w-5 h-5 text-[#F5C84C] shrink-0"></i><div class="text-xs sm:text-sm font-semibold leading-snug">${escapeHtml(message)}</div>
`;
container.appendChild(toastEl);
if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 2.2 } });
requestAnimationFrame(() => {
toastEl.classList.remove('translate-y-2', 'opacity-0');
});
setTimeout(() => {
toastEl.classList.add('opacity-0', 'translate-y-2');
setTimeout(() => toastEl.remove(), 300);
}, 3400);
}
function refreshIcons() {
if (window.lucide) {
window.lucide.createIcons({
attrs: {
'stroke-width': 2,
},
});
}
}
function addToCart(productId, qty = 1) {
const product = getProductById(productId);
if (!product) return;
if (product.stock <= 0) {
showToast(`Maaf, stok "${product.name}" sedang habis.`, 'error');
return;
}
const existing = state.cart.find((c) => c.product_id === productId);
if (existing) {
if (existing.quantity + qty > product.stock) {
existing.quantity = product.stock;
showToast(`Jumlah "${product.name}" disesuaikan dengan sisa stok (${product.stock} pouch).`, 'warning');
} else {
existing.quantity += qty;
showToast(`+${qty} "${product.name}" ditambahkan ke keranjang!`);
}
} else {
state.cart.push({
product_id: productId,
quantity: Math.min(qty, product.stock),
});
showToast(`"${product.name}" berhasil masuk keranjang!`);
}
persistAll();
renderApp();
}
function updateCartQuantity(productId, deltaOrExact, isExact = false) {
const product = getProductById(productId);
if (!product) return;
const idx = state.cart.findIndex((c) => c.product_id === productId);
if (idx === -1) return;
const nextQty = isExact ? Number(deltaOrExact) : state.cart[idx].quantity + Number(deltaOrExact);
if (nextQty <= 0) {
const removedName = product.name;
state.cart.splice(idx, 1);
showToast(`"${removedName}" dihapus dari keranjang.`, 'warning');
} else if (nextQty > product.stock) {
state.cart[idx].quantity = product.stock;
showToast(`Maksimal pembelian sesuai stok tersedia (${product.stock} pouch).`, 'warning');
} else {
state.cart[idx].quantity = nextQty;
}
persistAll();
renderApp();
}
function removeFromCart(productId) {
const product = getProductById(productId);
state.cart = state.cart.filter((c) => c.product_id !== productId);
persistAll();
if (product) showToast(`"${product.name}" dihapus dari keranjang.`, 'warning');
renderApp();
}
function openProductDetail(productId) {
const product = getProductById(productId);
if (!product) return;
state.detailProductId = productId;
state.detailQty = 1;
renderApp();
}
function closeProductDetail() {
state.detailProductId = null;
renderApp();
}
function openCheckoutModal() {
const summary = getCartSummary();
if (summary.items.length === 0) {
showToast('Keranjang belanja Anda masih kosong.', 'warning');
return;
}
state.cartDrawerOpen = false;
state.checkoutOpen = true;
renderApp();
}
function handleCheckoutSubmit(event) {
event.preventDefault();
const form = event.target;
const customerName = form.customerName.value.trim();
const customerWhatsapp = form.customerWhatsapp.value.trim();
const shippingAddress = form.shippingAddress.value.trim();
const notes = form.notes.value.trim();
const paymentMethod = form.paymentMethod.value;
if (customerName.length < 2) {
showToast('Mohon isi nama lengkap penerima.', 'error');
return;
}
if (customerWhatsapp.replace(/\D/g, '').length < 9) {
showToast('Mohon masukkan nomor WhatsApp yang valid (minimal 9 digit).', 'error');
return;
}
if (shippingAddress.length < 8) {
showToast('Mohon tulis alamat lengkap pengiriman beserta kecamatan/kota.', 'error');
return;
}
const summary = getCartSummary();
if (summary.items.length === 0) {
showToast('Keranjang kosong.', 'error');
return;
}
for (const item of summary.items) {
if (item.product.stock < item.quantity) {
showToast(`Stok ${item.product.name} tidak mencukupi (tersisa ${item.product.stock}).`, 'error');
return;
}
}
const now = new Date().toISOString();
const datePart = now.slice(2, 10).replace(/-/g, '');
const orderSeq = String(state.db.orders.length + 1).padStart(3, '0');
const orderNumber = `INV-SALEE-${datePart}-${orderSeq}`;
const orderId = `ord-${Date.now()}`;
const cleanWA = customerWhatsapp.replace(/\D/g, '');
let customer = state.db.customers.find(
(c) => c.whatsapp.replace(/\D/g, '') === cleanWA
);
if (customer) {
customer.name = customerName;
customer.address = shippingAddress;
customer.total_orders += 1;
customer.total_spent += summary.total;
customer.last_order_at = now;
} else {
customer = {
id: `cst-${Date.now()}`,
user_id: state.currentUser ? state.currentUser.id : null,
name: customerName,
whatsapp: customerWhatsapp,
email: state.currentUser ? state.currentUser.email : '',
address: shippingAddress,
city: shippingAddress.split(',').pop().trim().slice(0, 25) || 'Indonesia',
total_orders: 1,
total_spent: summary.total,
last_order_at: now,
created_at: now,
};
state.db.customers.unshift(customer);
}
const initialStatus = paymentMethod === 'Transfer Bank' ? 'Menunggu Pembayaran' : 'Diproses';
const deductImmediately = initialStatus === 'Diproses';
const newOrder = {
id: orderId,
order_number: orderNumber,
customer_id: customer.id,
customer_name: customerName,
customer_whatsapp: customerWhatsapp,
shipping_address: shippingAddress,
notes: notes || '-',
subtotal: summary.subtotal,
shipping_cost: summary.shipping,
discount_amount: 0,
total_amount: summary.total,
payment_method: paymentMethod,
status: initialStatus,
stock_deducted: deductImmediately,
created_at: now,
updated_at: now,
};
state.db.orders.unshift(newOrder);
summary.items.forEach((item, index) => {
state.db.order_items.push({
id: `oi-${Date.now()}-${index}`,
order_id: orderId,
product_id: item.product.id,
product_name: item.product.name,
product_image: item.product.image_url,
unit_price: item.product.price,
quantity: item.quantity,
subtotal: item.subtotal,
created_at: now,
});
if (deductImmediately) {
const prod = getProductById(item.product.id);
if (prod) {
const prevStock = prod.stock;
const currStock = Math.max(0, prevStock - item.quantity);
prod.stock = currStock;
prod.sold_count = (prod.sold_count || 0) + item.quantity;
state.db.stock_movements.unshift({
id: `stm-${Date.now()}-${index}`,
product_id: prod.id,
order_id: orderId,
type: 'out',
quantity: item.quantity,
previous_stock: prevStock,
current_stock: currStock,
reference: orderNumber,
notes: `Stok keluar otomatis dari checkout (${customerName})`,
created_by: 'Sistem Checkout',
created_at: now,
});
}
}
});
state.db.payments.unshift({
id: `pay-${Date.now()}`,
order_id: orderId,
payment_method: paymentMethod,
bank_name: paymentMethod === 'Transfer Bank' ? state.db.settings.bank_name : paymentMethod,
account_sender: customerName,
amount: summary.total,
status: deductImmediately ? 'Verified' : 'Pending',
paid_at: deductImmediately ? now : null,
verified_by: null,
created_at: now,
});
state.cart = [];
state.checkoutOpen = false;
state.orderSuccessData = {
orderNumber,
orderId,
totalAmount: summary.total,
paymentMethod,
customerName,
customerWhatsapp,
shippingAddress,
items: summary.items,
};
persistAll();
showToast(`Pesanan ${orderNumber} berhasil dibuat!`);
renderApp();
}
function openSkipOrSwitchToAdmin() {
if (state.currentUser && state.currentUser.role === 'admin') {
state.viewMode = 'admin';
window.scrollTo({ top: 0, behavior: 'smooth' });
renderApp();
} else {
state.authModalOpen = true;
state.authMode = 'login';
renderApp();
}
}
function loginAsDemoAdmin() {
const adminUser = state.db.users.find((u) => u.role === 'admin') || {
id: 'usr-admin-01',
email: 'admin@pisangsalee.id',
full_name: 'Budi Santoso (Owner Salee)',
phone: '081234567890',
role: 'admin',
};
state.currentUser = adminUser;
state.authModalOpen = false;
state.viewMode = 'admin';
persistAll();
showToast(`Selamat datang kembali, ${adminUser.full_name}!`);
window.scrollTo({ top: 0, behavior: 'smooth' });
renderApp();
}
function loginAsDemoCustomer() {
const custUser = state.db.users.find((u) => u.role === 'customer') || {
id: 'usr-cust-01',
email: 'nadia.putri@gmail.com',
full_name: 'Nadia Putri Maharani',
phone: '081345678901',
role: 'customer',
};
state.currentUser = custUser;
state.authModalOpen = false;
persistAll();
showToast(`Berhasil masuk sebagai pelanggan: ${custUser.full_name}`);
renderApp();
}
function handleAuthSubmit(e) {
e.preventDefault();
const form = e.target;
const email = form.email.value.trim();
const roleSelect = form.role ? form.role.value : 'admin';
const fullName = form.fullName ? form.fullName.value.trim() : '';
if (!email) {
showToast('Masukkan alamat email.', 'error');
return;
}
let user = state.db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
if (!user) {
user = {
id: `usr-${Date.now()}`,
email,
full_name: fullName || (roleSelect === 'admin' ? 'Owner Keripik Pisang Salee' : email.split('@')[0]),
phone: '081234567890',
role: roleSelect,
created_at: new Date().toISOString(),
};
state.db.users.push(user);
}
state.currentUser = user;
state.authModalOpen = false;
if (user.role === 'admin') {
state.viewMode = 'admin';
}
persistAll();
showToast(`Berhasil masuk sebagai ${user.full_name} (${user.role.toUpperCase()})`);
renderApp();
}
function handleLogout() {
state.currentUser = null;
state.viewMode = 'store';
persistAll();
showToast('Anda telah keluar dari sesi akun.', 'info');
renderApp();
}
function openProductModal(productId = null) {
if (productId) {
const existing = getProductById(productId);
state.editingProduct = existing ? JSON.parse(JSON.stringify(existing)) : null;
} else {
state.editingProduct = null;
}
state.productModalOpen = true;
renderApp();
}
function handleSaveProduct(e) {
e.preventDefault();
const form = e.target;
const name = form.name.value.trim();
const sku = form.sku.value.trim();
const category_id = form.category_id.value;
const price = Number(form.price.value);
const cost_price = Number(form.cost_price.value) || Math.round(price * 0.6);
const stock = Number(form.stock.value);
const min_stock = Number(form.min_stock.value) || 10;
const weight_grams = Number(form.weight_grams.value) || 200;
const image_url = form.image_url.value.trim() || PRESET_PRODUCT_PHOTOS[0].url;
const description = form.description.value.trim();
const is_popular = form.is_popular.checked;
if (!name || price <= 0) {
showToast('Mohon isi nama produk dan harga jual yang valid.', 'error');
return;
}
const now = new Date().toISOString();
if (state.editingProduct) {
const idx = state.db.products.findIndex((p) => p.id === state.editingProduct.id);
if (idx !== -1) {
const prevStock = state.db.products[idx].stock;
state.db.products[idx] = {
...state.db.products[idx],
name,
sku: sku || state.db.products[idx].sku,
category_id,
price,
cost_price,
stock,
min_stock,
weight_grams,
image_url,
description,
is_popular,
};
if (prevStock !== stock) {
state.db.stock_movements.unshift({
id: `stm-${Date.now()}`,
product_id: state.editingProduct.id,
order_id: null,
type: stock > prevStock ? 'in' : 'out',
quantity: Math.abs(stock - prevStock),
previous_stock: prevStock,
current_stock: stock,
reference: 'EDIT-PRODUK',
notes: `Penyesuaian stok via form Edit Produk`,
created_by: state.currentUser ? state.currentUser.full_name : 'Admin',
created_at: now,
});
}
showToast(`Produk "${name}" berhasil diperbarui!`);
}
} else {
const newId = `prd-${Date.now()}`;
const newProd = {
id: newId,
category_id,
sku: sku || `SALEE-${Date.now().toString().slice(-4)}`,
name,
slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
description,
price,
cost_price,
stock,
min_stock,
weight_grams,
image_url,
is_popular,
is_active: true,
rating: 4.9,
sold_count: 0,
created_at: now,
};
state.db.products.unshift(newProd);
if (stock > 0) {
state.db.stock_movements.unshift({
id: `stm-${Date.now()}`,
product_id: newId,
order_id: null,
type: 'in',
quantity: stock,
previous_stock: 0,
current_stock: stock,
reference: 'STOK-AWAL',
notes: `Stok awal penambahan produk baru "${name}"`,
created_by: state.currentUser ? state.currentUser.full_name : 'Admin',
created_at: now,
});
}
showToast(`Produk baru "${name}" berhasil ditambahkan!`);
}
state.productModalOpen = false;
state.editingProduct = null;
persistAll();
renderApp();
}
function handleDeleteProduct(productId) {
const prod = getProductById(productId);
if (!prod) return;
state.db.products = state.db.products.filter((p) => p.id !== productId);
state.cart = state.cart.filter((c) => c.product_id !== productId);
persistAll();
showToast(`Produk "${prod.name}" telah dihapus.`, 'warning');
renderApp();
}
function openCategoryModal(catId = null) {
if (catId) {
const cat = state.db.categories.find((c) => c.id === catId);
state.editingCategory = cat ? JSON.parse(JSON.stringify(cat)) : null;
} else {
state.editingCategory = null;
}
state.categoryModalOpen = true;
renderApp();
}
function handleSaveCategory(e) {
e.preventDefault();
const form = e.target;
const name = form.name.value.trim();
const description = form.description.value.trim();
const badge_color = form.badge_color.value || '#F5C84C';
if (!name) {
showToast('Nama kategori wajib diisi.', 'error');
return;
}
if (state.editingCategory) {
const idx = state.db.categories.findIndex((c) => c.id === state.editingCategory.id);
if (idx !== -1) {
state.db.categories[idx] = {
...state.db.categories[idx],
name,
slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
description,
badge_color,
};
showToast(`Kategori "${name}" berhasil diperbarui!`);
}
} else {
state.db.categories.push({
id: `cat-${Date.now()}`,
name,
slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
description,
icon: 'tag',
badge_color,
created_at: new Date().toISOString(),
});
showToast(`Kategori "${name}" berhasil ditambahkan!`);
}
state.categoryModalOpen = false;
state.editingCategory = null;
persistAll();
renderApp();
}
function handleDeleteCategory(catId) {
const usedCount = state.db.products.filter((p) => p.category_id === catId).length;
if (usedCount > 0) {
showToast(`Tidak dapat menghapus kategori karena masih memiliki ${usedCount} produk aktif.`, 'error');
return;
}
const cat = state.db.categories.find((c) => c.id === catId);
state.db.categories = state.db.categories.filter((c) => c.id !== catId);
persistAll();
showToast(`Kategori "${cat ? cat.name : ''}" berhasil dihapus.`, 'warning');
renderApp();
}
function openStockModal(productId = '') {
state.stockFormPresetProductId = productId || (state.db.products[0] ? state.db.products[0].id : '');
state.stockModalOpen = true;
renderApp();
}
function handleSaveStockMovement(e) {
e.preventDefault();
const form = e.target;
const product_id = form.product_id.value;
const type = form.type.value; // 'in' | 'out'
const quantity = Number(form.quantity.value);
const reference = form.reference.value.trim() || `BATCH-${Date.now().toString().slice(-5)}`;
const notes = form.notes.value.trim() || 'Pencatatan stok manual gudang';
const product = getProductById(product_id);
if (!product || quantity <= 0) {
showToast('Pilih produk dan masukkan jumlah stok yang valid (> 0).', 'error');
return;
}
if (type === 'out' && product.stock < quantity) {
showToast(`Stok "${product.name}" tidak mencukupi (tersedia ${product.stock} pouch).`, 'error');
return;
}
const prevStock = product.stock;
const currStock = type === 'in' ? prevStock + quantity : Math.max(0, prevStock - quantity);
product.stock = currStock;
state.db.stock_movements.unshift({
id: `stm-${Date.now()}`,
product_id: product.id,
order_id: null,
type,
quantity,
previous_stock: prevStock,
current_stock: currStock,
reference,
notes,
created_by: state.currentUser ? state.currentUser.full_name : 'Admin Gudang',
created_at: new Date().toISOString(),
});
state.stockModalOpen = false;
persistAll();
showToast(
`Stok ${type === 'in' ? 'Masuk (+' : 'Keluar (-'}${quantity}) untuk "${product.name}" berhasil dicatat! Sisa stok: ${currStock} pouch.`
);
renderApp();
}
function handleUpdateOrderStatus(orderId, newStatus) {
const order = state.db.orders.find((o) => o.id === orderId);
if (!order) return;
const oldStatus = order.status;
if (oldStatus === newStatus) return;
const now = new Date().toISOString();
const items = state.db.order_items.filter((oi) => oi.order_id === orderId);
if (
!order.stock_deducted &&
['Diproses', 'Dikemas', 'Dikirim', 'Selesai'].includes(newStatus)
) {
items.forEach((oi, idx) => {
const prod = getProductById(oi.product_id);
if (prod) {
const prevStock = prod.stock;
const currStock = Math.max(0, prevStock - oi.quantity);
prod.stock = currStock;
prod.sold_count = (prod.sold_count || 0) + oi.quantity;
state.db.stock_movements.unshift({
id: `stm-${Date.now()}-${idx}`,
product_id: prod.id,
order_id: order.id,
type: 'out',
quantity: oi.quantity,
previous_stock: prevStock,
current_stock: currStock,
reference: order.order_number,
notes: `Stok berkurang otomatis saat pesanan dikonfirmasi (${newStatus})`,
created_by: state.currentUser ? state.currentUser.full_name : 'Admin',
created_at: now,
});
}
});
order.stock_deducted = true;
}
if (order.stock_deducted && newStatus === 'Dibatalkan') {
items.forEach((oi, idx) => {
const prod = getProductById(oi.product_id);
if (prod) {
const prevStock = prod.stock;
const currStock = prevStock + oi.quantity;
prod.stock = currStock;
prod.sold_count = Math.max(0, (prod.sold_count || 0) - oi.quantity);
state.db.stock_movements.unshift({
id: `stm-${Date.now()}-${idx}`,
product_id: prod.id,
order_id: order.id,
type: 'in',
quantity: oi.quantity,
previous_stock: prevStock,
current_stock: currStock,
reference: order.order_number,
notes: `Pengembalian stok otomatis karena pesanan dibatalkan`,
created_by: state.currentUser ? state.currentUser.full_name : 'Admin',
created_at: now,
});
}
});
order.stock_deducted = false;
}
order.status = newStatus;
order.updated_at = now;
const payment = state.db.payments.find((p) => p.order_id === orderId);
if (payment) {
if (['Diproses', 'Dikemas', 'Dikirim', 'Selesai'].includes(newStatus)) {
payment.status = 'Verified';
payment.paid_at = payment.paid_at || now;
} else if (newStatus === 'Dibatalkan') {
payment.status = 'Failed';
}
}
persistAll();
showToast(`Status pesanan ${order.order_number} diubah menjadi "${newStatus}".`);
renderApp();
}
function handleExportCSV() {
const start = state.reportStartDate ? new Date(state.reportStartDate + 'T00:00:00Z') : new Date('2020-01-01');
const end = state.reportEndDate ? new Date(state.reportEndDate + 'T23:59:59Z') : new Date('2030-12-31');
const filteredOrders = state.db.orders.filter((o) => {
const d = new Date(o.created_at);
return d >= start && d <= end;
});
const headers = [
'No Pesanan',
'Tanggal',
'Nama Pelanggan',
'No WhatsApp',
'Metode Pembayaran',
'Status Pesanan',
'Subtotal (Rp)',
'Ongkir (Rp)',
'Total Pembayaran (Rp)',
'Detail Item',
];
const rows = filteredOrders.map((o) => {
const items = state.db.order_items
.filter((oi) => oi.order_id === o.id)
.map((oi) => `${oi.product_name} (${oi.quantity}x)`)
.join('; ');
return [
o.order_number,
formatDateID(o.created_at),
`"${o.customer_name.replace(/"/g, '""')}"`,
o.customer_whatsapp,
o.payment_method,
o.status,
o.subtotal,
o.shipping_cost,
o.total_amount,
`"${items.replace(/"/g, '""')}"`,
].join(',');
});
const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
const encodedUri = encodeURI(csvContent);
const link = document.createElement('a');
link.setAttribute('href', encodedUri);
link.setAttribute(
'download',
`Laporan_Penjualan_KeripikPisangSalee_${state.reportStartDate}_sd_${state.reportEndDate}.csv`
);
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
showToast(`Laporan CSV (${filteredOrders.length} transaksi) berhasil diunduh!`);
}
function handleContactSubmit(e) {
e.preventDefault();
const form = e.target;
const name = form.name.value.trim();
const whatsapp = form.whatsapp.value.trim();
const subject = form.subject.value.trim();
const message = form.message.value.trim();
if (!name || !whatsapp || !message) {
showToast('Mohon lengkapi nama, WhatsApp, dan isi pesan Anda.', 'error');
return;
}
if (!state.db.contact_messages) state.db.contact_messages = [];
state.db.contact_messages.unshift({
id: `msg-${Date.now()}`,
name,
whatsapp,
subject: subject || 'Pertanyaan Umum Pelanggan',
message,
created_at: new Date().toISOString(),
});
persistAll();
form.reset();
showToast('Pesan Anda telah terkirim! Tim Keripik Pisang Salee akan segera menghubungi Anda.');
}
function handleSaveSettings(e) {
e.preventDefault();
const form = e.target;
state.db.settings = {
...state.db.settings,
store_name: form.store_name.value.trim() || 'Keripik Pisang Salee',
tagline: form.tagline.value.trim(),
whatsapp: form.whatsapp.value.trim(),
email: form.email.value.trim(),
address: form.address.value.trim(),
instagram: form.instagram.value.trim(),
tiktok: form.tiktok.value.trim(),
bank_name: form.bank_name.value.trim(),
bank_account: form.bank_account.value.trim(),
bank_holder: form.bank_holder.value.trim(),
default_shipping: Number(form.default_shipping.value) || 12000,
free_shipping_threshold: Number(form.free_shipping_threshold.value) || 150000,
default_min_stock: Number(form.default_min_stock.value) || 12,
cod_enabled: form.cod_enabled.checked,
};
const sbUrl = form.supabase_url ? form.supabase_url.value.trim() : '';
const sbKey = form.supabase_anon_key ? form.supabase_anon_key.value.trim() : '';
if (sbUrl) localStorage.setItem('SALEE_SUPABASE_URL', sbUrl);
if (sbKey) localStorage.setItem('SALEE_SUPABASE_ANON_KEY', sbKey);
persistAll();
showToast('Pengaturan toko & konfigurasi berhasil disimpan!');
renderApp();
}
function handleImageUploadChange(inputEl) {
if (!inputEl.files || !inputEl.files[0]) return;
const file = inputEl.files[0];
const reader = new FileReader();
reader.onload = function (evt) {
const urlInput = document.getElementById('productImageUrlInput');
const previewImg = document.getElementById('productImagePreview');
if (urlInput && evt.target && evt.target.result) {
urlInput.value = evt.target.result;
if (previewImg) previewImg.src = evt.target.result;
showToast('Foto produk berhasil diunggah!');
}
};
reader.readAsDataURL(file);
}
