const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/:articleId/comments", async (req, res) => {
  const { content } = req.body;
  const articleId = req.params.articleId;

  const newComment = await db.Comment.create({
    content,
    articleId
  });

  res.status(201).json(newComment);
});

module.exports = router;
