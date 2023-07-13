import express from "express";
import { getUsersAll, postJoin } from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("", getUsersAll);
userRouter.post("/postJoin", postJoin);

export default userRouter;
