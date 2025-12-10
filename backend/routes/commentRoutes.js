const express = require("express");
const router = express.Router();
const db = require("../models");

// Получить все комментарии к статье
router.get("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await db.Comment.findAll({
      where: { articleId },
      order: [["createdAt", "ASC"]],
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// Получить один комментарий по id
router.get("/comment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await db.Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comment" });
  }
});

// Добавить комментарий
router.post("/:articleId/comments", async (req, res) => {
  try {
    const { content } = req.body;
    const { articleId } = req.params;
    const newComment = await db.Comment.create({ content, articleId });
    res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// Обновить комментарий
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await db.Comment.findByPk(id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    comment.content = content;
    await comment.save();

    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Удалить комментарий
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.Comment.destroy({ where: { id } });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
