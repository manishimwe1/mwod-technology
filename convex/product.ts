// create a product mutation
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


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
    warranty:v.optional(v.number()),
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

export const getProductsWithImage = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
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

export const getProduct = query({
  args: {
    id: v.id('products')
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    
    // Get the user who created the product
    const user = await ctx.db.get(product.createdBy);
    
    return {
      ...product,
      createdByName: user?.name ?? 'Unknown User',
      ...(Array.isArray(product.images) && product.images.length > 0
        ? {
            imageUrls: await Promise.all(
              product.images.map((imageId) => ctx.storage.getUrl(imageId))
            ),
          }
        : {}),
    };
  }
});



