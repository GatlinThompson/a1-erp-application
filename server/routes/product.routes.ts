import express, { type Request, type Response } from "express";
import prisma from "@lib/prisma.js";
import productController from "@controllers/product.controller.js";

const productRouter: express.Router = express.Router();

productRouter.get("/",  productController.getAllProducts);

productRouter.get("/:sku", productController.getProductBySku);
    
productRouter.post("/", productController.createProduct);


export default productRouter;
