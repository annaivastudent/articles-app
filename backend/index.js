import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
const UPLOAD_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only JPG, PNG, and PDF files allowed"));
};

const upload = multer({ storage, fileFilter });

app.get("/articles", (req, res) => {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith(".json"));
  const articles = files.map(f => JSON.parse(fs.readFileSync(path.join(DATA_DIR, f))));
  res.json(articles);
});

app.get("/articles/:id", (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

app.post("/articles", upload.single("attachment"), (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content required" });

  const id = Date.now().toString();
  const article = { id, title, content, attachments: [] };
  if (req.file) article.attachments.push(`/uploads/${req.file.filename}`);
  fs.writeFileSync(path.join(DATA_DIR, `${id}.json`), JSON.stringify(article, null, 2));
  broadcast(`New article "${title}" was created`);
  res.status(201).json({ message: "Article saved", id });
});

app.put("/articles/:id", upload.single("attachment"), (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const filePath = path.join(DATA_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  const article = JSON.parse(fs.readFileSync(filePath));
  article.title = title;
  article.content = content;
  if (req.file) {
    article.attachments = article.attachments || [];
    article.attachments.push(`/uploads/${req.file.filename}`);
  }
  fs.writeFileSync(filePath, JSON.stringify(article, null, 2));
  broadcast(`Article "${title}" was updated`);
  res.json({ message: "Article updated" });
});

app.delete("/articles/:id", (req, res) => {
  const filePath = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "Not found" });
  fs.unlinkSync(filePath);
  broadcast("Article was deleted");
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ port: 5001 });
wss.on("connection", (ws) => {
  console.log("Новый клиент подключился");
  wss.on("error", (err) => console.error("Ошибка WebSocket-сервера:", err));
  ws.on("close", () => console.log("Клиент отключился"));
});
console.log("WebSocket server running on ws://localhost:5001");

function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(JSON.stringify({ message }));
  });
}

wss.on("connection", ws => {
  console.log("Client connected via WebSocket");
  ws.on("close", () => console.log("Client disconnected"));
});
