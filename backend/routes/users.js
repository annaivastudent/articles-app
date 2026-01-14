const express = require("express");
const router = express.Router();
const db = require("../models");
const User = db.User;
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// получить всех пользователей
router.get("/", auth, isAdmin, async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "email", "role"]
  });
  res.json(users);
});

// изменить роль
router.put("/:id/role", auth, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.role = req.body.role;
  await user.save();

  res.json({ message: "Role updated", user });
});

module.exports = router;
