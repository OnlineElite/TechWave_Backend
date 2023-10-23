const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const token = tokenHeader ? tokenHeader.split(" ")[1] : null;
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const secretKey = process.env.SECRET_KEY;

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Token Verification Error:", err);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
