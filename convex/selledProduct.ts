// create a product mutation
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getImageUrls = query({
  args: { imageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    // Map each storage ID to its URL
    const urls = await Promise.all(
      args.imageIds.map((id) => ctx.storage.getUrl(id))
    );
    return urls;
  },
});

export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    brand: v.string(),
    category: v.string(),
    price: v.number(),
    stock: v.number(),
    serialNumber: v.string(),
    images: v.array(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("draft")
    ),
    updatedAt: v.string(),
    condition: v.union(
      v.literal("Like New"),
      v.literal("New"),
      v.literal("Good"),
      v.literal("Used")
    ),
    badge: v.union(
      v.literal("NEW"),
      v.literal("HOT"),
      v.literal("SALE"),
      v.literal("Deals")
    ),
    views: v.optional(v.number()),
    likes: v.optional(v.number()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("selledProducts", args);
  },
});

export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    brand: v.optional(v.string()),
    category: v.optional(v.string()),
    price: v.optional(v.number()),
    stock: v.optional(v.number()),
    serialNumber: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("draft")
      )
    ),
    updatedAt: v.string(),
    condition: v.optional(
      v.union(
        v.literal("Like New"),
        v.literal("New"),
        v.literal("Good"),
        v.literal("Used")
      )
    ),
    badge: v.optional(
      v.union(
        v.literal("NEW"),
        v.literal("HOT"),
        v.literal("SALE"),
        v.literal("Deals")
      )
    ),
    views: v.optional(v.number()),
    likes: v.optional(v.number()),
    rating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const getAllProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("selledProducts").order("desc").collect();
  },
});
export const getSelledProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("selledProducts")
      .withIndex("by_status", (q) => q.eq(("status"), "active"))
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        ...(Array.isArray(product.images) && product.images.length > 0
          ? {
              imageUrls: await Promise.all(
                product.images.map((imageId) => ctx.storage.getUrl(imageId))
              ),
            }
          : {}),
      }))
    );
  },
});

export const getDealsProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("selledProducts")
      .filter((q) => q.eq(q.field("badge"), "Deals"))
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        ...(Array.isArray(product.images) && product.images.length > 0
          ? {
              imageUrls: await Promise.all(
                product.images.map((imageId) => ctx.storage.getUrl(imageId))
              ),
            }
          : {}),
      }))
    );
  },
});
export const getHotProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("selledProducts")
      .filter((q) => q.eq(q.field("badge"), "HOT"))
      .order("desc")
      .collect();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        ...(Array.isArray(product.images) && product.images.length > 0
          ? {
              imageUrls: await Promise.all(
                product.images.map((imageId) => ctx.storage.getUrl(imageId))
              ),
            }
          : {}),
      }))
    );
  },
});



export const deleteProduct = mutation({
  args: {
    id: v.id("selledProducts"),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the product to verify it exists
    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Product not found");
    }

    // 2. Delete associated images from storage if any
    if (Array.isArray(product.images) && product.images.length > 0) {
      await Promise.all(
        product.images.map((imageId) => ctx.storage.delete(imageId))
      );
    }

    // 3. Delete the product document
    await ctx.db.delete(args.id);

    // 4. Return success flag
    return { success: true };
  },
});
