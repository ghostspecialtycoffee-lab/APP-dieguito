import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Camera, Plus, X } from "lucide-react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";
import {
  useFarm,
  useUpdateVisit,
  useVisit,
} from "../api/hooks";

export default function VisitDetail() {
  const { farmId, visitId } = useParams<{ farmId: string; visitId: string }>();
  const farm = useFarm(farmId);
  const visit = useVisit(visitId);
  const updateVisit = useUpdateVisit();
  const [saved, setSaved] = useState(false);

  const [activities, setActivities] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState("");
  const [newRecommendation, setNewRecommendation] = useState("");

  useEffect(() => {
    if (visit) {
      setActivities(visit.activities);
      setRecommendations(visit.recommendations);
    }
  }, [visit]);

  if (!farmId || !visitId || farm === undefined || visit === undefined) {
    return <LoadingState />;
  }
  if (farm === null || visit === null) {
    return <div>Visita no encontrada.</div>;
  }

  const handleSave = async () => {
    await updateVisit({
      visitId: visit._id,
      activities,
      recommendations,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity("");
    }
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setRecommendations([...recommendations, newRecommendation.trim()]);
      setNewRecommendation("");
    }
  };

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current={`Visita ${visit.date}`}
      />
      <PageHeader
        title={`${visit.visitType} — ${visit.date}`}
        subtitle={`${visit.technician}${visit.weather ? ` · ${visit.weather}` : ""}`}
      />

      {visit.observations && (
        <div className="card mb-6">
          <h3 className="font-semibold text-coffee-900">Observaciones</h3>
          <p className="mt-2 text-sm text-coffee-700">{visit.observations}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Actividades realizadas</h3>
          <ul className="space-y-2">
            {activities.map((act, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-coffee-50 px-3 py-2 text-sm"
              >
                {act}
                <button
                  type="button"
                  onClick={() =>
                    setActivities(activities.filter((_, j) => j !== i))
                  }
                  className="text-coffee-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Nueva actividad"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
            />
            <button type="button" className="btn-secondary" onClick={addActivity}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Recomendaciones</h3>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-coffee-50 px-3 py-2 text-sm"
              >
                {rec}
                <button
                  type="button"
                  onClick={() =>
                    setRecommendations(
                      recommendations.filter((_, j) => j !== i),
                    )
                  }
                  className="text-coffee-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Nueva recomendación"
              value={newRecommendation}
              onChange={(e) => setNewRecommendation(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={addRecommendation}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="mb-4 font-semibold text-coffee-900">
          Evidencias fotográficas
        </h3>
        <div className="flex flex-wrap gap-3">
          {visit.photoUrls.map((url, i) => (
            <div
              key={i}
              className="h-24 w-24 rounded-lg bg-coffee-100 flex items-center justify-center text-xs text-coffee-500"
            >
              {url || `Foto ${i + 1}`}
            </div>
          ))}
          <button
            type="button"
            className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-coffee-300 text-coffee-500 hover:border-coffee-500"
          >
            <Camera className="h-8 w-8" />
          </button>
        </div>
        <p className="mt-2 text-xs text-coffee-500">
          La carga de fotos estará disponible en una versión futura.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={handleSave}>
          Guardar
        </button>
        {saved && (
          <span className="text-sm text-coffee-600">Guardado correctamente</span>
        )}
      </div>
    </div>
  );
}
