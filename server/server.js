import "dotenv/config";
import express from "express";
import path from "path";
import morgan from "morgan";
import userRouter from "./routers/userRouters.js";
import "./db.js";

const __dirname = path.resolve();
const app = express();
const PORT = 8080;

app.use(express.static("build"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);

app.listen(PORT, () => console.log(`📀http://localhost:${PORT}`));
