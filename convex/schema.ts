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

  // 👤 Users
  user: defineTable({
    fullname: v.string(),
    username: v.string(),
    email: v.string(),
    password: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.union(v.literal("admin"), v.literal("client"))),
    resetToken: v.optional(v.string()),
    resetTokenExpiry: v.optional(v.number()),
  }).index("by_email", ["email"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    brand: v.string(),
    category: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    stock: v.number(),
    serialNumber: v.string(),
    images: v.array(v.string()),
    warranty: v.optional(v.number()),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("draft")
    ),
    updatedAt: v.string(),
    createdBy: v.id("user"),
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
    phone: v.optional(v.number()),
  }),

  visits: defineTable({
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    pathsVisited: v.array(v.string()),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
    lastVisitAt: v.number(),
  }),
});
