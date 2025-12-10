const express = require("express");
const router = express.Router();
const db = require("../models");
const Workspace = db.Workspace;

// Создать workspace
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const workspace = await Workspace.create({ name });
    res.status(201).json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create workspace" });
  }
});

// Получить все workspaces
router.get("/", async (req, res) => {
  try {
    const workspaces = await Workspace.findAll();
    res.json(workspaces);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspaces" });
  }
});

// Получить workspace по id
router.get("/:id", async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) return res.status(404).json({ error: "Not found" });
    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch workspace" });
  }
});

// Обновить workspace
router.put("/:id", async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) return res.status(404).json({ error: "Not found" });

    workspace.name = req.body.name;
    await workspace.save();

    res.json(workspace);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update workspace" });
  }
});

// Удалить workspace
router.delete("/:id", async (req, res) => {
  try {
    const workspace = await Workspace.findByPk(req.params.id);
    if (!workspace) return res.status(404).json({ error: "Not found" });

    await workspace.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete workspace" });
  }
});

module.exports = router;
