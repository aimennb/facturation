import { Suspense, useCallback, useEffect, useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { DashboardLayout } from './layouts/DashboardLayout.js';
import { Dashboard } from './pages/Dashboard.js';
import { Invoices } from './pages/Invoices.js';
import { Suppliers } from './pages/Suppliers.js';
import { Advances } from './pages/Advances.js';
import { Reports } from './pages/Reports.js';
import { AdminSettings } from './pages/AdminSettings.js';
import { Portal } from './pages/Portal.js';
import { Login } from './pages/Login.js';

const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children: JSX.Element }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const { i18n } = useTranslation();
  const [isAuthenticated, setAuthenticated] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleLocale = useCallback(() => {
    const next = i18n.language === 'fr' ? 'ar' : 'fr';
    void i18n.changeLanguage(next);
  }, [i18n]);

  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Chargement...</div>}>
      <Routes>
        <Route
          path="/login"
          element={<Login onSuccess={() => setAuthenticated(true)} />}
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout onToggleLocale={toggleLocale} onLogout={() => setAuthenticated(false)}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/advances" element={<Advances />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<AdminSettings />} />
                  <Route path="/portal" element={<Portal />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default App;
