import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";

const DEFAULT_ACTIVITIES = [
  "Fertilización edáfica",
  "Control de arvenses",
  "Manejo de sombra",
  "Monitoreo de broca",
];

export default function WorkPlan() {
  const { farmId } = useParams<{ farmId: string }>();
  const farm = useQuery(
    api.farms.get,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const plan = useQuery(
    api.workPlans.getByFarm,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const upsert = useMutation(api.workPlans.upsert);
  const [saved, setSaved] = useState(false);

  const [objective, setObjective] = useState("");
  const [responsible, setResponsible] = useState("");
  const [activities, setActivities] = useState<
    Array<{
      name: string;
      completed: boolean;
      inputs: string;
      scheduledDate: string;
    }>
  >(
    DEFAULT_ACTIVITIES.map((name) => ({
      name,
      completed: false,
      inputs: "",
      scheduledDate: "",
    })),
  );

  useEffect(() => {
    if (plan) {
      setObjective(plan.objective);
      setResponsible(plan.responsible ?? "");
      setActivities(
        plan.activities.map((a) => ({
          name: a.name,
          completed: a.completed,
          inputs: a.inputs ?? "",
          scheduledDate: a.scheduledDate ?? "",
        })),
      );
    }
  }, [plan]);

  if (!farmId || farm === undefined || plan === undefined) {
    return <LoadingState />;
  }
  if (farm === null) return <div>Finca no encontrada.</div>;

  const handleSave = async () => {
    await upsert({
      farmId: farmId as Id<"farms">,
      objective,
      responsible: responsible || undefined,
      activities: activities.map((a) => ({
        name: a.name,
        completed: a.completed,
        inputs: a.inputs || undefined,
        scheduledDate: a.scheduledDate || undefined,
      })),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current="Plan de Trabajo"
      />
      <PageHeader
        title="Plan de Trabajo"
        subtitle="Objetivos, actividades recomendadas e responsable"
      />

      <div className="card space-y-6">
        <div>
          <label className="label">Objetivo</label>
          <textarea
            className="input-field min-h-[80px]"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="Mejorar nutrición y productividad del cultivo"
          />
        </div>

        <div>
          <label className="label">Responsable técnico</label>
          <input
            className="input-field"
            value={responsible}
            onChange={(e) => setResponsible(e.target.value)}
            placeholder="Ing. Ana Torres"
          />
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-coffee-900">
            Actividades recomendadas
          </h3>
          <div className="space-y-4">
            {activities.map((act, i) => (
              <div
                key={i}
                className="rounded-lg border border-coffee-200 p-4 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={act.completed}
                    onChange={(e) => {
                      const next = [...activities];
                      next[i] = { ...act, completed: e.target.checked };
                      setActivities(next);
                    }}
                    className="h-4 w-4 rounded border-coffee-300"
                  />
                  <input
                    className="input-field flex-1"
                    value={act.name}
                    onChange={(e) => {
                      const next = [...activities];
                      next[i] = { ...act, name: e.target.value };
                      setActivities(next);
                    }}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Insumos y dosis</label>
                    <input
                      className="input-field"
                      value={act.inputs ?? ""}
                      onChange={(e) => {
                        const next = [...activities];
                        next[i] = { ...act, inputs: e.target.value };
                        setActivities(next);
                      }}
                    />
                  </div>
                  <div>
                    <label className="label">Fecha programada</label>
                    <input
                      className="input-field"
                      type="date"
                      value={act.scheduledDate ?? ""}
                      onChange={(e) => {
                        const next = [...activities];
                        next[i] = { ...act, scheduledDate: e.target.value };
                        setActivities(next);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="button" className="btn-primary" onClick={handleSave}>
            Guardar
          </button>
          {saved && (
            <span className="text-sm text-coffee-600">Guardado correctamente</span>
          )}
        </div>
      </div>
    </div>
  );
}
