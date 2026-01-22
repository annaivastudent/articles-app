  const express = require("express");
  const router = express.Router();

  const db = require("../models");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");
  const { Op } = require("sequelize");

  const Article = db.Article;
  const ArticleVersion = db.ArticleVersion;

  const auth = require("../middleware/auth");
  const PDFDocument = require("pdfkit");

  const he = require("he");

  // Папка для загрузок
  const UPLOAD_DIR = path.join(__dirname, "../uploads");
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

  // Настройка хранения файлов
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) =>
      cb(null, Date.now() + path.extname(file.originalname)),
  });

  const fileFilter = (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    allowed.includes(ext)
      ? cb(null, true)
      : cb(new Error("Only JPG, PNG, PDF allowed"));
  };

  const upload = multer({ storage, fileFilter });


  // -------------------------
  // ПУБЛИЧНЫЙ экспорт PDF
  // -------------------------
  router.get("/:id/export", async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);

      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }

      const doc = new PDFDocument();

      doc.registerFont("Roboto", path.join(__dirname, "../fonts/Roboto-Regular.ttf"));
      doc.font("Roboto");


      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=article_${article.id}.pdf`
      );

      doc.pipe(res);

      doc.fontSize(20).text(article.title, { underline: true });
      doc.moveDown();

      doc.fontSize(12).text(`Author ID: ${article.userId}`);
      doc.text(`Created: ${article.createdAt.toLocaleString()}`);
      doc.moveDown();

      const raw = article.content || "";
      const cleanText = he.decode(raw.replace(/<[^>]+>/g, ""));

      doc.fontSize(14).text(cleanText, { align: "left" });


      doc.end();
    } catch (err) {
      console.error("PDF export error:", err);
      res.status(500).json({ error: "Failed to export PDF" });
    }
  });


  // -------------------------
  // Получить все статьи
  // -------------------------
  router.get("/", async (req, res) => {
    const { search } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const articles = await Article.findAll({
      where,
      attributes: ["id", "title", "createdAt"],
      order: [["createdAt", "DESC"]]
    });

    res.json(articles);
  });


  // -------------------------
  // Получить статью по ID
  // -------------------------
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


  // -------------------------
  // Создать статью
  // -------------------------
  router.post("/", auth, upload.single("attachment"), async (req, res) => {
    try {
      const attachmentPath = req.file ? "/uploads/" + req.file.filename : null;

      const article = await Article.create({
        title: req.body.title,
        content: req.body.content,
        attachment: attachmentPath,
        workspaceId: req.body.workspaceId || null,
        userId: req.user.id,
      });

      res.status(201).json(article);
    } catch (err) {
      console.error("Ошибка при создании статьи:", err);
      res.status(500).json({ error: "Failed to create article" });
    }
  });


  // -------------------------
  // Редактирование статьи
  // -------------------------
  router.put("/:id/edit", auth, upload.single("attachment"), async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return res.status(404).json({ error: "Not found" });

      const isOwner = article.userId === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const attachmentPath = req.file
        ? "/uploads/" + req.file.filename
        : article.attachment;

      await article.update({
        title: req.body.title,
        content: req.body.content,
        attachment: attachmentPath,
      });

      res.json(article);
    } catch (err) {
      console.error("Ошибка при редактировании:", err);
      res.status(500).json({ error: "Failed to update article" });
    }
  });


  // -------------------------
  // Создание версии статьи
  // -------------------------
  router.put("/:id", auth, upload.single("attachment"), async (req, res) => {
    try {
      const original = await Article.findByPk(req.params.id);
      if (!original)
        return res.status(404).json({ error: "Original article not found" });

      const latestVersion = await ArticleVersion.max("version", {
        where: { articleId: original.id },
      });

      const newVersion = await ArticleVersion.create({
        articleId: original.id,
        version: (latestVersion || 0) + 1,
        title: req.body.title || original.title,
        content: req.body.content || original.content,
        attachment: req.file
          ? "/uploads/" + req.file.filename
          : original.attachment,
      });

      res.status(201).json(newVersion);
    } catch (err) {
      console.error("Ошибка при создании версии:", err);
      res.status(500).json({ error: "Failed to create article version" });
    }
  });


  // -------------------------
  // Получить все версии
  // -------------------------
  router.get("/:id/versions", auth, async (req, res) => {
    try {
      const versions = await ArticleVersion.findAll({
        where: { articleId: req.params.id },
        order: [["version", "ASC"]],
      });
      res.json(versions);
    } catch (err) {
      console.error("Ошибка при получении версий:", err);
      res.status(500).json({ error: "Failed to fetch versions" });
    }
  });


  // -------------------------
  // Удалить статью
  // -------------------------
  router.delete("/:id", auth, async (req, res) => {
    try {
      const article = await Article.findByPk(req.params.id);
      if (!article) return res.status(404).json({ error: "Not found" });

      const isOwner = article.userId === req.user.id;
      const isAdmin = req.user.role === "admin";

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await article.destroy();
      res.json({ success: true });
    } catch (err) {
      console.error("Ошибка при удалении статьи:", err);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });


  module.exports = router;
