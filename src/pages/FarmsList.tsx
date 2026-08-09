import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, MapPin } from "lucide-react";
import { useState } from "react";
import { EmptyState, LoadingState, PageHeader } from "../components/ui";
import { useCreateFarm, useFarmsList } from "../api/hooks";

export default function FarmsList() {
  const farms = useFarmsList();
  const createFarm = useCreateFarm();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    owner: "",
    address: "",
    altitude: "",
    areaHa: "",
  });

  if (farms === undefined) return <LoadingState />;

  const filtered = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await createFarm({
      name: form.name,
      owner: form.owner,
      address: form.address,
      altitude: Number(form.altitude),
      areaHa: Number(form.areaHa),
    });
    setShowForm(false);
    setForm({ name: "", owner: "", address: "", altitude: "", areaHa: "" });
    navigate(`fincas/${id}`);
  };

  return (
    <div>
      <PageHeader
        title="Fincas"
        subtitle="Registro y gestión de fincas cafeteras"
        action={
          <button
            type="button"
            className="btn-primary flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-4 w-4" />
            Nueva Finca
          </button>
        }
      />

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-coffee-400" />
        <input
          type="search"
          placeholder="Buscar finca…"
          className="input-field pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-6 space-y-4">
          <h3 className="font-semibold text-coffee-900">Registrar nueva finca</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Nombre</label>
              <input
                className="input-field"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Propietario</label>
              <input
                className="input-field"
                required
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Ubicación</label>
              <input
                className="input-field"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Altitud (msnm)</label>
              <input
                className="input-field"
                type="number"
                required
                value={form.altitude}
                onChange={(e) => setForm({ ...form, altitude: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Área (ha)</label>
              <input
                className="input-field"
                type="number"
                step="0.1"
                required
                value={form.areaHa}
                onChange={(e) => setForm({ ...form, areaHa: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">Guardar</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          message="No hay fincas registradas."
          action={
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShowForm(true)}
            >
              Registrar primera finca
            </button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((farm) => (
            <Link
              key={farm._id}
              to={`/fincas/${farm._id}`}
              className="card flex items-center gap-4 transition hover:border-coffee-400 hover:shadow-md"
            >
              <div className="rounded-lg bg-coffee-100 p-3">
                <MapPin className="h-5 w-5 text-coffee-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-coffee-900">{farm.name}</h3>
                <p className="text-sm text-coffee-600 truncate">{farm.address}</p>
                <p className="text-xs text-coffee-500">
                  {farm.altitude} m.s.n.m. · {farm.areaHa} ha
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
