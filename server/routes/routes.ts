import express, { type Express, type Request, type Response } from "express";
import productRouter from "./product.routes.ts";
import authRouter from "./auth.routes.ts";
import userRouter from "./user.routes.ts";

const router = express.Router();

router.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "Test endpoint is working!" });
});

router.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API is running" });
});

//------- Product Routes -------------------------------------------
router.use("/products", productRouter);

//------- Auth Routes -------------------------------------------
router.use("/auth", authRouter);

//------- User Routes -------------------------------------------
router.use("/users", userRouter);

export default router;
