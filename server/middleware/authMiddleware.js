const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send("Unauthorized: No token provided");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.body can be undefined on GET requests — always initialize it
    if (!req.body) req.body = {};
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).send("Unauthorized");
  }
};