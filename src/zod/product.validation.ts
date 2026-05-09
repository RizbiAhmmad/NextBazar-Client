import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().min(5, "Short description is required"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  purchasePrice: z.coerce.number().positive("Purchase price must be positive"),
  regularPrice: z.coerce.number().positive("Regular price must be positive"),
  sellPrice: z.coerce.number().positive("Sell price must be positive"),
  tags: z.string(), // We'll parse this into an array before sending
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
