import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { EmptyState, LoadingState, PageHeader } from "../components/ui";

type ModuleHubProps = {
  title: string;
  subtitle: string;
  pathSuffix: string;
};

export default function ModuleHub({ title, subtitle, pathSuffix }: ModuleHubProps) {
  const farms = useQuery(api.farms.list);

  if (!import.meta.env.VITE_CONVEX_URL) {
    return <EmptyState message="Configure Convex para acceder a este módulo." />;
  }

  if (farms === undefined) return <LoadingState />;

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      {farms.length === 0 ? (
        <EmptyState
          message="No hay fincas registradas. Registre una finca para comenzar."
          action={
            <Link to="/fincas" className="btn-primary">
              Ir a Fincas
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-coffee-600">
            Seleccione la finca para continuar:
          </p>
          {farms.map((farm) => (
            <Link
              key={farm._id}
              to={`/fincas/${farm._id}${pathSuffix}`}
              className="card flex items-center gap-4 transition hover:border-coffee-400"
            >
              <div className="rounded-lg bg-coffee-100 p-3">
                <MapPin className="h-5 w-5 text-coffee-600" />
              </div>
              <div>
                <h3 className="font-semibold text-coffee-900">{farm.name}</h3>
                <p className="text-sm text-coffee-600">{farm.address}</p>
                <p className="text-xs text-coffee-500">
                  {farm.altitude} m.s.n.m.
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
