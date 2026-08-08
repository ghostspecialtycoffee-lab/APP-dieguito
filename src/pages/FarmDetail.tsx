import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import {
  ClipboardList,
  ListChecks,
  Footprints,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";

export default function FarmDetail() {
  const { farmId } = useParams<{ farmId: string }>();
  const farm = useQuery(
    api.farms.get,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const visits = useQuery(
    api.visits.listByFarm,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );

  if (!import.meta.env.VITE_CONVEX_URL) {
    return <div className="card">Configure Convex para ver detalles.</div>;
  }

  if (farm === undefined) return <LoadingState />;
  if (farm === null) return <div className="card">Finca no encontrada.</div>;

  const modules = [
    {
      to: `/fincas/${farm._id}/diagnostico`,
      label: "Diagnóstico Inicial",
      icon: ClipboardList,
      desc: "Información del cultivo y análisis de suelos",
    },
    {
      to: `/fincas/${farm._id}/plan`,
      label: "Plan de Trabajo",
      icon: ListChecks,
      desc: "Objetivos y actividades recomendadas",
    },
    {
      to: `/fincas/${farm._id}/visitas`,
      label: "Visitas Técnicas",
      icon: Footprints,
      desc: `${visits?.length ?? 0} visitas registradas`,
    },
    {
      to: `/fincas/${farm._id}/bitacora`,
      label: "Bitácora",
      icon: BookOpen,
      desc: "Historial de actividades",
    },
  ];

  return (
    <div>
      <FarmBreadcrumb farmId={farm._id} farmName={farm.name} />
      <PageHeader title={farm.name} subtitle={farm.address} />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3">
          <h3 className="font-semibold text-coffee-900">Información general</h3>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-coffee-500">Propietario</dt>
              <dd className="font-medium">{farm.owner}</dd>
            </div>
            <div>
              <dt className="text-coffee-500">Altitud</dt>
              <dd className="font-medium">{farm.altitude} msnm</dd>
            </div>
            <div>
              <dt className="text-coffee-500">Área</dt>
              <dd className="font-medium">{farm.areaHa} ha</dd>
            </div>
            <div>
              <dt className="text-coffee-500">Plantas</dt>
              <dd className="font-medium">{farm.plantCount ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-coffee-500">Variedad</dt>
              <dd className="font-medium">{farm.variety ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-coffee-500">Fecha de siembra</dt>
              <dd className="font-medium">{farm.sowingDate ?? "—"}</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical className="h-5 w-5 text-coffee-600" />
            <h3 className="font-semibold text-coffee-900">Análisis de Suelos</h3>
          </div>
          <p className="text-sm text-coffee-600">
            Consulte el diagnóstico para ver el resumen del análisis de suelos y
            adjuntar el PDF del laboratorio.
          </p>
          <Link
            to={`/fincas/${farm._id}/diagnostico`}
            className="btn-secondary mt-4 inline-block"
          >
            Ver diagnóstico
          </Link>
        </div>
      </div>

      <h3 className="mt-8 mb-4 text-lg font-semibold text-coffee-900">
        Módulos
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.to}
            to={m.to}
            className="card flex items-center gap-4 transition hover:border-coffee-400"
          >
            <m.icon className="h-8 w-8 text-coffee-500" />
            <div>
              <p className="font-semibold text-coffee-900">{m.label}</p>
              <p className="text-sm text-coffee-600">{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
