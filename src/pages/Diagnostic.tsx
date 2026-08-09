import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FarmBreadcrumb, LoadingState, PageHeader } from "../components/ui";
import {
  useDiagnosticByFarm,
  useFarm,
  useUpdateFarm,
  useUpsertDiagnostic,
} from "../api/hooks";

type TabId = "informacion" | "cultivo" | "suelos";

const tabs: { id: TabId; label: string }[] = [
  { id: "informacion", label: "Información" },
  { id: "cultivo", label: "Cultivo" },
  { id: "suelos", label: "Suelos" },
];

const soilFields: { key: string; label: string }[] = [
  { key: "soilPh", label: "pH" },
  { key: "organicMatter", label: "Materia orgánica (%)" },
  { key: "phosphorus", label: "Fósforo (P) ppm" },
  { key: "potassium", label: "Potasio (K) meq/100g" },
  { key: "calcium", label: "Calcio (Ca) meq/100g" },
  { key: "magnesium", label: "Magnesio (Mg) meq/100g" },
  { key: "aluminum", label: "Aluminio (Al) meq/100g" },
];

type DiagnosticProps = {
  initialTab?: TabId;
};

export default function Diagnostic({ initialTab = "informacion" }: DiagnosticProps) {
  const { farmId } = useParams<{ farmId: string }>();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const farm = useFarm(farmId);
  const diagnostic = useDiagnosticByFarm(farmId);
  const upsertDiagnostic = useUpsertDiagnostic();
  const updateFarm = useUpdateFarm();
  const [saved, setSaved] = useState(false);

  const [farmForm, setFarmForm] = useState({
    owner: "",
    address: "",
    altitude: "",
    areaHa: "",
    plantCount: "",
    variety: "",
    sowingDate: "",
  });

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
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (farm) {
      setFarmForm({
        owner: farm.owner,
        address: farm.address,
        altitude: farm.altitude.toString(),
        areaHa: farm.areaHa.toString(),
        plantCount: farm.plantCount?.toString() ?? "",
        variety: farm.variety ?? "",
        sowingDate: farm.sowingDate ?? "",
      });
    }
  }, [farm]);

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
    await updateFarm({
      farmId: farm._id,
      owner: farmForm.owner,
      address: farmForm.address,
      altitude: Number(farmForm.altitude),
      areaHa: Number(farmForm.areaHa),
      plantCount: num(farmForm.plantCount),
      variety: farmForm.variety || undefined,
      sowingDate: farmForm.sowingDate || undefined,
    });

    await upsertDiagnostic({
      farmId: farmId!,
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
        subtitle={`${farm.name} — características del lote y análisis de suelos`}
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-coffee-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-coffee-600 text-coffee-800"
                : "border-transparent text-coffee-500 hover:text-coffee-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "informacion" && (
        <section className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Información general</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nombre de la finca</label>
              <p className="input-field bg-coffee-50">{farm.name}</p>
            </div>
            <div>
              <label className="label">Propietario</label>
              <input
                className="input-field"
                value={farmForm.owner}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, owner: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Ubicación</label>
              <input
                className="input-field"
                value={farmForm.address}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, address: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Altitud (m.s.n.m.)</label>
              <input
                className="input-field"
                type="number"
                value={farmForm.altitude}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, altitude: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Área del lote (ha)</label>
              <input
                className="input-field"
                type="number"
                step="0.1"
                value={farmForm.areaHa}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, areaHa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Número de plantas</label>
              <input
                className="input-field"
                type="number"
                value={farmForm.plantCount}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, plantCount: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Variedad</label>
              <input
                className="input-field"
                value={farmForm.variety}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, variety: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Fecha de siembra</label>
              <input
                className="input-field"
                type="date"
                value={farmForm.sowingDate}
                onChange={(e) =>
                  setFarmForm({ ...farmForm, sowingDate: e.target.value })
                }
              />
            </div>
          </div>
        </section>
      )}

      {activeTab === "cultivo" && (
        <section className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Manejo del cultivo</h3>
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
              <label className="label">Sombra</label>
              <input
                className="input-field"
                placeholder="Plátano y Guamo"
                value={form.shadeType}
                onChange={(e) =>
                  setForm({ ...form, shadeType: e.target.value })
                }
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
                placeholder="Cada 3 meses"
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
            <label className="label">Observaciones</label>
            <textarea
              className="input-field min-h-[80px]"
              placeholder="Buen desarrollo general"
              value={form.observations}
              onChange={(e) =>
                setForm({ ...form, observations: e.target.value })
              }
            />
          </div>
        </section>
      )}

      {activeTab === "suelos" && (
        <section className="card space-y-4">
          <h3 className="font-semibold text-coffee-900">Análisis de suelos</h3>
          <div>
            <label className="label">Adjuntar análisis PDF</label>
            <input
              className="input-field"
              placeholder="analisis_suelo.pdf"
              value={form.soilPdfName}
              onChange={(e) =>
                setForm({ ...form, soilPdfName: e.target.value })
              }
            />
            <p className="mt-1 text-xs text-coffee-500">
              Referencia del archivo de laboratorio (carga de archivo próximamente)
            </p>
          </div>
          <h4 className="text-sm font-medium text-coffee-700">
            Resumen del análisis
          </h4>
          <div className="grid gap-4 sm:grid-cols-3">
            {soilFields.map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  value={form[key as keyof typeof form]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={handleSave}>
          {activeTab === "suelos" ? "Editar / Guardar" : "Guardar"}
        </button>
        {saved && (
          <span className="text-sm text-coffee-600">Guardado correctamente</span>
        )}
      </div>
    </div>
  );
}
