import express, { type Express, type Request, type Response } from "express";
import productRouter from "./product.routes.ts";

const router = express.Router();

router.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "Test endpoint is working!" });
});

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

//------- Product Routes -------------------------------------------
router.use("/products", productRouter);

export default router;
