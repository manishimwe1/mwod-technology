// ./convex/functions/invoice.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// CREATE INVOICE
export const createInvoice = mutation({
  args: {
    clientName: v.string(),
    clientPhone: v.optional(v.string()),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        unitPrice: v.number(),
      })
    ),
    status: v.union(v.literal("draft"), v.literal("sent"), v.literal("paid")),
    notes: v.optional(v.string()),
    totalAmount: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoice", args);
  },
});

// GET ALL INVOICES
export const getInvoices = query({
  handler: async (ctx) => {
    return await ctx.db.query("invoice").order( "desc").collect();
  },
});

// GET SINGLE INVOICE BY ID
export const getInvoice = query({
  args: {
    id: v.id("invoice"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// UPDATE INVOICE
export const updateInvoice = mutation({
  args: {
    id: v.id("invoice"),
    clientName: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
    items: v.optional(
      v.array(
        v.object({
          description: v.string(),
          quantity: v.number(),
          unitPrice: v.number(),
        })
      )
    ),
    status: v.optional(v.union(v.literal("draft"), v.literal("sent"), v.literal("paid"))),
    notes: v.optional(v.string()),
    totalAmount: v.optional(v.number()),
    updatedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const { id, ...updateData } = args;
    return await ctx.db.patch(id, updateData);
  },
});

// DELETE INVOICE
export const deleteInvoice = mutation({
  args: {
    id: v.id("invoice"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
