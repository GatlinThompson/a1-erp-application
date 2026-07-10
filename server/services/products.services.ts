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

// Resolves a list of component refs to relation-create rows keyed by
// `fkField` (e.g. "partId", "hardwareId", "kitId") — the field name Prisma
// actually expects for that relation's nested `create`. Returns `undefined`
// when `refs` itself is `undefined`, so callers can tell "not provided,
// leave untouched" apart from "provided as an empty list, clear it".
async function resolveComponentLinks<K extends string>(
    tx: Prisma.TransactionClient,
    pieces: ComponentRef[] | undefined,
    type: ProductType,
    fkField: K,
): Promise<(Record<K, number> & { quantity: number })[] | undefined> {
    if (pieces === undefined) {
        return undefined;
    }
    const links: (Record<K, number> & { quantity: number })[] = [];
    for (const piece of pieces) {
        const id = await resolveComponentId(tx, piece, type);
        links.push({ [fkField]: id, quantity: piece.quantity } as Record<K, number> & { quantity: number });
    }
    return links;
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
    createProduct: async (data: CreateProductInput) => {

        return prisma.$transaction(async (tx) => {
        
            //Check if parts/kits/hardwares are valid and resolve them to product ids, creating new products if necessary. This is done in a transaction so that if any of the component resolutions fail, the whole operation rolls back.
            const partLinks = await resolveComponentLinks(tx, data.parts, ProductType.PART, "partId");
            const hardwareLinks = await resolveComponentLinks(tx, data.hardwares, ProductType.HARDWARE, "hardwareId");
            const kitLinks = await resolveComponentLinks(tx, data.hardwareKits, ProductType.HARDWARE_KIT, "kitId");

            //Create the product with the resolved component links. The `create` operation includes the component relations if they exist, otherwise they are omitted.
            return tx.product.create({
                data: {
                    sku: data.sku.toUpperCase(),
                    name: data.name,
                    quantity_on_hand: data.quantity_on_hand ?? 0,
                    reorder_point: data.reorder_point ?? 0,
                    price: data.price,
                    type: data.type,
                    location: data.location ?? null,
                    parts: partLinks?.length ? { create: partLinks } : undefined,
                    hardwares: hardwareLinks?.length ? { create: hardwareLinks } : undefined,
                    hardware_kits: kitLinks?.length ? { create: kitLinks } : undefined,
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
            const partLinks = await resolveComponentLinks(tx, data.parts, ProductType.PART, "partId");
            const hardwareLinks = await resolveComponentLinks(tx, data.hardwares, ProductType.HARDWARE, "hardwareId");
            const kitLinks = await resolveComponentLinks(tx, data.hardwareKits, ProductType.HARDWARE_KIT, "kitId");

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
