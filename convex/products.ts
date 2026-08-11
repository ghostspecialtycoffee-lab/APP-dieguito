import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const categoryValidator = v.union(
  v.literal("bebida"),
  v.literal("comida"),
  v.literal("otro"),
);

const productDocValidator = v.object({
  _id: v.id("products"),
  _creationTime: v.number(),
  name: v.string(),
  category: categoryValidator,
  price: v.number(),
  active: v.boolean(),
  createdAt: v.number(),
});

export const list = query({
  args: {
    activeOnly: v.optional(v.boolean()),
  },
  returns: v.array(productDocValidator),
  handler: async (ctx, args) => {
    if (args.activeOnly) {
      return await ctx.db
        .query("products")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect();
    }
    return await ctx.db.query("products").collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    category: categoryValidator,
    price: v.number(),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    if (args.name.trim().length === 0) {
      throw new Error("El nombre del producto es obligatorio");
    }
    if (args.price < 0) {
      throw new Error("El precio no puede ser negativo");
    }
    return await ctx.db.insert("products", {
      name: args.name.trim(),
      category: args.category,
      price: args.price,
      active: true,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    category: v.optional(categoryValidator),
    price: v.optional(v.number()),
    active: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get("products", args.productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    const updates: {
      name?: string;
      category?: "bebida" | "comida" | "otro";
      price?: number;
      active?: boolean;
    } = {};
    if (args.name !== undefined) {
      if (args.name.trim().length === 0) {
        throw new Error("El nombre del producto es obligatorio");
      }
      updates.name = args.name.trim();
    }
    if (args.category !== undefined) updates.category = args.category;
    if (args.price !== undefined) {
      if (args.price < 0) {
        throw new Error("El precio no puede ser negativo");
      }
      updates.price = args.price;
    }
    if (args.active !== undefined) updates.active = args.active;
    await ctx.db.patch(args.productId, updates);
    return null;
  },
});

export const remove = mutation({
  args: { productId: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const product = await ctx.db.get("products", args.productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    await ctx.db.patch(args.productId, { active: false });
    return null;
  },
});
