const express = require("express");
const router = express.Router();
const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(__dirname, "../uploads");
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

// CRUD
router.get("/", async (req, res) => {
  const articles = await db.Article.findAll();
  res.json(articles);
});

router.get("/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  res.json(article);
});

router.post("/", upload.single("attachment"), async (req, res) => {
  const attachmentPath = req.file ? "/uploads/" + req.file.filename : null;
  const article = await db.Article.create({
    title: req.body.title,
    content: req.body.content,
    attachment: attachmentPath
  });
  res.json(article);
});

router.put("/:id", upload.single("attachment"), async (req, res) => {
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

router.delete("/:id", async (req, res) => {
  const article = await db.Article.findByPk(req.params.id);
  if (!article) return res.status(404).json({ error: "Not found" });
  await article.destroy();
  res.json({ success: true });
});

module.exports = router;
