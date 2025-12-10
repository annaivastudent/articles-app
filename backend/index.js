const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const app = express();
const PORT = 5000;

// импорт роутов
const articlesRouter = require("./routes/articles");
const commentsRouter = require("./routes/commentRoutes");
const workspacesRouter = require("./routes/workspaceRoutes");

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// подключаем роуты
app.use("/articles", articlesRouter);
app.use("/comments", commentsRouter);
app.use("/workspaces", workspacesRouter);

// запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
