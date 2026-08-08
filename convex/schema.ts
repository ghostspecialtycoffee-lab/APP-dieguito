import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  farms: defineTable({
    name: v.string(),
    owner: v.string(),
    address: v.string(),
    altitude: v.number(),
    areaHa: v.number(),
    plantCount: v.optional(v.number()),
    variety: v.optional(v.string()),
    sowingDate: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_name", ["name"]),

  diagnostics: defineTable({
    farmId: v.id("farms"),
    cropAge: v.optional(v.number()),
    spacing: v.optional(v.string()),
    shadeType: v.optional(v.string()),
    sowingSystem: v.optional(v.string()),
    fertilizationFreq: v.optional(v.string()),
    lastFertilization: v.optional(v.string()),
    observations: v.optional(v.string()),
    soilPh: v.optional(v.number()),
    organicMatter: v.optional(v.number()),
    phosphorus: v.optional(v.number()),
    potassium: v.optional(v.number()),
    calcium: v.optional(v.number()),
    magnesium: v.optional(v.number()),
    aluminum: v.optional(v.number()),
    soilPdfName: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_farm", ["farmId"]),

  workPlans: defineTable({
    farmId: v.id("farms"),
    objective: v.string(),
    activities: v.array(
      v.object({
        name: v.string(),
        completed: v.boolean(),
        inputs: v.optional(v.string()),
        scheduledDate: v.optional(v.string()),
      }),
    ),
    responsible: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_farm", ["farmId"]),

  visits: defineTable({
    farmId: v.id("farms"),
    date: v.string(),
    visitType: v.string(),
    technician: v.string(),
    weather: v.optional(v.string()),
    observations: v.optional(v.string()),
    activities: v.array(v.string()),
    recommendations: v.array(v.string()),
    photoUrls: v.array(v.string()),
    nextVisitDate: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_farm", ["farmId"])
    .index("by_farm_and_date", ["farmId", "date"]),

  alerts: defineTable({
    farmId: v.optional(v.id("farms")),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("visit"),
      v.literal("activity"),
      v.literal("general"),
    ),
    dueDate: v.optional(v.string()),
    read: v.boolean(),
    createdAt: v.number(),
  }).index("by_read", ["read"]),
});
