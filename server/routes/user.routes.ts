import express from "express";
import userController from "@controllers/user.controller.js";
import { authenticate } from "@middleware/auth.middleware.js";

const userRouter: express.Router = express.Router();

userRouter.use(authenticate);

userRouter.get("/settings", userController.getSettings);

userRouter.put("/settings", userController.updateSettings);

export default userRouter;
