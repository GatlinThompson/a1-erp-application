import express, { type Request, type Response } from "express";
import prisma from "@lib/prisma.js";

const productRouter: express.Router = express.Router();

productRouter.get("/", async (_req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    include: { hardwares: true, parts: true },
  });
  res.json(products);
});

productRouter.get("/:id", async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { hardwares: true, parts: true },
  });
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});

productRouter.post("/", async (req: Request, res: Response) => {
  const product = await prisma.product.create({ data: req.body });
  res.status(201).json(product);
});

productRouter.put("/:id", async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(product);
});

productRouter.delete("/:id", async (req: Request, res: Response) => {
  await prisma.product.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default productRouter;
