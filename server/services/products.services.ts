import prisma from "@lib/prisma.js";
import type { CreateProductInput, UpdateProductInput, ComponentRef } from "@schemas/product.schema.js";
import { ProductType, Prisma } from "../generated/prisma/client.ts";
import componentsInclude  from "@utils/product.utils.js";


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
            location: ref.location ?? null,
            type,
        },
        select: { id: true },
    });
    return component.id;
}

/**
 * Resolves an array of component references to an array of objects containing the foreign key field and quantity.
 * @param tx  The Prisma transaction client to use for database operations
 * @param pieces  An array of component references (either existing product ids or new product skus)
 * @param type  The type of the components (e.g., PART, HARDWARE, HARDWARE_KIT)
 * @param fkField  The foreign key field name to use in the resulting objects (e.g., "partId", "hardwareId", "kitId")
 * @returns  An array of objects containing the foreign key field and quantity, or `undefined` if no pieces were provided
 */
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



/**
 * Resolves the component relations for a product, creating new products as necessary.
 * @param tx  The Prisma transaction client to use for database operations
 * @param input  An object containing optional arrays of component references for parts, hardwares, and hardware_kits
* @returns  An object containing the resolved component relations for parts, hardwares, and hardware_kits. Each relation is an array of objects with the foreign key field (e.g., partId, hardwareId, kitId) and the quantity.
 */
async function resolveComponentRelations(
    tx: Prisma.TransactionClient,
    input: { parts?: ComponentRef[]; hardwares?: ComponentRef[]; hardwareKits?: ComponentRef[] },
) {
    const parts = await resolveComponentLinks(tx, input.parts, ProductType.PART, "partId");
    const hardwares = await resolveComponentLinks(tx, input.hardwares, ProductType.HARDWARE, "hardwareId");
    const hardware_kits = await resolveComponentLinks(tx, input.hardwareKits, ProductType.HARDWARE_KIT, "kitId");
    return { parts, hardwares, hardware_kits };
}

// Service layer for product-related operations, including fetching, creating, updating, archiving, and unarchiving products. Each operation is performed within a transaction to ensure data integrity, especially when dealing with component relations that may involve creating new products on the fly.
const productServices = {
  
    /**
     * Fetches all products from the database.
     * @returns  All products in the database
     */
    getAllProducts: async () => {
        const products = await prisma.product.findMany({});
        return products;
     },

     /**
      * Fetches products by their type from the database.
      * @param type  The type of products to fetch (e.g., PART, HARDWARE, HARDWARE_KIT)
      * @returns  An array of products matching the specified type
      */
     getProducsByType: async (type: ProductType) => {
        const products = await prisma.product.findMany({
            where: {
                type: type,
            },
        });
        return products;
     },

    /**
     * Fetches a product by its SKU, including its components.
     * @param sku  The SKU of the product to fetch
     * @returns  The product with the given SKU, or null if not found
     */
   getProductBySku: async (sku: string) => {
        const product = await prisma.product.findUnique({
            where: {
                sku: sku.toLocaleUpperCase(),
            },
           include: componentsInclude,
        });
        return product;
    },

    /**
     * Creates a new product along with its associated components.
     * @param data  The data for the product to create
     * @returns  The created product
     */
    createProduct: async (data: CreateProductInput) => {

        return prisma.$transaction(async (tx) => {
            //Check if parts/kits/hardwares are valid and resolve them to product ids, creating new products if necessary. This is done in a transaction so that if any of the component resolutions fail, the whole operation rolls back.
            const { parts, hardwares, hardware_kits } = await resolveComponentRelations(tx, data);

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
                    parts: parts?.length ? { create: parts } : undefined,
                    hardwares: hardwares?.length ? { create: hardwares } : undefined,
                    hardware_kits: hardware_kits?.length ? { create: hardware_kits } : undefined,
                },
                include: componentsInclude,
            });
        });
    },

    /**
     * Updates an existing product by its SKU, along with its associated components.
     * @param sku  The SKU of the product to update
     * @param data  The data for the product to update
     * @returns  The updated product
     */
    updateProduct: async (sku: string, data: UpdateProductInput) => {
        return prisma.$transaction(async (tx) => {
            const { parts, hardwares, hardware_kits } = await resolveComponentRelations(tx, data);

            // Update the product with the resolved component links. The `update` operation includes the component relations if they exist, otherwise they are omitted. The `deleteMany: {}` ensures that any existing links are removed before creating the new ones, effectively replacing the full set of links for that relation.
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
                    archived: data.archived,
                    allocated_quantity: data.allocated_quantity,
                    parts: parts ? { deleteMany: {}, create: parts } : undefined,
                    hardwares: hardwares ? { deleteMany: {}, create: hardwares } : undefined,
                    hardware_kits: hardware_kits ? { deleteMany: {}, create: hardware_kits } : undefined,
                },
                include: componentsInclude,
            });
        });
    },

    /**
     * Archives a product by its SKU.
     * @param sku  The SKU of the product to archive
     * @returns  The archived product
     */
    archiveProduct: async (sku: string) => {
        return prisma.product.update({
            where: { sku: sku.toUpperCase() },
            data: { archived: true },
        });
    },

    /**
     * Unarchives a product by its SKU.
     * @param sku  The SKU of the product to unarchive
     * @returns  The unarchived product
     */
    unarchiveProduct: async (sku: string) => {
        return prisma.product.update({
            where: { sku: sku.toUpperCase() },
            data: { archived: false },
        });
    },
};

export default productServices;
