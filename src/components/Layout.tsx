import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Home,
  MapPin,
  ClipboardList,
  Footprints,
  BookOpen,
  ListChecks,
  FileText,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Coffee,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/fincas", label: "Fincas", icon: MapPin },
  { to: "/informes", label: "Informes", icon: FileText },
  { to: "/calendario", label: "Calendario", icon: Calendar },
  { to: "/alertas", label: "Alertas", icon: Bell },
  { to: "/configuracion", label: "Configuración", icon: Settings },
];

const farmNavItems = [
  { suffix: "", label: "Resumen", icon: MapPin },
  { suffix: "/diagnostico", label: "Diagnóstico", icon: ClipboardList },
  { suffix: "/plan", label: "Plan de Trabajo", icon: ListChecks },
  { suffix: "/visitas", label: "Visitas Técnicas", icon: Footprints },
  { suffix: "/bitacora", label: "Bitácora", icon: BookOpen },
];

export function Sidebar({
  farmId,
  onNavigate,
}: {
  farmId?: string;
  onNavigate?: () => void;
}) {
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
          <p className="text-xs text-coffee-300">Tu Logo</p>
          <p className="text-sm font-semibold leading-tight">
            Asistencias Técnicas en Café
          </p>
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

        {farmId && (
          <div className="mt-4 border-t border-coffee-700 pt-4">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-coffee-400">
              Finca actual
            </p>
            {farmNavItems.map((item) => (
              <NavLink
                key={item.suffix}
                to={`/fincas/${farmId}${item.suffix}`}
                end={item.suffix === ""}
                className={linkClass}
                onClick={onNavigate}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-coffee-700 p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-coffee-200 hover:bg-coffee-700"
        >
          <LogOut className="h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const farmId =
    pathParts[1] === "fincas" && pathParts[2] ? pathParts[2] : undefined;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <Sidebar farmId={farmId} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar
              farmId={farmId}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col min-w-0">
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
              Programa de Asistencias Técnicas en Café
            </h1>
            <p className="text-xs text-coffee-600 hidden sm:block">
              Gestión eficiente, información precisa, mejores resultados
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>

        <footer className="border-t border-coffee-200 bg-coffee-800 px-4 py-3 text-center text-xs text-coffee-100">
          Programa de Asistencias Técnicas en Café | Gestión eficiente,
          información precisa, mejores resultados.
        </footer>
      </div>
    </div>
  );
}
