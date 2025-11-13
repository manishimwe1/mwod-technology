import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getVisitByUserOrAnonymous = query({
  args: {
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.userId) {
      return await ctx.db
        .query("visits")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
    } else if (args.anonymousId) {
      return await ctx.db
        .query("visits")
        .filter((q) => q.eq(q.field("anonymousId"), args.anonymousId))
        .first();
    }
    return null;
  },
});

export const getAllVisits = query({
  args: {},
  handler: async (ctx) => {
    const visits = await ctx.db.query("visits").collect();
    return visits;
  },
});

export const updateOrCreateVisit = mutation({
  args: {
    userId: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
    path: v.string(),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let visit = null;

    if (args.userId) {
      visit = await ctx.db
        .query("visits")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();
    } else if (args.anonymousId) {
      visit = await ctx.db
        .query("visits")
        .filter((q) => q.eq(q.field("anonymousId"), args.anonymousId))
        .first();
    }

    if (visit) {
      // Update existing visit
      const updatedPaths = Array.from(
        new Set([...(visit.pathsVisited ?? []), args.path])
      );
      await ctx.db.patch(visit._id, {
        pathsVisited: updatedPaths,
        lastVisitAt: Date.now(),
      });
      return visit._id;
    } else {
      // Create new visit
      return await ctx.db.insert("visits", {
        userId: args.userId,
        anonymousId: args.anonymousId,
        pathsVisited: [args.path],
        userAgent: args.userAgent ?? "",
        country: args.country ?? "Unknown",
        lastVisitAt: Date.now(),
      });
    }
  },
});

// Create a new visit record
export const createVisit = mutation({
  args: {
    userId: v.optional(v.string()),
    path: v.array(v.string()),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const newVisit = await ctx.db.insert("visits", {
      userId: args.userId,
      pathsVisited: args.path,
      userAgent: args.userAgent,
      country: args.country,
      lastVisitAt: Date.now(),
    });
    return newVisit;
  },
});

// Get all visit records
export const getVisits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("visits").collect();
  },
});

// Get a single visit record by ID
export const getVisitById = query({
  args: {
    id: v.id("visits"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});



// Update a visit record
export const updateVisit = mutation({
  args: {
    id: v.id("visits"),
    userId: v.optional(v.string()),
    path: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    country: v.optional(v.string()),
    createdAt: v.optional(v.number()), // Allow updating createdAt
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
    return ctx.db.get(id);
  },
});

// Delete a visit record
export const deleteVisit = mutation({
  args: {
    id: v.id("visits"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});