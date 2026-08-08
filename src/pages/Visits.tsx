import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { Plus, Footprints } from "lucide-react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";

export default function Visits() {
  const { farmId } = useParams<{ farmId: string }>();
  const farm = useQuery(
    api.farms.get,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const visits = useQuery(
    api.visits.listByFarm,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );

  if (!farmId || farm === undefined || visits === undefined) {
    return <LoadingState />;
  }
  if (farm === null) return <div>Finca no encontrada.</div>;

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current="Visitas Técnicas"
      />
      <PageHeader
        title="Visitas Técnicas"
        subtitle="Registro y seguimiento de visitas de campo"
        action={
          <Link
            to={`/fincas/${farmId}/visitas/nueva`}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nueva Visita
          </Link>
        }
      />

      {visits.length === 0 ? (
        <div className="card text-center py-12">
          <Footprints className="mx-auto h-12 w-12 text-coffee-300" />
          <p className="mt-4 text-coffee-600">No hay visitas registradas.</p>
          <Link
            to={`/fincas/${farmId}/visitas/nueva`}
            className="btn-primary mt-4 inline-block"
          >
            Registrar primera visita
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {visits.map((visit) => (
            <Link
              key={visit._id}
              to={`/fincas/${farmId}/visitas/${visit._id}`}
              className="card block transition hover:border-coffee-400"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-coffee-900">
                    {visit.visitType}
                  </p>
                  <p className="text-sm text-coffee-600">
                    {visit.date} · {visit.technician}
                  </p>
                  {visit.observations && (
                    <p className="mt-2 text-sm text-coffee-500 line-clamp-2">
                      {visit.observations}
                    </p>
                  )}
                </div>
                {visit.weather && (
                  <span className="rounded-full bg-coffee-100 px-3 py-1 text-xs text-coffee-700">
                    {visit.weather}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
