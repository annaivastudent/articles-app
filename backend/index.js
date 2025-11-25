import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import cors from "cors";
import { fileURLToPath } from "url";
import { WebSocketServer } from "ws";
import db from "./models/index.cjs";

db.sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB error:", err));

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

app.get("/articles", async (req, res) => {
  const articles = await db.Article.findAll();
  res.json(articles);
});

app.get("/articles/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  res.json(article);
});


app.post("/articles", upload.single("attachment"), async (req, res) => {
  const attachmentPath = req.file ? "/uploads/" + req.file.filename : null;

  const article = await db.Article.create({
    title: req.body.title,
    content: req.body.content,
    attachment: attachmentPath
  });

  res.json(article);
});


app.put("/articles/:id", upload.single("attachment"), async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });

  const attachmentPath = req.file ? "/uploads/" + req.file.filename : article.attachment;

  await article.update({
    title: req.body.title,
    content: req.body.content,
    attachment: attachmentPath
  });

  res.json(article);
});


app.delete("/articles/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });

  await article.destroy();
  res.json({ success: true });
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
