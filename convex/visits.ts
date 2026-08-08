import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const visitValidator = v.object({
  _id: v.id("visits"),
  _creationTime: v.number(),
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
});

export const listByFarm = query({
  args: { farmId: v.id("farms") },
  returns: v.array(visitValidator),
  handler: async (ctx, args) => {
    const visits = await ctx.db
      .query("visits")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .collect();
    return visits.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const get = query({
  args: { visitId: v.id("visits") },
  returns: v.union(visitValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.visitId);
  },
});

export const create = mutation({
  args: {
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
  },
  returns: v.id("visits"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("visits", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    visitId: v.id("visits"),
    date: v.optional(v.string()),
    visitType: v.optional(v.string()),
    technician: v.optional(v.string()),
    weather: v.optional(v.string()),
    observations: v.optional(v.string()),
    activities: v.optional(v.array(v.string())),
    recommendations: v.optional(v.array(v.string())),
    photoUrls: v.optional(v.array(v.string())),
    nextVisitDate: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { visitId, ...updates } = args;
    const patch: Record<string, unknown> = {};
    if (updates.date !== undefined) patch.date = updates.date;
    if (updates.visitType !== undefined) patch.visitType = updates.visitType;
    if (updates.technician !== undefined) patch.technician = updates.technician;
    if (updates.weather !== undefined) patch.weather = updates.weather;
    if (updates.observations !== undefined) patch.observations = updates.observations;
    if (updates.activities !== undefined) patch.activities = updates.activities;
    if (updates.recommendations !== undefined) patch.recommendations = updates.recommendations;
    if (updates.photoUrls !== undefined) patch.photoUrls = updates.photoUrls;
    if (updates.nextVisitDate !== undefined) patch.nextVisitDate = updates.nextVisitDate;
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(visitId, patch);
    }
    return null;
  },
});
