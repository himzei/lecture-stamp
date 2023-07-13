import express from "express";
import { getUsersAll } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("", getUsersAll);

export default userRouter;
