const express = require("express");
const verifyToken = require("../middleware/AuthMiddleware");
const {getUsers, updatingUser, deletingUser} = require("../controlers/UsersControler");

const router = express.Router();

router.get('/getUsers',getUsers)
router.post('/updateUser',updatingUser)
router.post('/deleteUser',deletingUser)

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized to access this route" });
});

module.exports = router;