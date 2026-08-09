import { Link, useParams } from "react-router-dom";
import { BookOpen, Search } from "lucide-react";
import { useState } from "react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";
import { useFarm, useVisitsByFarm } from "../api/hooks";

export default function Logbook() {
  const { farmId } = useParams<{ farmId: string }>();
  const farm = useFarm(farmId);
  const visits = useVisitsByFarm(farmId);
  const [search, setSearch] = useState("");

  if (!farmId || farm === undefined || visits === undefined) {
    return <LoadingState />;
  }
  if (farm === null) return <div>Finca no encontrada.</div>;

  const filtered = visits.filter(
    (v) =>
      v.visitType.toLowerCase().includes(search.toLowerCase()) ||
      v.technician.toLowerCase().includes(search.toLowerCase()) ||
      v.observations?.toLowerCase().includes(search.toLowerCase()) ||
      v.activities.some((a) =>
        a.toLowerCase().includes(search.toLowerCase()),
      ),
  );

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current="Bitácora"
      />
      <PageHeader
        title="Bitácora"
        subtitle="Historial completo de actividades técnicas"
      />

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-400" />
        <input
          type="search"
          placeholder="Buscar en bitácora…"
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card mb-6 bg-coffee-50 border-coffee-200">
        <h3 className="font-semibold text-coffee-900 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Datos registrados en cada visita
        </h3>
        <ul className="mt-2 text-sm text-coffee-600 space-y-1">
          <li>• Fecha y hora de la visita</li>
          <li>• Técnico responsable y objetivo</li>
          <li>• Actividades realizadas y recomendaciones</li>
          <li>• Evidencias fotográficas</li>
          <li>• Fecha de próxima visita</li>
        </ul>
      </div>

      <div className="space-y-4">
        {filtered.map((visit) => (
          <Link
            key={visit._id}
            to={`/fincas/${farmId}/visitas/${visit._id}`}
            className="card block transition hover:border-coffee-400"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="font-semibold text-coffee-900">
                  {visit.visitType} — {visit.date}
                </p>
                <p className="text-sm text-coffee-600">{visit.technician}</p>
              </div>
              {visit.nextVisitDate && (
                <span className="text-xs text-coffee-500">
                  Próxima: {visit.nextVisitDate}
                </span>
              )}
            </div>
            {visit.activities.length > 0 && (
              <ul className="mt-3 text-sm text-coffee-700">
                {visit.activities.slice(0, 3).map((a) => (
                  <li key={a}>• {a}</li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
