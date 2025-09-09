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
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.coerce.number().optional(),
  currency: z.string().default("Rwf"),
  stock: z.coerce.number().min(1, "Stock cannot be negative").int(),
  sku: z.string().min(1, "SKU is required"),
  rating: z.coerce.number().min(0).max(5).optional(),
  reviewCount: z.coerce.number().min(0).int().optional(),
  isNew: z.boolean().default(false),
  isOnSale: z.boolean().default(false),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Specification key is required"),
        value: z.string().min(1, "Specification value is required"),
      })
    ),
  tags: z.array(z.string()).optional(),
  images: z
    .array(z.string())
    .min(1, "At least one image is required"),
  warranty: z.coerce.number().min(1, "Warranty in months is required"),

  status: z.enum(["active", "inactive", "draft"]).default("draft"),
});