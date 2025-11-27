import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const add = mutation({
  args: {
    productId: v.id("products"),
    userId: v.id("user"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const existingCartItem = await ctx.db
      .query("cart")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingCartItem) {
      await ctx.db.patch(existingCartItem._id, {
        quantity: existingCartItem.quantity + args.quantity,
      });
      return existingCartItem._id;
    } else {
      const cartId = await ctx.db.insert("cart", {
        productId: args.productId,
        userId: args.userId,
        quantity: args.quantity,
      });
      return cartId;
    }
  },
});

export const remove = mutation({
  args: {
    productId: v.id("products"),
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const existingCartItem = await ctx.db
      .query("cart")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", args.userId).eq("productId", args.productId)
      )
      .first();

    if (existingCartItem) {
      await ctx.db.delete(existingCartItem._id);
      return true;
    }
    return false;
  },
});

export const updateQuantity = mutation({
  args: {
    cartId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.cartId, {
      quantity: args.quantity,
    });
  },
});

export const get = query({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const productsInCart = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return product ? { ...product, quantity: item.quantity, cartId: item._id } : null;
      })
    );

    return productsInCart.filter(Boolean);
  },
});