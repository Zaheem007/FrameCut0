const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "framecut_secret_key");
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
};
const adminOnly = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
module.exports = { protect, adminOnly };