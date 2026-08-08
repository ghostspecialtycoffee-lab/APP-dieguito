import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const diagnosticValidator = v.object({
  _id: v.id("diagnostics"),
  _creationTime: v.number(),
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
});

export const getByFarm = query({
  args: { farmId: v.id("farms") },
  returns: v.union(diagnosticValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("diagnostics")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .first();
  },
});

export const upsert = mutation({
  args: {
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
  },
  returns: v.id("diagnostics"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("diagnostics")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .first();

    const data = {
      farmId: args.farmId,
      cropAge: args.cropAge,
      spacing: args.spacing,
      shadeType: args.shadeType,
      sowingSystem: args.sowingSystem,
      fertilizationFreq: args.fertilizationFreq,
      lastFertilization: args.lastFertilization,
      observations: args.observations,
      soilPh: args.soilPh,
      organicMatter: args.organicMatter,
      phosphorus: args.phosphorus,
      potassium: args.potassium,
      calcium: args.calcium,
      magnesium: args.magnesium,
      aluminum: args.aluminum,
      soilPdfName: args.soilPdfName,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("diagnostics", data);
  },
});
