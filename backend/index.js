import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DATA_DIR = path.join(__dirname, "data");

app.use(cors());
app.use(express.json());


if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}


app.get("/articles", (req, res) => {
  const files = fs.readdirSync(DATA_DIR);
  const articles = files.map((file) => {
    const filePath = path.join(DATA_DIR, file);
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return { id: path.parse(file).name, title: content.title };
  });
  res.json(articles);
});


app.get("/articles/:id", (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }
  const article = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(article);
});


app.post("/articles", (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  const id = Date.now().toString();
  const filePath = path.join(DATA_DIR, `${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify({ id, title, content }, null, 2));
  res.status(201).json({ message: "Article saved", id });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
