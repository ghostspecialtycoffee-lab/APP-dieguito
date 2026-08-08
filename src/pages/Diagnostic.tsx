import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import type { Id } from "../../convex/_generated/dataModel";
import { useEffect, useState } from "react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";

export default function Diagnostic() {
  const { farmId } = useParams<{ farmId: string }>();
  const farm = useQuery(
    api.farms.get,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const diagnostic = useQuery(
    api.diagnostics.getByFarm,
    farmId ? { farmId: farmId as Id<"farms"> } : "skip",
  );
  const upsert = useMutation(api.diagnostics.upsert);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    cropAge: "",
    spacing: "",
    shadeType: "",
    sowingSystem: "",
    fertilizationFreq: "",
    lastFertilization: "",
    observations: "",
    soilPh: "",
    organicMatter: "",
    phosphorus: "",
    potassium: "",
    calcium: "",
    magnesium: "",
    aluminum: "",
    soilPdfName: "",
  });

  useEffect(() => {
    if (diagnostic) {
      setForm({
        cropAge: diagnostic.cropAge?.toString() ?? "",
        spacing: diagnostic.spacing ?? "",
        shadeType: diagnostic.shadeType ?? "",
        sowingSystem: diagnostic.sowingSystem ?? "",
        fertilizationFreq: diagnostic.fertilizationFreq ?? "",
        lastFertilization: diagnostic.lastFertilization ?? "",
        observations: diagnostic.observations ?? "",
        soilPh: diagnostic.soilPh?.toString() ?? "",
        organicMatter: diagnostic.organicMatter?.toString() ?? "",
        phosphorus: diagnostic.phosphorus?.toString() ?? "",
        potassium: diagnostic.potassium?.toString() ?? "",
        calcium: diagnostic.calcium?.toString() ?? "",
        magnesium: diagnostic.magnesium?.toString() ?? "",
        aluminum: diagnostic.aluminum?.toString() ?? "",
        soilPdfName: diagnostic.soilPdfName ?? "",
      });
    }
  }, [diagnostic]);

  if (!farmId || farm === undefined || diagnostic === undefined) {
    return <LoadingState />;
  }
  if (farm === null) return <div>Finca no encontrada.</div>;

  const num = (v: string) => (v ? Number(v) : undefined);

  const handleSave = async () => {
    await upsert({
      farmId: farmId as Id<"farms">,
      cropAge: num(form.cropAge),
      spacing: form.spacing || undefined,
      shadeType: form.shadeType || undefined,
      sowingSystem: form.sowingSystem || undefined,
      fertilizationFreq: form.fertilizationFreq || undefined,
      lastFertilization: form.lastFertilization || undefined,
      observations: form.observations || undefined,
      soilPh: num(form.soilPh),
      organicMatter: num(form.organicMatter),
      phosphorus: num(form.phosphorus),
      potassium: num(form.potassium),
      calcium: num(form.calcium),
      magnesium: num(form.magnesium),
      aluminum: num(form.aluminum),
      soilPdfName: form.soilPdfName || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <FarmBreadcrumb
        farmId={farm._id}
        farmName={farm.name}
        current="Diagnóstico"
      />
      <PageHeader
        title="Diagnóstico Inicial"
        subtitle="Características del lote, manejo y análisis de suelos"
      />

      <div className="space-y-6">
        <section className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Información del cultivo</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Edad del cultivo (años)</label>
              <input
                className="input-field"
                type="number"
                value={form.cropAge}
                onChange={(e) => setForm({ ...form, cropAge: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Distanciamiento</label>
              <input
                className="input-field"
                placeholder="2.0m x 1.0m"
                value={form.spacing}
                onChange={(e) => setForm({ ...form, spacing: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Tipo de sombra</label>
              <input
                className="input-field"
                value={form.shadeType}
                onChange={(e) => setForm({ ...form, shadeType: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Sistema de siembra</label>
              <input
                className="input-field"
                value={form.sowingSystem}
                onChange={(e) =>
                  setForm({ ...form, sowingSystem: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Frecuencia de fertilización</label>
              <input
                className="input-field"
                value={form.fertilizationFreq}
                onChange={(e) =>
                  setForm({ ...form, fertilizationFreq: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Última fertilización</label>
              <input
                className="input-field"
                type="date"
                value={form.lastFertilization}
                onChange={(e) =>
                  setForm({ ...form, lastFertilization: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="label">Observaciones generales</label>
            <textarea
              className="input-field min-h-[80px]"
              value={form.observations}
              onChange={(e) =>
                setForm({ ...form, observations: e.target.value })
              }
            />
          </div>
        </section>

        <section className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Análisis de suelos</h3>
          <div>
            <label className="label">Archivo PDF (nombre de referencia)</label>
            <input
              className="input-field"
              placeholder="analisis_suelo.pdf"
              value={form.soilPdfName}
              onChange={(e) =>
                setForm({ ...form, soilPdfName: e.target.value })
              }
            />
          </div>
          <h4 className="text-sm font-medium text-coffee-700">
            Resumen del análisis
          </h4>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { key: "soilPh", label: "pH" },
              { key: "organicMatter", label: "Materia orgánica (%)" },
              { key: "phosphorus", label: "Fósforo (P)" },
              { key: "potassium", label: "Potasio (K)" },
              { key: "calcium", label: "Calcio (Ca)" },
              { key: "magnesium", label: "Magnesio (Mg)" },
              { key: "aluminum", label: "Aluminio (Al)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input-field"
                  type="number"
                  step="0.1"
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </section>

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
