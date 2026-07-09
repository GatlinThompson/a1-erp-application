import { type Request, type Response } from 'express';
import prisma from '@lib/prisma.js';
import productServices from '@services/products.services.js';
import { Prisma } from '../generated/prisma/client.ts';
import { z } from 'zod';
import { createProductSchema } from '@schemas/product.schema.js';

const productController = {
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
};

    export default productController;
