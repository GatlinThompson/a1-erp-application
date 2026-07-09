import prisma from "@lib/prisma.js";
import type { CreateProductInput } from "@schemas/product.schema.js";

const componentsInclude = {
    parts: {
        select: {
            quantity: true,
            part: {
                select: {
                    id: true,
                    sku: true,
                    name: true,
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


    // Creates a product along with its parts/hardwares/hardware kits in a
    // single nested write. Prisma runs nested relation writes in one
    // transaction, so an invalid or duplicate component reference rolls
    // back the entire create instead of leaving a partial product behind.
    createProduct: async (input: CreateProductInput) => {
        const product = await prisma.product.create({
            data: {
                sku: input.sku.toUpperCase(),
                name: input.name,
                quantity_on_hand: input.quantity_on_hand ?? 0,
                reorder_point: input.reorder_point ?? 0,
                price: input.price,
                type: input.type,
                parts: input.parts?.length
                    ? { create: input.parts.map(({ partId, quantity }) => ({ partId, quantity })) }
                    : undefined,
                hardwares: input.hardwares?.length
                    ? { create: input.hardwares.map(({ hardwareId, quantity }) => ({ hardwareId, quantity })) }
                    : undefined,
                hardware_kits: input.hardwareKits?.length
                    ? { create: input.hardwareKits.map(({ kitId, quantity }) => ({ kitId, quantity })) }
                    : undefined,
            },
            include: componentsInclude,
        });
        return product;
    },
};

export default productServices;