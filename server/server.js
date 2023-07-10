import express from "express";
import path from "path";

const __dirname = path.resolve();

const app = express();

const PORT = 8080;

app.use(express.static("build"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
