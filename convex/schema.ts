import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  invoice: defineTable({
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    clientTIN: v.optional(v.string()),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      })
    ),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    totalAmount: v.number(),
    updatedAt: v.number(),
    date: v.number(),
  }),

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
          value: v.string(),
        })
      )
    ),
    tags: v.optional(v.array(v.string())),
    images: v.array(v.string()),
    warranty: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("draft")
    ),
    updatedAt: v.string(),
    createdBy: v.id("users"),
  })
    .index("by_category", ["category"])
    .index("by_status", ["status"]),

  facture: defineTable({
    clientName: v.string(),
    factureNumber: v.optional(v.number()),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
        totalPrice: v.number(),
      })
    ),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    totalAmount: v.number(),
    date: v.number(),
  }),
});
