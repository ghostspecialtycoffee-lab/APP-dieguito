import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const activityValidator = v.object({
  name: v.string(),
  completed: v.boolean(),
  inputs: v.optional(v.string()),
  scheduledDate: v.optional(v.string()),
});

const workPlanValidator = v.object({
  _id: v.id("workPlans"),
  _creationTime: v.number(),
  farmId: v.id("farms"),
  objective: v.string(),
  activities: v.array(activityValidator),
  responsible: v.optional(v.string()),
  scheduleStart: v.optional(v.string()),
  scheduleEnd: v.optional(v.string()),
  updatedAt: v.number(),
});

export const getByFarm = query({
  args: { farmId: v.id("farms") },
  returns: v.union(workPlanValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workPlans")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .first();
  },
});

export const upsert = mutation({
  args: {
    farmId: v.id("farms"),
    objective: v.string(),
    activities: v.array(activityValidator),
    responsible: v.optional(v.string()),
    scheduleStart: v.optional(v.string()),
    scheduleEnd: v.optional(v.string()),
  },
  returns: v.id("workPlans"),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("workPlans")
      .withIndex("by_farm", (q) => q.eq("farmId", args.farmId))
      .first();

    const data = {
      farmId: args.farmId,
      objective: args.objective,
      activities: args.activities,
      responsible: args.responsible,
      scheduleStart: args.scheduleStart,
      scheduleEnd: args.scheduleEnd,
      updatedAt: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }

    return await ctx.db.insert("workPlans", data);
  },
});
