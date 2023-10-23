const express = require("express");
const { register, login, logout } = require("../controlers/AuthControler");
const verifyToken = require("../middleware/AuthMiddleware");


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized to access this route" });
});

module.exports = router;