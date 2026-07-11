import express, { type Request, type Response } from "express";
import productController from "@controllers/product.controller.js";
import { authenticate, authorize } from "@middleware/auth.middleware.js";

const productRouter: express.Router = express.Router();

productRouter.use(authenticate);

productRouter.get("/", productController.getAllProducts);

productRouter.get("/:sku", productController.getProductBySku);

productRouter.post("/", productController.createProduct);

productRouter.put("/:sku", productController.updateProduct);

productRouter.delete(
  "/:sku",
  authorize("MANAGER", "ADMIN"),
  productController.archiveProduct,
);

productRouter.put(
  "/:sku/unarchive",
  authorize("MANAGER", "ADMIN"),
  productController.unarchiveProduct,
);

export default productRouter;
