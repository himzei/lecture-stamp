import express from "express";
import {
  getCompany,
  postMission,
  postRegister,
} from "../controllers/companyControllers.js";

const companyRouter = express.Router();

companyRouter.get("", getCompany);
companyRouter.post("/register", postRegister);
companyRouter.post("/missions", postMission);

export default companyRouter;
