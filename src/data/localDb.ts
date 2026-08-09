import type {
  Alert,
  Diagnostic,
  Farm,
  LocalDatabase,
  Visit,
  WorkPlan,
  WorkPlanActivity,
} from "./types";

const STORAGE_KEY = "cafe-atc-local-v1";

const now = Date.now();

function seedDatabase(): LocalDatabase {
  const farm1: Farm = {
    _id: "farm_paraiso",
    _creationTime: now - 100000,
    name: "Finca El Paraíso",
    owner: "Juan Pérez",
    address: "Vereda La Bella, Manizales",
    altitude: 1650,
    areaHa: 2.5,
    plantCount: 5000,
    variety: "Castillo",
    sowingDate: "2019-06-15",
    createdAt: now - 100000,
  };
  const farm2: Farm = {
    _id: "farm_esperanza",
    _creationTime: now - 90000,
    name: "Finca La Esperanza",
    owner: "María Rodríguez",
    address: "Vereda El Rosario, Garzón, Huila",
    altitude: 1780,
    areaHa: 2.8,
    plantCount: 9500,
    variety: "Castillo",
    sowingDate: "2020-06-20",
    createdAt: now - 90000,
  };
  const farm3: Farm = {
    _id: "farm_sanjose",
    _creationTime: now - 80000,
    name: "Finca San José",
    owner: "José Antonio Vega",
    address: "Vereda San José, Neiva, Huila",
    altitude: 1520,
    areaHa: 4.2,
    plantCount: 15000,
    variety: "Colombia",
    sowingDate: "2018-11-10",
    createdAt: now - 80000,
  };

  const diagnostic: Diagnostic = {
    _id: "diag_paraiso",
    _creationTime: now - 50000,
    farmId: farm1._id,
    cropAge: 5,
    spacing: "2.0m x 1.0m",
    shadeType: "Plátano y Guamo",
    sowingSystem: "Tradicional",
    fertilizationFreq: "Cada 3 meses",
    lastFertilization: "2024-05-01",
    observations: "Buen desarrollo general",
    soilPh: 5.6,
    organicMatter: 3.2,
    phosphorus: 12,
    potassium: 0.35,
    calcium: 5.1,
    magnesium: 1.2,
    aluminum: 0.2,
    soilPdfName: "analisis_suelo_el_pariso.pdf",
    updatedAt: now - 50000,
  };

  const workPlan: WorkPlan = {
    _id: "plan_paraiso",
    _creationTime: now - 50000,
    farmId: farm1._id,
    objective: "Mejorar nutrición y productividad",
    activities: [
      {
        name: "Fertilización edáfica",
        completed: true,
        inputs: "Urea 200g/planta, Fosfato 150g/planta",
        scheduledDate: "2024-06-01",
      },
      {
        name: "Control de arvenses",
        completed: false,
        inputs: "Machete manual",
        scheduledDate: "2024-07-15",
      },
      {
        name: "Manejo de sombra",
        completed: false,
        inputs: "Recorte de plátano",
        scheduledDate: "2024-08-01",
      },
      {
        name: "Monitoreo de broca",
        completed: false,
        inputs: "Trampas de alcohol",
        scheduledDate: "2024-06-20",
      },
    ],
    responsible: "Ing. Ana Torres",
    scheduleStart: "2024-06-01",
    scheduleEnd: "2024-11-30",
    updatedAt: now - 50000,
  };

  const visit1: Visit = {
    _id: "visit_1",
    _creationTime: now - 40000,
    farmId: farm1._id,
    date: "2024-07-10",
    visitType: "Seguimiento",
    technician: "Ing. Ana Torres",
    weather: "Soleado",
    observations: "Cultivo en buen estado. Presencia leve de broca.",
    activities: [
      "Monitoreo de plagas",
      "Evaluación de fertilización",
      "Revisión de sombra",
    ],
    recommendations: [
      "Aplicar fertilización foliar",
      "Instalar trampas de broca",
      "Recortar sombra en lote 2",
    ],
    photoUrls: [],
    nextVisitDate: "2024-08-10",
    createdAt: now - 40000,
  };

  const visit2: Visit = {
    _id: "visit_2",
    _creationTime: now - 5000000,
    farmId: farm1._id,
    date: "2024-05-20",
    visitType: "Diagnóstico",
    technician: "Ing. Ana Torres",
    weather: "Parcialmente nublado",
    observations: "Diagnóstico inicial completo.",
    activities: [
      "Evaluación de lote",
      "Muestreo de suelo",
      "Registro fotográfico",
    ],
    recommendations: ["Aplicar cal dolomítica", "Programar fertilización"],
    photoUrls: [],
    nextVisitDate: "2024-07-10",
    createdAt: now - 5000000,
  };

  const alert1: Alert = {
    _id: "alert_1",
    _creationTime: now - 10000,
    farmId: farm1._id,
    title: "Visita programada",
    message: "Seguimiento en Finca El Paraíso",
    type: "visit",
    dueDate: "2024-08-10",
    read: false,
    createdAt: now - 10000,
  };

  const alert2: Alert = {
    _id: "alert_2",
    _creationTime: now - 20000,
    farmId: farm2._id,
    title: "Actividad pendiente",
    message: "Control de arvenses en Finca La Esperanza",
    type: "activity",
    dueDate: "2024-07-20",
    read: false,
    createdAt: now - 20000,
  };

  return {
    farms: [farm1, farm2, farm3],
    visits: [visit1, visit2],
    workPlans: [workPlan],
    diagnostics: [diagnostic],
    alerts: [alert1, alert2],
  };
}

export function loadDatabase(): LocalDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedDatabase();
      saveDatabase(seeded);
      return seeded;
    }
    return JSON.parse(raw) as LocalDatabase;
  } catch {
    const seeded = seedDatabase();
    saveDatabase(seeded);
    return seeded;
  }
}

export function saveDatabase(db: LocalDatabase): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function listFarms(db: LocalDatabase): Farm[] {
  return [...db.farms].sort((a, b) => b.createdAt - a.createdAt);
}

export function getFarm(db: LocalDatabase, farmId: string): Farm | null {
  return db.farms.find((f) => f._id === farmId) ?? null;
}

export function createFarm(
  db: LocalDatabase,
  args: Omit<Farm, "_id" | "_creationTime" | "createdAt">,
): string {
  const id = newId("farm");
  const t = Date.now();
  db.farms.push({
    _id: id,
    _creationTime: t,
    createdAt: t,
    ...args,
  });
  saveDatabase(db);
  return id;
}

export function updateFarm(
  db: LocalDatabase,
  farmId: string,
  patch: Partial<Farm>,
): void {
  const farm = db.farms.find((f) => f._id === farmId);
  if (!farm) return;
  Object.assign(farm, patch);
  saveDatabase(db);
}

export function listVisitsByFarm(db: LocalDatabase, farmId: string): Visit[] {
  return db.visits
    .filter((v) => v.farmId === farmId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getVisit(db: LocalDatabase, visitId: string): Visit | null {
  return db.visits.find((v) => v._id === visitId) ?? null;
}

export function createVisit(
  db: LocalDatabase,
  args: Omit<Visit, "_id" | "_creationTime" | "createdAt">,
): string {
  const id = newId("visit");
  const t = Date.now();
  db.visits.push({
    _id: id,
    _creationTime: t,
    createdAt: t,
    ...args,
  });
  saveDatabase(db);
  return id;
}

export function updateVisit(
  db: LocalDatabase,
  visitId: string,
  patch: Partial<Visit>,
): void {
  const visit = db.visits.find((v) => v._id === visitId);
  if (!visit) return;
  Object.assign(visit, patch);
  saveDatabase(db);
}

export function getDiagnosticByFarm(
  db: LocalDatabase,
  farmId: string,
): Diagnostic | null {
  return db.diagnostics.find((d) => d.farmId === farmId) ?? null;
}

export function upsertDiagnostic(
  db: LocalDatabase,
  args: Omit<Diagnostic, "_id" | "_creationTime" | "updatedAt">,
): string {
  const existing = db.diagnostics.find((d) => d.farmId === args.farmId);
  const t = Date.now();
  if (existing) {
    Object.assign(existing, { ...args, updatedAt: t });
    saveDatabase(db);
    return existing._id;
  }
  const id = newId("diag");
  db.diagnostics.push({
    _id: id,
    _creationTime: t,
    updatedAt: t,
    ...args,
  });
  saveDatabase(db);
  return id;
}

export function getWorkPlanByFarm(
  db: LocalDatabase,
  farmId: string,
): WorkPlan | null {
  return db.workPlans.find((p) => p.farmId === farmId) ?? null;
}

export function upsertWorkPlan(
  db: LocalDatabase,
  args: {
    farmId: string;
    objective: string;
    activities: WorkPlanActivity[];
    responsible?: string;
    scheduleStart?: string;
    scheduleEnd?: string;
  },
): string {
  const existing = db.workPlans.find((p) => p.farmId === args.farmId);
  const t = Date.now();
  if (existing) {
    Object.assign(existing, { ...args, updatedAt: t });
    saveDatabase(db);
    return existing._id;
  }
  const id = newId("plan");
  db.workPlans.push({
    _id: id,
    _creationTime: t,
    updatedAt: t,
    ...args,
  });
  saveDatabase(db);
  return id;
}

export function listAlerts(db: LocalDatabase): Alert[] {
  return [...db.alerts].sort((a, b) => b.createdAt - a.createdAt);
}

export function markAlertRead(db: LocalDatabase, alertId: string): void {
  const alert = db.alerts.find((a) => a._id === alertId);
  if (!alert) return;
  alert.read = true;
  saveDatabase(db);
}
