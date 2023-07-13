import express from "express";
import {
  getUsersAll,
  loginSuccess,
  logout,
  postJoin,
  postLogin,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("", getUsersAll);
userRouter.post("/signup", postJoin);
userRouter.post("/signin", postLogin);
userRouter.get("/signin/success", loginSuccess);
userRouter.post("/logout", logout);

export default userRouter;
