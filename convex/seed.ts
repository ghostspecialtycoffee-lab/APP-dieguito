import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seed = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existing = await ctx.db.query("farms").first();
    if (existing) return null;

    const farm1 = await ctx.db.insert("farms", {
      name: "Finca El Paraíso",
      owner: "Carlos Mendoza",
      address: "Vereda La Esperanza, Pitalito, Huila",
      altitude: 1650,
      areaHa: 3.5,
      plantCount: 12000,
      variety: "Caturra",
      sowingDate: "2019-03-15",
      createdAt: Date.now(),
    });

    const farm2 = await ctx.db.insert("farms", {
      name: "Finca La Esperanza",
      owner: "María Rodríguez",
      address: "Vereda El Rosario, Garzón, Huila",
      altitude: 1780,
      areaHa: 2.8,
      plantCount: 9500,
      variety: "Castillo",
      sowingDate: "2020-06-20",
      createdAt: Date.now(),
    });

    const farm3 = await ctx.db.insert("farms", {
      name: "Finca San José",
      owner: "José Antonio Vega",
      address: "Vereda San José, Neiva, Huila",
      altitude: 1520,
      areaHa: 4.2,
      plantCount: 15000,
      variety: "Colombia",
      sowingDate: "2018-11-10",
      createdAt: Date.now(),
    });

    await ctx.db.insert("diagnostics", {
      farmId: farm1,
      cropAge: 5,
      spacing: "2.0m x 1.0m",
      shadeType: "Plátano y Guamo",
      sowingSystem: "Tradicional",
      fertilizationFreq: "Cada 3 meses",
      lastFertilization: "2026-05-15",
      observations:
        "Cultivo en buen estado general. Presencia leve de broca en lote bajo.",
      soilPh: 5.2,
      organicMatter: 4.8,
      phosphorus: 28,
      potassium: 180,
      calcium: 1200,
      magnesium: 280,
      aluminum: 0.5,
      soilPdfName: "analisis_suelo_el_pariso.pdf",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("workPlans", {
      farmId: farm1,
      objective: "Mejorar nutrición y productividad del cultivo de café",
      activities: [
        {
          name: "Fertilización edáfica",
          completed: true,
          inputs: "Urea 200g/planta",
          scheduledDate: "2026-06-01",
        },
        {
          name: "Control de arvenses",
          completed: false,
          inputs: "Machete manual",
          scheduledDate: "2026-07-15",
        },
        {
          name: "Manejo de sombra",
          completed: false,
          inputs: "Recorte de plátano",
          scheduledDate: "2026-08-01",
        },
        {
          name: "Monitoreo de broca",
          completed: false,
          inputs: "Trampas de alcohol",
          scheduledDate: "2026-06-20",
        },
      ],
      responsible: "Ing. Ana Torres",
      updatedAt: Date.now(),
    });

    await ctx.db.insert("visits", {
      farmId: farm1,
      date: "2026-07-10",
      visitType: "Seguimiento",
      technician: "Ing. Ana Torres",
      weather: "Soleado",
      observations: "Cultivo en buen estado. Se observó presencia leve de broca.",
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
      nextVisitDate: "2026-08-10",
      createdAt: Date.now(),
    });

    await ctx.db.insert("visits", {
      farmId: farm1,
      date: "2026-05-20",
      visitType: "Diagnóstico",
      technician: "Ing. Ana Torres",
      weather: "Parcialmente nublado",
      observations: "Diagnóstico inicial completo.",
      activities: [
        "Evaluación de lote",
        "Muestreo de suelo",
        "Registro fotográfico",
      ],
      recommendations: [
        "Aplicar cal dolomítica",
        "Programar fertilización",
      ],
      photoUrls: [],
      nextVisitDate: "2026-07-10",
      createdAt: Date.now() - 86400000 * 50,
    });

    await ctx.db.insert("alerts", {
      farmId: farm1,
      title: "Visita programada",
      message: "Seguimiento en Finca El Paraíso el 10 de agosto",
      type: "visit",
      dueDate: "2026-08-10",
      read: false,
      createdAt: Date.now(),
    });

    await ctx.db.insert("alerts", {
      farmId: farm2,
      title: "Actividad pendiente",
      message: "Control de arvenses en Finca La Esperanza",
      type: "activity",
      dueDate: "2026-07-20",
      read: false,
      createdAt: Date.now() - 3600000,
    });

    void farm2;
    void farm3;

    return null;
  },
});
