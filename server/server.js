import "dotenv/config";
import express from "express";
import path from "path";
import session from "express-session";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRouters.js";
import companyRouter from "./routers/companyRouters.js";
import "./db.js";

import MongoStore from "connect-mongo";
import performanceRouter from "./routers/performanceRouters.js";

const __dirname = path.resolve();
const app = express();
const PORT = 8080;

app.use(express.static("build"));

// 새로고침
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.ACCESS_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);

app.use("/api/users", userRouter);
app.use("/api/company", companyRouter);
app.use("/api/performance", performanceRouter);

app.listen(PORT, () => console.log(`📀http://localhost:${PORT}`));
