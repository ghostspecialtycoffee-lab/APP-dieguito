import { NavLink, Outlet } from "react-router-dom";
import {
  Home,
  PlusCircle,
  History,
  Package,
  FileText,
  FileSpreadsheet,
  Coffee,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { isCloudMode } from "../lib/utils";

const navItems = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/registrar", label: "Registrar venta", icon: PlusCircle },
  { to: "/historial", label: "Historial", icon: History },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/informes", label: "Informes", icon: FileText },
  { to: "/cotizaciones", label: "Cotizaciones", icon: FileSpreadsheet },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-coffee-500 text-white"
        : "text-coffee-100 hover:bg-coffee-700 hover:text-white"
    }`;

  return (
    <aside className="flex h-full w-64 flex-col bg-coffee-900 text-white">
      <div className="flex items-center gap-2 border-b border-coffee-700 px-4 py-5">
        <Coffee className="h-8 w-8 text-coffee-300" />
        <div>
          <p className="text-xs text-coffee-300">Ghost Specialty Coffee</p>
          <p className="text-sm font-semibold leading-tight">Ventas Diarias</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={onNavigate}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-coffee-700 p-4 text-xs text-coffee-300">
        {isCloudMode ? "Modo nube (Convex)" : "Modo local (navegador)"}
      </div>
    </aside>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-coffee-200 bg-white px-4 py-3 lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-coffee-700 hover:bg-coffee-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-coffee-900">
              Sistema de Registro de Ventas Diarias
            </h1>
            <p className="hidden text-xs text-coffee-600 sm:block">
              Registro, seguimiento e informes de ventas
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>

        <footer className="border-t border-coffee-200 bg-coffee-800 px-4 py-3 text-center text-xs text-coffee-100">
          Ghost Specialty Coffee — Ventas diarias e informes
        </footer>
      </div>
    </div>
  );
}
