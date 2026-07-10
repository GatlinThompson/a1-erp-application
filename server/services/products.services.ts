import prisma from "@lib/prisma.js";
import type { CreateProductInput, UpdateProductInput } from "@schemas/product.schema.js";
import { ProductType, Prisma } from "../generated/prisma/client.ts";

const componentsInclude = {
    parts: {
        select: {
            quantity: true,
            part: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    quantity_on_hand: true,
                },
            },
        },
    },
    hardwares: {
        select: {
            quantity: true,
            hardware: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    quantity_on_hand: true,
                },
            },
        },
    },
    hardware_kits: {
        select: {
            quantity: true,
            kit: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
                    quantity_on_hand: true,
                },
            },
        },
    },
} as const;

type ComponentRef = {
    quantity: number;
    id?: number;
    sku?: string;
    name?: string | null;
    price?: number;
};

// Resolves a component reference to a product id: uses `id` directly if
// given, otherwise finds an existing product by `sku` or creates a new one
// of the given type. Runs on the transaction client so it either commits
// with the rest of the product creation or rolls back with it.
async function resolveComponentId(tx: Prisma.TransactionClient, ref: ComponentRef, type: ProductType) {
    if (ref.id !== undefined) {
        return ref.id;
    }
    const sku = ref.sku!.toUpperCase();
    const component = await tx.product.upsert({
        where: { sku },
        update: {},
        create: {
            sku,
            name: ref.name ?? null,
            price: ref.price ?? 0,
            type,
        },
        select: { id: true },
    });
    return component.id;
}

const productServices = {
  getAllProducts: async () => {
    const products = await prisma.product.findMany({});
    return products;
  },
    getProductBySku: async (sku: string) => {
        const product = await prisma.product.findUnique({
            where: {
                sku: sku.toLocaleUpperCase(),
            },
           include: componentsInclude,
        });
        return product;
    },


    // Creates a product along with its parts/hardwares/hardware kits.
    // Each component may reference an existing product (`id`) or describe
    // a new one to create (`sku`/`name`/`price`), which is resolved via
    // find-or-create. The whole operation runs in one transaction, so an
    // invalid reference or a failure anywhere rolls everything back instead
    // of leaving a partial product or orphaned components behind.
    createProduct: async (input: CreateProductInput) => {
        return prisma.$transaction(async (tx) => {
            const partLinks = [];
            for (const part of input.parts ?? []) {
                const partId = await resolveComponentId(tx, part, ProductType.PART);
                partLinks.push({ partId, quantity: part.quantity });
            }

            const hardwareLinks = [];
            for (const hardware of input.hardwares ?? []) {
                const hardwareId = await resolveComponentId(tx, hardware, ProductType.HARDWARE);
                hardwareLinks.push({ hardwareId, quantity: hardware.quantity });
            }

            const kitLinks = [];
            for (const kit of input.hardwareKits ?? []) {
                const kitId = await resolveComponentId(tx, kit, ProductType.HARDWARE_KIT);
                kitLinks.push({ kitId, quantity: kit.quantity });
            }

            return tx.product.create({
                data: {
                    sku: input.sku.toUpperCase(),
                    name: input.name,
                    quantity_on_hand: input.quantity_on_hand ?? 0,
                    reorder_point: input.reorder_point ?? 0,
                    price: input.price,
                    type: input.type,
                    location: input.location ?? null,
                    parts: partLinks.length ? { create: partLinks } : undefined,
                    hardwares: hardwareLinks.length ? { create: hardwareLinks } : undefined,
                    hardware_kits: kitLinks.length ? { create: kitLinks } : undefined,
                },
                include: componentsInclude,
            });
        });
    },

    // Updates a product's own fields and, for any of parts/hardwares/
    // hardwareKits that are present in `data`, replaces that relation's
    // full set of links (add, edit quantity, or remove all happen by
    // submitting the new complete list). A key left out of `data` leaves
    // that relation untouched. Runs in one transaction so component
    // resolution + the relation replace + the scalar update all commit or
    // roll back together.
    updateProduct: async (sku: string, data: UpdateProductInput) => {
        return prisma.$transaction(async (tx) => {
            let partLinks: { partId: number; quantity: number }[] | undefined;
            if (data.parts !== undefined) {
                partLinks = [];
                for (const part of data.parts) {
                    const partId = await resolveComponentId(tx, part, ProductType.PART);
                    partLinks.push({ partId, quantity: part.quantity });
                }
            }

            let hardwareLinks: { hardwareId: number; quantity: number }[] | undefined;
            if (data.hardwares !== undefined) {
                hardwareLinks = [];
                for (const hardware of data.hardwares) {
                    const hardwareId = await resolveComponentId(tx, hardware, ProductType.HARDWARE);
                    hardwareLinks.push({ hardwareId, quantity: hardware.quantity });
                }
            }

            let kitLinks: { kitId: number; quantity: number }[] | undefined;
            if (data.hardwareKits !== undefined) {
                kitLinks = [];
                for (const kit of data.hardwareKits) {
                    const kitId = await resolveComponentId(tx, kit, ProductType.HARDWARE_KIT);
                    kitLinks.push({ kitId, quantity: kit.quantity });
                }
            }

            return tx.product.update({
                where: { sku: sku.toUpperCase() },
                data: {
                    sku: data.sku ? data.sku.toUpperCase() : undefined,
                    name: data.name,
                    quantity_on_hand: data.quantity_on_hand,
                    reorder_point: data.reorder_point,
                    price: data.price,
                    type: data.type,
                    location: data.location ?? null,
                    parts: partLinks ? { deleteMany: {}, create: partLinks } : undefined,
                    hardwares: hardwareLinks ? { deleteMany: {}, create: hardwareLinks } : undefined,
                    hardware_kits: kitLinks ? { deleteMany: {}, create: kitLinks } : undefined,
                },
                include: componentsInclude,
            });
        });
    }
};

export default productServices;
