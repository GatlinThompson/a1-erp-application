import express, { type Request, type Response } from "express";
import { authenticate, authorize } from "@middleware/auth.middleware.js";
import searchController from "@controllers/search.controller.js";

const searchRouter: express.Router = express.Router();

searchRouter.use(authenticate);

searchRouter.get("/", searchController.searchQuery);

export default searchRouter;
