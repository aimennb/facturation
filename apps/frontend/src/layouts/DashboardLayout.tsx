import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Languages, LogOut } from "lucide-react";

import { Button } from "../components/ui/Button.js";

interface DashboardLayoutProps {
  children: ReactNode;
  onToggleLocale: () => void;
  onLogout: () => void;
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-emerald-100 text-emerald-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;

export const DashboardLayout = ({
  children,
  onToggleLocale,
  onLogout,
}: DashboardLayoutProps) => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="min-h-screen bg-slate-100" data-testid="dashboard-layout">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-emerald-700">
            {t("appTitle")}
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onToggleLocale}
              aria-label={t("login.language")}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">
                {i18n.language === "fr" ? "العربية" : "Français"}
              </span>
            </Button>
            <Button variant="ghost" onClick={onLogout} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-col gap-2">
          <NavLink to="/" end className={navClass}>
            {t("nav.dashboard")}
          </NavLink>
          <NavLink to="/invoices" className={navClass}>
            {t("nav.invoices")}
          </NavLink>
          <NavLink to="/suppliers" className={navClass}>
            {t("nav.suppliers")}
          </NavLink>
          <NavLink to="/advances" className={navClass}>
            {t("nav.advances")}
          </NavLink>
          <NavLink to="/reports" className={navClass}>
            {t("nav.reports")}
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            {t("nav.settings")}
          </NavLink>
          <NavLink to="/portal" className={navClass}>
            {t("nav.portal")}
          </NavLink>
        </aside>
        <main className="space-y-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};
