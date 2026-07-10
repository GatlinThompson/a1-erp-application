import { z } from "zod";
import { ProductType } from "../generated/prisma/client.ts";

// A component can reference an existing product (`id`) or describe a new
// one to create on the fly (`sku`, plus optional `name`/`price`). At least
// one of the two must be present.
export const componentRefSchema = z
    .object({
        quantity: z.number().int().positive(),
        id: z.number().int().positive().optional(),
        sku: z.string().trim().min(1).optional(),
        name: z.string().trim().min(1).optional().nullable(),
        price: z.number().nonnegative().optional(),
        location: z.string().trim().min(1).optional().nullable(),
    })
    .refine((ref) => ref.id !== undefined || ref.sku !== undefined, {
        message: "Provide either an existing component id or a sku to create a new one",
        path: ["id"],
    });

const baseProductSchema = z.object({
    sku: z.string().trim().min(1, "sku is required"),
    name: z.string().trim().min(1).optional().nullable(),
    quantity_on_hand: z.number().int().nonnegative().optional(),
    reorder_point: z.number().int().nonnegative().optional(),
    price: z.number().nonnegative(),
    location: z.string().trim().min(1).optional().nullable(),
    type: z.nativeEnum(ProductType),
    archived: z.boolean().optional(),
    allocated_quantity: z.number().int().nonnegative().optional(),
});

export const createProductSchema = baseProductSchema.extend({
    parts: z.array(componentRefSchema).optional(),
    hardwares: z.array(componentRefSchema).optional(),
    hardwareKits: z.array(componentRefSchema).optional(),
});

// Omitting `parts`/`hardwares`/`hardwareKits` leaves that relation
// untouched. Providing one (even as an empty array) replaces the full set
// of links for that relation — it's a per-relation full replace, not a
// diff/patch.
export const updateProductSchema = baseProductSchema.partial().extend({
    parts: z.array(componentRefSchema).optional(),
    hardwares: z.array(componentRefSchema).optional(),
    hardwareKits: z.array(componentRefSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ComponentRef = z.infer<typeof componentRefSchema>;
