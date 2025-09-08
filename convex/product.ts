// create a product mutation
import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createProduct = mutation({
  args: {
    name:v.string(),
    description:v.string(),
    brand:v.string(),
    category:v.string(),
    price:v.number(),
    originalPrice:v.optional(v.number()),
    currency:v.string(),
    stock:v.number(),
    sku:v.string(),
    rating:v.optional(v.number()),
    reviewCount:v.optional(v.number()),
    isNew:v.boolean(),
    isOnSale:v.boolean(),
    specifications:v.optional(
     v.array(
       v.object({
          key:v.string(),
          value:v.string()
        })
      )
    ),
    tags:v.optional(v.array(v.string())),
    images:v.array(v.string()),
    warranty:v.optional(v.string()),
    status:v.union(
     v.literal("active"),
     v.literal("inactive"),
     v.literal("draft")
    ),
    updatedAt:v.string(),
    createdBy:v.id('users')
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  }
});


