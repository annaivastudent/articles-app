const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/", async (req, res) => {
  const workspaces = await db.Workspace.findAll();
  res.json(workspaces);
});

module.exports = router;
