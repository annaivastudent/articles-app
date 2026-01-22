require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const workspaceRoutes = require("./routes/workspaceRoutes");
const authMiddleware = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Публичные маршруты
app.use("/auth", authRoutes);

// Admin/User management
app.use("/users", usersRoutes);

// Защищённые маршруты
app.use("/articles", articleRoutes);
app.use("/workspaces", authMiddleware, workspaceRoutes);

db.sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB error:", err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


require("./ws");
