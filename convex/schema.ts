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
})
