import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    productId: v.id("products"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const existingWishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingWishlistItem) {
      return existingWishlistItem._id;
    }

    const wishlistId = await ctx.db.insert("wishlist", {
      productId: args.productId,
      userId: args.userId,
    });
    return wishlistId;
  },
});

export const remove = mutation({
  args: {
    productId: v.id("products"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const existingWishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingWishlistItem) {
      await ctx.db.delete(existingWishlistItem._id);
      return true;
    }
    return false;
  },
});

export const get = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const products = await Promise.all(
      wishlistItems.map((item) => ctx.db.get(item.productId))
    );

    return products.filter(Boolean);
  },
});

export const isProductInWishlist = query({
  args: {
    productId: v.id("products"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const existingWishlistItem = await ctx.db
      .query("wishlist")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    return !!existingWishlistItem;
  },
});