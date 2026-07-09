import "dotenv/config";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "@routes/routes.js";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
