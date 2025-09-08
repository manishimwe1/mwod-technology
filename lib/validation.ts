import z from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional(),
  currency: z.string().default("Rwf"),
  stock: z.number().min(0, "Stock cannot be negative").int(),
  sku: z.string().min(1, "SKU is required"),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).int().optional(),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Specification key is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    )
    .optional(),
  tags: z.array(z.string()).optional(),
  images: z
    .array(z.string().url("Must be a valid URL"))
    .min(1, "At least one image is required"),
  weight: z.number().positive().optional(),
  dimensions: z
    .object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    })
    .optional(),
  warranty: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]).default("draft"),
});