import "dotenv/config";
import express from "express";
import path from "path";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouters.js";
import companyRouter from "./routers/companyRouters.js";
import "./db.js";

// const __dirname = path.resolve();
const app = express();
const PORT = 8080;

app.use(express.static("build"));

// 새로고침
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "/build/index.html"));
// });

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/company", companyRouter);

app.listen(PORT, () => console.log(`📀http://localhost:${PORT}`));
