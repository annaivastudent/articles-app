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
  const { id } = req.params;
  const filePath = path.join(DATA_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }

  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  res.json(content);
});

app.put("/articles/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const filePath = path.join(DATA_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content required" });
  }

  const updated = { id, title, content };
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  res.json({ message: "Article updated", article: updated });
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

app.delete("/articles/:id", (req, res) => {
  const { id } = req.params;
  const filePath = path.join(DATA_DIR, `${id}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Article not found" });
  }

  fs.unlinkSync(filePath);
  res.json({ message: "Article deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
