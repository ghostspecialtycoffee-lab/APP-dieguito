import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("farms"),
      _creationTime: v.number(),
      name: v.string(),
      owner: v.string(),
      address: v.string(),
      altitude: v.number(),
      areaHa: v.number(),
      plantCount: v.optional(v.number()),
      variety: v.optional(v.string()),
      sowingDate: v.optional(v.string()),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("farms").order("desc").collect();
  },
});

export const get = query({
  args: { farmId: v.id("farms") },
  returns: v.union(
    v.object({
      _id: v.id("farms"),
      _creationTime: v.number(),
      name: v.string(),
      owner: v.string(),
      address: v.string(),
      altitude: v.number(),
      areaHa: v.number(),
      plantCount: v.optional(v.number()),
      variety: v.optional(v.string()),
      sowingDate: v.optional(v.string()),
      createdAt: v.number(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.farmId);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    owner: v.string(),
    address: v.string(),
    altitude: v.number(),
    areaHa: v.number(),
    plantCount: v.optional(v.number()),
    variety: v.optional(v.string()),
    sowingDate: v.optional(v.string()),
  },
  returns: v.id("farms"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("farms", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    farmId: v.id("farms"),
    name: v.optional(v.string()),
    owner: v.optional(v.string()),
    address: v.optional(v.string()),
    altitude: v.optional(v.number()),
    areaHa: v.optional(v.number()),
    plantCount: v.optional(v.number()),
    variety: v.optional(v.string()),
    sowingDate: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { farmId, ...updates } = args;
    const patch: Record<string, unknown> = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.owner !== undefined) patch.owner = updates.owner;
    if (updates.address !== undefined) patch.address = updates.address;
    if (updates.altitude !== undefined) patch.altitude = updates.altitude;
    if (updates.areaHa !== undefined) patch.areaHa = updates.areaHa;
    if (updates.plantCount !== undefined) patch.plantCount = updates.plantCount;
    if (updates.variety !== undefined) patch.variety = updates.variety;
    if (updates.sowingDate !== undefined) patch.sowingDate = updates.sowingDate;
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(farmId, patch);
    }
    return null;
  },
});

export const remove = mutation({
  args: { farmId: v.id("farms") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.farmId);
    return null;
  },
});
