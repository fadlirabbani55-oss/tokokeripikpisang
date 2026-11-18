import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { StorefrontView } from './components/StorefrontView';
import { AdminDashboardView } from './components/AdminDashboardView';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'store' | 'admin'>('store');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <StoreProvider>
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 px-5 py-3 rounded-2xl bg-[#633D25] text-white shadow-xl text-sm font-semibold">
          {toast.msg}
        </div>
      )}
      {viewMode === 'store' ? (
        <StorefrontView onOpenAdmin={() => setViewMode('admin')} onShowToast={showToast} />
      ) : (
        <AdminDashboardView onBackToStore={() => setViewMode('store')} onShowToast={showToast} />
      )}
    </StoreProvider>
  );
};

export default App;
