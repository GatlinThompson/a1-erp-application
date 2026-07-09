import { z } from "zod";
import { ProductType } from "../generated/prisma/client.ts";

const componentRefSchema = z.object({
    quantity: z.number().int().positive(),
});

export const createProductSchema = z.object({
    sku: z.string().trim().min(1, "sku is required"),
    name: z.string().trim().min(1).optional().nullable(),
    quantity_on_hand: z.number().int().nonnegative().optional(),
    reorder_point: z.number().int().nonnegative().optional(),
    price: z.number().nonnegative(),
    type: z.nativeEnum(ProductType),
    parts: z.array(componentRefSchema.extend({ partId: z.number().int().positive() })).optional(),
    hardwares: z.array(componentRefSchema.extend({ hardwareId: z.number().int().positive() })).optional(),
    hardwareKits: z.array(componentRefSchema.extend({ kitId: z.number().int().positive() })).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
