import express from "express";
import {
  getUsersAll,
  kakaoAsyncRegister,
  kakaoLogin,
  loginSuccess,
  logout,
  postEditMissions,
  postJoin,
  postLogin,
} from "../controllers/userControllers.js";

const userRouter = express.Router();

userRouter.get("", getUsersAll);
userRouter.post("/signup", postJoin);
userRouter.post("/signin", postLogin);
userRouter.get("/signin/success", loginSuccess);
userRouter.post("/logout", logout);
userRouter.get("/social/kakao/register", kakaoAsyncRegister);
userRouter.post("/mission/add", postEditMissions);
userRouter.post("/kakao", kakaoLogin);

export default userRouter;
