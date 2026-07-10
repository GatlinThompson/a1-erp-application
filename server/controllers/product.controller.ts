import { type Request, type Response } from 'express';
import prisma from '@lib/prisma.js';
import productServices from '@services/products.services.js';
import { Prisma } from '../generated/prisma/client.ts';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '@schemas/product.schema.js';

const productController = {
    /**
     * Retrieves all products.
     * @param req  The request object
     * @param res  The response object
     *  @returns  A list of all products
     */
    getAllProducts: async (req: Request, res: Response) => {
        try {
            const products = await productServices.getAllProducts();

            
            if (!products) {
                return res.status(404).json({ error: "No products found" });
            }

            res.status(200).json(products);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    
    /**
     * Retrieves a product by its SKU.
     * @param req  The request object
     * @param res  The response object
     * @returns  The product with the given SKU, or a 404 error if not found
     */
    getProductBySku: async (req: Request, res: Response) => {
        try {
            const product = await productServices.getProductBySku(req.params.sku);
            
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            res.status(200).json(product);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * Creates a new product.
     * @param req  The request object
     * @param res  The response object
     * @returns  The created product
     */
    createProduct: async (req: Request, res: Response) => {
        try {
            const parsed = createProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid request body", details: z.flattenError(parsed.error) });
            }

            const product = await productServices.createProduct(parsed.data);
            res.status(201).json({ message: `${product.sku} created successfully`, product });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2002") {
                    return res.status(400).json({ error: "Product already includes that component" });
                }
                if (error.code === "P2003" || error.code === "P2025") {
                    return res.status(400).json({ error: "One or more referenced parts, hardware, or hardware kits do not exist" });
                }
            }
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * Updates a product by its SKU.
     * @param req  The request object
     * @param res  The response object
     * @returns  The updated product
     */
    updateProduct: async (req: Request, res: Response) => {
        try {
            const parsed = updateProductSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "Invalid request body", details: z.flattenError(parsed.error) });
            }

            const product = await productServices.updateProduct(req.params.sku, parsed.data);
            res.status(200).json({ message: `${product.sku} updated successfully`, product });
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === "P2025") {
                    return res.status(404).json({ error: "Product not found" });
                }
                if (error.code === "P2002") {
                    return res.status(400).json({ error: "Another product already uses that sku" });
                }
            }
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * Archives a product by its SKU.
     * @param req  The request object
     * @param res  The response object
     * @returns  The archived product
     */
    archiveProduct: async (req: Request, res: Response) => {
        try {
            const product = await productServices.archiveProduct(req.params.sku);

            
            if (!product) {
                return res.status(404).json({ error: "Product not found" });
            }

            res.status(200).json({ message: `${product.sku} archived successfully`, product });

        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    /**
     * Unarchives a product by its SKU.
     * @param req  The request object
     * @param res  The response object
     * @returns  The unarchived product
     */
    unarchiveProduct: async (req: Request, res: Response) => {
        try {
            const product = await productServices.unarchiveProduct(req.params.sku);
            res.status(200).json({ message: `${product.sku} unarchived successfully`, product });
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

    export default productController;
