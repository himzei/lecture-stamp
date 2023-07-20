import express from "express";
import { postPerformance } from "../controllers/performanceControllers.js";

const performanceRouter = express.Router();

performanceRouter.post("/register", postPerformance);

export default performanceRouter;
