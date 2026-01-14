const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key";

module.exports = async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Authorization header missing" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ error: "Invalid auth header" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(payload.id);
    if (!user)
      return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
