const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const articlesRouter = require("./routes/articles");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Подключаем маршруты
app.use("/articles", articlesRouter);

db.sequelize.authenticate()
  .then(() => console.log("Database connected"))
  .catch(err => console.error("DB error:", err));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Запуск WebSocket
require("./ws");
