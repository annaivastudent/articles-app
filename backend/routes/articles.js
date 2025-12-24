const express = require("express");
const router = express.Router();

const db = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Article = db.Article;
const ArticleVersion = db.ArticleVersion;

// Папка для загрузок
const UPLOAD_DIR = path.join(__dirname, "../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Настройка хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
  const ext = path.extname(file.originalname).toLowerCase();
  allowed.includes(ext)
    ? cb(null, true)
    : cb(new Error("Only JPG, PNG, PDF allowed"));
};

const upload = multer({ storage, fileFilter });

// Получить все статьи
router.get("/", async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { articleId: null },
      order: [["createdAt", "DESC"]],
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// Получить статью по ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    let article = await Article.findByPk(id);

    if (!article) {
      article = await ArticleVersion.findOne({
        where: { articleId: id },
        order: [["version", "DESC"]],
      });
      if (!article) return res.status(404).json({ error: "Not found" });
    }

    res.json(article);
  } catch (err) {
    console.error("Ошибка при получении статьи:", err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// Создать статью
router.post("/", upload.single("attachment"), async (req, res) => {
  try {
    const attachmentPath = req.file ? "/uploads/" + req.file.filename : null;
    const article = await Article.create({
      title: req.body.title,
      content: req.body.content,
      attachment: attachmentPath,
      workspaceId: req.body.workspaceId || null,
    });
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: "Failed to create article" });
  }
});

//  Создание версии
router.put("/:id", upload.single("attachment"), async (req, res) => {
  try {
    const original = await Article.findByPk(req.params.id);
    if (!original) return res.status(404).json({ error: "Original article not found" });

    const latestVersion = await ArticleVersion.max("version", {
      where: { articleId: original.id },
    });

    const newVersion = await ArticleVersion.create({
      articleId: original.id,
      version: (latestVersion || 0) + 1,
      title: req.body.title || original.title,
      content: req.body.content || original.content,
      attachment: req.file ? "/uploads/" + req.file.filename : original.attachment,
    });

    res.status(201).json(newVersion);
  } catch (err) {
    console.error("Ошибка при создании версии:", err);
    res.status(500).json({ error: "Failed to create article version" });
  }
});

// Получить все версии
router.get("/:id/versions", async (req, res) => {
  try {
    const versions = await ArticleVersion.findAll({
      where: { articleId: req.params.id },
      order: [["version", "ASC"]],
    });
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch versions" });
  }
});

// Удалить статью
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByPk(req.params.id);
    if (!article) return res.status(404).json({ error: "Not found" });
    await article.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete article" });
  }
});

module.exports = router;
