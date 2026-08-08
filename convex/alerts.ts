import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const alertValidator = v.object({
  _id: v.id("alerts"),
  _creationTime: v.number(),
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
});

export const list = query({
  args: {},
  returns: v.array(alertValidator),
  handler: async (ctx) => {
    const alerts = await ctx.db.query("alerts").order("desc").collect();
    return alerts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const markRead = mutation({
  args: { alertId: v.id("alerts") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.alertId, { read: true });
    return null;
  },
});

export const create = mutation({
  args: {
    farmId: v.optional(v.id("farms")),
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("visit"),
      v.literal("activity"),
      v.literal("general"),
    ),
    dueDate: v.optional(v.string()),
  },
  returns: v.id("alerts"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("alerts", {
      ...args,
      read: false,
      createdAt: Date.now(),
    });
  },
});
