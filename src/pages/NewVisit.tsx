import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { useQuery } from "convex/react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";

const TECHNICIANS = [
  "Ing. Ana Torres",
  "Ing. Carlos Mendoza",
  "Ing. Laura Gómez",
];

export default function NewVisit() {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();
  const farm = useQuery(
    api.farms.get,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const createVisit = useMutation(api.visits.create);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    visitType: "Seguimiento",
    technician: TECHNICIANS[0],
    weather: "Soleado",
    observations: "",
    nextVisitDate: "",
  });

  if (!farmId || farm === undefined) return <LoadingState />;
  if (farm === null) return <div>Finca no encontrada.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const visitId = await createVisit({
      farmId: farmId as Id<"farms">,
      date: form.date,
      visitType: form.visitType,
      technician: form.technician,
      weather: form.weather || undefined,
      observations: form.observations || undefined,
      activities: [],
      recommendations: [],
      photoUrls: [],
      nextVisitDate: form.nextVisitDate || undefined,
    });
    navigate(`/fincas/${farmId}/visitas/${visitId}`);
  };

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current="Nueva Visita"
      />
      <PageHeader title="Nueva Visita" subtitle="Registrar visita técnica de campo" />

      <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Fecha</label>
            <input
              className="input-field"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Tipo de visita</label>
            <select
              className="input-field"
              value={form.visitType}
              onChange={(e) => setForm({ ...form, visitType: e.target.value })}
            >
              <option value="Diagnóstico">Diagnóstico</option>
              <option value="Seguimiento">Seguimiento</option>
              <option value="Capacitación">Capacitación</option>
              <option value="Emergencia">Emergencia</option>
            </select>
          </div>
          <div>
            <label className="label">Técnico responsable</label>
            <select
              className="input-field"
              required
              value={form.technician}
              onChange={(e) => setForm({ ...form, technician: e.target.value })}
            >
              {TECHNICIANS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Clima</label>
            <select
              className="input-field"
              value={form.weather}
              onChange={(e) => setForm({ ...form, weather: e.target.value })}
            >
              <option value="Soleado">Soleado</option>
              <option value="Parcialmente nublado">Parcialmente nublado</option>
              <option value="Nublado">Nublado</option>
              <option value="Lluvioso">Lluvioso</option>
            </select>
          </div>
          <div>
            <label className="label">Próxima visita</label>
            <input
              className="input-field"
              type="date"
              value={form.nextVisitDate}
              onChange={(e) =>
                setForm({ ...form, nextVisitDate: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="label">Observaciones generales</label>
          <textarea
            className="input-field min-h-[100px]"
            value={form.observations}
            onChange={(e) =>
              setForm({ ...form, observations: e.target.value })
            }
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">Guardar</button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(`/fincas/${farmId}/visitas`)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
