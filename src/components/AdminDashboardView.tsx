import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from './StorefrontView';

interface AdminDashboardProps {
  onBackToStore: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboardView: React.FC<AdminDashboardProps> = ({ onBackToStore, onShowToast }) => {
  const { db, updateOrderStatus, recordStockMovement, saveProduct, deleteProduct, logout } = useStore();
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');

  const stats = useMemo(() => {
    const validOrders = db.orders.filter((o) => o.status !== 'Dibatalkan');
    const totalSales = validOrders.reduce((acc, o) => acc + o.total_amount, 0);
    return {
      totalSales,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      totalCustomers: db.customers.length,
      lowStockProducts: db.products.filter((p) => p.stock <= p.min_stock),
    };
  }, [db]);

  return (
    <div className="min-h-screen flex bg-[#FFF5DF]/50 text-[#633D25]">
      <aside className="w-72 bg-[#633D25] text-white flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="font-extrabold text-xl text-[#F5C84C]">Salee Admin ERP</div>
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Manajemen Produk', icon: Package },
              { id: 'categories', label: 'Kategori Produk', icon: Tags },
              { id: 'stock', label: 'Manajemen Stok', icon: Boxes },
              { id: 'orders', label: 'Pesanan', icon: ShoppingCart },
              { id: 'customers', label: 'Pelanggan', icon: Users },
              { id: 'reports', label: 'Laporan Penjualan', icon: BarChart3 },
              { id: 'settings', label: 'Pengaturan', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                    activeMenu === item.id ? 'bg-[#F5C84C] text-[#633D25]' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <button
          onClick={() => {
            logout();
            onBackToStore();
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 text-red-200 text-sm font-semibold"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-extrabold mb-6">Ringkasan Operasional Keripik Pisang Salee</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Penjualan</div>
            <div className="text-2xl font-extrabold mt-1">{formatRupiah(stats.totalSales)}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Pesanan</div>
            <div className="text-2xl font-extrabold mt-1">{stats.totalOrders} Pesanan</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Produk</div>
            <div className="text-2xl font-extrabold mt-1">{stats.totalProducts} Varian</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Pelanggan</div>
            <div className="text-2xl font-extrabold mt-1">{stats.totalCustomers} Pelanggan</div>
          </div>
        </div>
      </main>
    </div>
  );
};
