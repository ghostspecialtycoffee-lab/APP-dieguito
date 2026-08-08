import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { MapPin, Footprints, Bell, ArrowRight } from "lucide-react";
import { FlowSteps, PageHeader } from "../components/ui";

export default function Dashboard() {
  const farms = useQuery(api.farms.list);
  const alerts = useQuery(api.alerts.list);
  const hasConvex = Boolean(import.meta.env.VITE_CONVEX_URL);

  const unreadAlerts = alerts?.filter((a) => !a.read).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Inicio"
        subtitle="Panel general del programa de asistencias técnicas"
      />

      <div className="mb-8 card bg-coffee-600 text-white border-coffee-600">
        <h3 className="text-lg font-semibold">Objetivo del programa</h3>
        <p className="mt-2 text-sm text-coffee-100">
          Gestionar la asistencia técnica en fincas cafeteras mediante el
          registro de diagnósticos, visitas, planes de trabajo e informes para
          mejorar la productividad y sostenibilidad del cultivo.
        </p>
      </div>

      <h3 className="mb-4 text-lg font-semibold text-coffee-900">
        Flujo general del programa
      </h3>
      <FlowSteps />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/fincas"
          className="card flex items-center gap-4 transition hover:border-coffee-400 hover:shadow-md"
        >
          <div className="rounded-lg bg-coffee-100 p-3">
            <MapPin className="h-6 w-6 text-coffee-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-coffee-900">Fincas</p>
            <p className="text-sm text-coffee-600">
              {hasConvex && farms === undefined
                ? "…"
                : `${farms?.length ?? 0} registradas`}
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-coffee-400" />
        </Link>

        <Link
          to="/calendario"
          className="card flex items-center gap-4 transition hover:border-coffee-400 hover:shadow-md"
        >
          <div className="rounded-lg bg-coffee-100 p-3">
            <Footprints className="h-6 w-6 text-coffee-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-coffee-900">Visitas</p>
            <p className="text-sm text-coffee-600">Calendario y seguimiento</p>
          </div>
          <ArrowRight className="h-5 w-5 text-coffee-400" />
        </Link>

        <Link
          to="/alertas"
          className="card flex items-center gap-4 transition hover:border-coffee-400 hover:shadow-md"
        >
          <div className="rounded-lg bg-coffee-100 p-3">
            <Bell className="h-6 w-6 text-coffee-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-coffee-900">Alertas</p>
            <p className="text-sm text-coffee-600">
              {unreadAlerts} pendientes
            </p>
          </div>
          <ArrowRight className="h-5 w-5 text-coffee-400" />
        </Link>
      </div>
    </div>
  );
}
