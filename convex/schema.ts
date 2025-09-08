import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    pictureUrl: v.string(),
    email: v.string(),
    emailVerified: v.boolean(),
    updatedAt: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  
  products: defineTable({
    name: v.string(),
    description: v.string(),
    brand: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    currency: v.string(),
    stock: v.number(),
    sku: v.string(),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    isNew: v.boolean(),
    isOnSale: v.boolean(),
    specifications: v.optional(
      v.array(
        v.object({
          key: v.string(),
          value: v.string()
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    images: v.array(v.string()),
    warranty: v.optional(v.string()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("draft")
    ),
    updatedAt: v.string(),
    createdBy:v.id('users')
  })
  .index("by_category", ["category"])
  .index("by_status", ["status"])
})
