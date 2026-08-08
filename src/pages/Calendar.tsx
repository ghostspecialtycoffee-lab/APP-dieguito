import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon } from "lucide-react";
import { LoadingState, PageHeader } from "../components/ui";

export default function Calendar() {
  const farms = useQuery(api.farms.list);
  const alerts = useQuery(api.alerts.list);

  if (farms === undefined) return <LoadingState />;

  const visitAlerts = alerts?.filter((a) => a.type === "visit") ?? [];

  return (
    <div>
      <PageHeader
        title="Calendario"
        subtitle="Programación de visitas técnicas"
      />

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="h-5 w-5 text-coffee-600" />
          <h3 className="font-semibold text-coffee-900">Visitas programadas</h3>
        </div>

        {visitAlerts.length === 0 ? (
          <p className="text-sm text-coffee-600">
            No hay visitas programadas. Las próximas visitas se muestran cuando
            se registran en las visitas técnicas.
          </p>
        ) : (
          <div className="space-y-3">
            {visitAlerts.map((alert) => {
              const farm = farms.find((f) => f._id === alert.farmId);
              return (
                <div
                  key={alert._id}
                  className="flex items-center justify-between rounded-lg border border-coffee-200 p-4"
                >
                  <div>
                    <p className="font-medium text-coffee-900">{alert.title}</p>
                    <p className="text-sm text-coffee-600">{alert.message}</p>
                    {farm && (
                      <Link
                        to={`/fincas/${farm._id}`}
                        className="text-sm text-coffee-500 hover:underline"
                      >
                        {farm.name}
                      </Link>
                    )}
                  </div>
                  {alert.dueDate && (
                    <span className="rounded-full bg-coffee-100 px-3 py-1 text-sm font-medium text-coffee-700">
                      {alert.dueDate}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {farms.map((farm) => (
          <Link
            key={farm._id}
            to={`/fincas/${farm._id}/visitas`}
            className="card transition hover:border-coffee-400"
          >
            <p className="font-semibold text-coffee-900">{farm.name}</p>
            <p className="text-sm text-coffee-600">Ver visitas y programar</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
